import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import YAML from "yaml";
import classNames from "classnames";
import cytoscape from "cytoscape";
import { IProjectState } from "../../api/interface";
import {
  OspfGraph,
  OspfNoDataError,
  OspfVertexKind,
  buildOspfGraph,
} from "./ospfGraph";
import { ArrowPathIcon, ArrowsPointingInIcon } from "@heroicons/react/24/solid";

const VERTEX_COLORS: { [kind in OspfVertexKind]: string } = {
  router: "#2b6cb0",
  transit: "#91bf8f",
  stub: "#696969",
};

const NODE_W = 100;
const NODE_H = 40;
const MAX_ZOOM = 1.25;

const LEGEND_KEYS: { kind: OspfVertexKind; labelKey: string }[] = [
  { kind: "router", labelKey: "OspfKindRouter" },
  { kind: "transit", labelKey: "OspfKindTransitNetwork" },
  { kind: "stub", labelKey: "OspfKindStubNetwork" },
];

const ospfCyStyle: cytoscape.StylesheetJson = [
  {
    selector: "node",
    style: {
      shape: "rectangle",
      width: NODE_W,
      height: NODE_H,
      "background-color": "#ffffff",
      "border-width": 2,
      "border-color": "data(color)",
      label: "data(name)",
      "text-halign": "center",
      "text-valign": "center",
      color: "data(color)",
      "font-weight": "bold",
      "font-size": 14,
    },
  },
  {
    selector: "edge",
    style: {
      width: 1,
      "curve-style": "straight",
      "source-label": "data(fromLabel)",
      "target-label": "data(toLabel)",
      "source-text-offset": 20,
      "target-text-offset": 20,
      "font-size": 12,
      color: "#00F",
    },
  },
];

interface ITopoNodeAttr {
  type?: string;
}

interface ITopo {
  nodes?: { [key: string]: ITopoNodeAttr | null } | null;
}

export const isOspfRouterType = (type?: string): boolean => {
  const nodeType = type ?? "";
  return nodeType.startsWith("docker.router") || nodeType == "docker.vyos";
};

// Layout box derived from the BFS level structure of the graph (same
// unweighted BFS breadthfirst itself runs from the root), so it is compact
// and depends only on graph content: never on the current zoom. Sizing it
// from the viewport instead (breadthfirst's default) feeds each fit's
// zoom-out back into the next layout's spread, compounding on every switch.
export const ospfLayoutBox = (
  graph: OspfGraph,
): { x1: number; y1: number; w: number; h: number } => {
  const adj = new Map<string, string[]>();
  const link = (from: string, to: string) => {
    const list = adj.get(from) ?? [];
    list.push(to);
    adj.set(from, list);
  };
  for (const e of graph.edges) {
    link(e.source, e.target);
    link(e.target, e.source);
  }

  const depths = new Map<string, number>([[graph.rootId, 0]]);
  const queue = [graph.rootId];
  for (let i = 0; i < queue.length; i++) {
    const next = (depths.get(queue[i]) ?? 0) + 1;
    for (const nb of adj.get(queue[i]) ?? []) {
      if (!depths.has(nb)) {
        depths.set(nb, next);
        queue.push(nb);
      }
    }
  }

  const levelSize: number[] = [];
  for (const d of depths.values()) levelSize[d] = (levelSize[d] ?? 0) + 1;
  const orphans = graph.vertices.length - depths.size;
  if (orphans > 0) levelSize.push(orphans);

  const widest = Math.max(1, ...levelSize);
  return {
    x1: 0,
    y1: 0,
    w: Math.max(400, widest * (NODE_W + 30)),
    h: Math.max(300, levelSize.length * (NODE_H + 50)),
  };
};

export const getEligibleRouters = (topology: string): string[] => {
  let topo: ITopo;
  try {
    topo = (YAML.parse(topology) ?? {}) as ITopo;
  } catch {
    return [];
  }
  const nodes = topo.nodes ?? {};
  return Object.keys(nodes).filter((name) =>
    isOspfRouterType(nodes[name]?.type),
  );
};

type PropsT = {
  prjId: string;
  status: IProjectState;
  topology: string;
};

export default function ProjectOspfGraph({
  prjId,
  status,
  topology,
}: PropsT): React.JSX.Element {
  const { t } = useTranslation();
  const [selected, setSelected] = useState("");
  const [graph, setGraph] = useState<OspfGraph | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const tokenRef = useRef(0);

  const eligible = useMemo(() => getEligibleRouters(topology), [topology]);

  useEffect(() => {
    setGraph(null);
    setError("");
  }, [prjId]);

  useEffect(() => {
    setSelected((prev) =>
      prev != "" && eligible.includes(prev) ? prev : (eligible[0] ?? ""),
    );
  }, [prjId, eligible]);

  useEffect(() => {
    const token = ++tokenRef.current;
    if (selected == "" || !status.running) {
      setGraph(null);
      setError("");
      setLoading(false);
      return;
    }

    setLoading(true);
    const fetchDb = (db: string) =>
      window.api.runNodeExecOnce(prjId, selected, [
        "vtysh",
        "-c",
        `show ip ospf database ${db} json`,
      ]);

    Promise.all([fetchDb("router"), fetchDb("network")]).then(([r, n]) => {
      if (token != tokenRef.current) return;
      setLoading(false);

      if (!r.status) {
        setGraph(null);
        setError(t("OspfExecErrMsg", { error: r.error }));
        return;
      }
      if (!n.status) {
        setGraph(null);
        setError(t("OspfExecErrMsg", { error: n.error }));
        return;
      }

      try {
        setGraph(buildOspfGraph(r.result, n.result));
        setError("");
      } catch (err) {
        setGraph(null);
        setError(
          err instanceof OspfNoDataError
            ? t("OspfNoDataMsg", { name: selected })
            : String(err),
        );
      }
    });
  }, [prjId, selected, refreshTick, status.running]);

  useEffect(() => {
    const cy = cyRef.current;
    if (graph == null) {
      if (cy != null && !cy.destroyed()) cy.elements().remove();
      return;
    }

    const container = containerRef.current;
    if (container == null) return;

    const elements: cytoscape.ElementDefinition[] = [
      ...graph.vertices.map((v) => ({
        group: "nodes" as const,
        data: { id: v.name, name: v.name, color: VERTEX_COLORS[v.kind] },
      })),
      ...graph.edges.map((e) => ({
        group: "edges" as const,
        data: {
          id: e.id,
          source: e.source,
          target: e.target,
          fromLabel: e.cost,
          toLabel: e.interfaceAddress,
        },
      })),
    ];

    let net = cy;
    if (net == null || net.destroyed()) {
      net = cytoscape({
        container,
        style: ospfCyStyle,
        elements,
        wheelSensitivity: 0.2,
      });
      cyRef.current = net;
    } else {
      net.elements().remove();
      net.add(elements);
    }

    const layout = net.elements().layout({
      name: "breadthfirst",
      roots: [graph.rootId],
      fit: false,
      padding: 30,
      boundingBox: ospfLayoutBox(graph),
    });
    layout.one("stop layoutstop", () => {
      net.fit();
      if (net.zoom() > MAX_ZOOM) net.zoom(MAX_ZOOM);
    });
    layout.run();
  }, [graph]);

  useEffect(() => {
    return () => {
      if (cyRef.current != null && !cyRef.current.destroyed()) {
        cyRef.current.destroy();
      }
      cyRef.current = null;
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver == "undefined") return;

    const observer = new ResizeObserver(() => {
      const cy = cyRef.current;
      if (cy != null && !cy.destroyed()) {
        cy.resize();
      }
    });
    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  const fit = () => {
    const cy = cyRef.current;
    if (cy != null && !cy.destroyed()) {
      cy.fit();
    }
  };

  if (eligible.length == 0) {
    return (
      <div className="flex flex-col flex-1 min-w-0 min-h-0 items-center justify-center">
        <span>{t("OspfNoRouterMsg")}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-w-0 min-h-0">
      <div className="relative flex-1 min-h-0">
        {status.running && error != "" && (
          <div className="alert alert-error absolute top-2 left-2 right-2 z-20">
            <span>{error}</span>
          </div>
        )}
        {status.running && loading && graph == null && error == "" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="loading loading-bars loading-lg"></span>
          </div>
        )}
        {!status.running && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-base-100">
            <span>{t("ProjectNotRunningMsg")}</span>
          </div>
        )}
        {graph != null && (
          <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 p-2 rounded-box border border-base-300 bg-base-100">
            {LEGEND_KEYS.map(({ kind, labelKey }) => (
              <div key={kind} className="flex items-center gap-2">
                <span
                  className="inline-block h-3 w-3"
                  style={{
                    backgroundColor: "#ffffff",
                    border: `2px solid ${VERTEX_COLORS[kind]}`,
                  }}
                />
                <span>{t(labelKey)}</span>
              </div>
            ))}
          </div>
        )}
        <div
          ref={containerRef}
          data-theme="light"
          className="w-full h-full min-h-0"
        />
      </div>

      <div className="flex items-center gap-2 p-2 bg-base-200">
        <div role="tablist" className="tabs tabs-box flex-1 min-w-0">
          {eligible.map((name) => (
            <a
              key={name}
              role="tab"
              aria-selected={name == selected}
              className={classNames("tab", {
                "tab-active": name == selected,
              })}
              onClick={() => setSelected(name)}
            >
              {name}
            </a>
          ))}
        </div>
        <button
          className="btn btn-outline btn-sm join-item btn-primary"
          onClick={fit}
        >
          <ArrowsPointingInIcon className="w-5" />
          <span>{t("Fit")}</span>
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline btn-primary"
          disabled={!status.running}
          onClick={() => setRefreshTick((n) => n + 1)}
        >
          <ArrowPathIcon className="w-5" />
          {t("OspfRefresh")}
        </button>
      </div>
    </div>
  );
}
