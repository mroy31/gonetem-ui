import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import YAML from "yaml";
import cytoscape from "cytoscape";
import cytoscapeFcose from "cytoscape-fcose";
import { GraphLayoutKind, hasSavedPositions } from "./topologyLayout";

import { Buffer } from 'buffer';
import { INodeState, IProjectState, IfState } from "../api/interface";
import NodeContextMenu, { NodeContextMenuT } from "./NodeContextMenu";
import LabelContextMenu, { HIDDEN_LABEL_MENU, LabelContextMenuT } from "./LabelContextMenu";
import LabelTextModal from "./LabelTextModal";
import { applyLabelConfirm, mergeLabelsIntoTopology, parseTopologyLabels, serializeLabels } from "./topologyLabels";
import { features } from "../edition";
import router from "../../img/router.svg";
import routerRunning from "../../img/router-running.svg";
import host from "../../img/host.svg";
import hostRunning from "../../img/host-running.svg";
import sw from "../../img/switch.svg";
import swRunning from "../../img/switch-running.svg";

cytoscape.use(cytoscapeFcose);

interface ITopologyNode {
  type: string;
  ui?: {
    icon?: "host" | "router" | "switch";
    position: cytoscape.Position;
  }
}

interface ITopology {
  nodes: {
    [key: string]: ITopologyNode | null;
  };
  links: {
    peer1: string;
    peer2: string;
  }[] | null;
  ui?: unknown;
}

const NODE_SIZE = 50;
const ALL_CLASSES = "icon-router icon-host icon-switch up down inactive label";

const LAYOUT_OPTIONS: { [kind in GraphLayoutKind]: cytoscape.LayoutOptions } = {
  force: { name: "fcose" },
  grid: { name: "grid" },
  concentric: { name: "concentric" },
  hierarchical: { name: "breadthfirst" },
};

export const cyStyle: cytoscape.StylesheetJson = [
  {
    selector: "node",
    style: {
      shape: "rectangle",
      width: NODE_SIZE,
      height: NODE_SIZE,
      "background-image": "data(image)",
      "background-fit": "contain",
      label: "data(name)",
      "text-halign": "center",
      "text-valign": "bottom",
      "text-margin-y": 2,
      "font-size": 12,
    },
  },
  {
    selector: "node.icon-router",
    style: {
      "background-shape": "circle",
      "background-fit": "cover",
    } as cytoscape.Css.Node,
  },
  {
    // .label nodes are free-floating annotations from the topology's top-level
    // ui section: excluded from layouts and node-position saves.
    selector: "node.label",
    style: {
      "shape": "round-rectangle",
      "width": "label",
      "height": "label",
      "padding": "3px",
      "background-color": "#fffbe6",
      "background-image": "none",
      "border-width": 1,
      "border-color": "#d6c98a",
      "label": "data(text)",
      "text-halign": "center",
      "text-valign": "center",
      "font-size": 10,
      "text-wrap": "wrap",
      "text-margin-y": 0,
      "text-max-width": "180",
      color: "#333333",
    } as cytoscape.Css.Node,
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
  {
    selector: "edge:selected",
    style: {
      width: 3,
      "overlay-color": "#0000FF",
      "overlay-opacity": 0.25,
      "overlay-padding": 5,
    },
  },
  { selector: "edge.up", style: { "line-color": "#91bf8f" } },
  { selector: "edge.down", style: { "line-color": "#FF0000" } },
  { selector: "edge.inactive", style: { "line-color": "#696969" } },
];

const getNodeIdFromPeer = (peer: string) => {
  return peer.split(".")[0];
};

const getNodeIdxFromPeer = (peer: string) => {
  return peer.split(".")[1];
};

const getNodeState = (
  nodeName: string,
  state: IProjectState
): INodeState | null => {
  for (const node of state.nodes) {
    if (node.name == nodeName) return node;
  }

  return null;
};

const getNodeIcon = (
  node: ITopologyNode | null
): "router" | "host" | "switch" | null => {
  if (node?.ui?.icon) {
    switch (node.ui.icon) {
      case "router":
      case "host":
      case "switch":
        return node.ui.icon;
      default:
        return null;
    }
  }

  switch (node?.type) {
    case "docker.router":
    case "docker.vyos":
      return "router";
    case "docker.host":
    case "docker.server":
      return "host";
    case "ovs":
      return "switch";
    default:
      return null;
  }
};

const getNodeImage = (
  node: ITopologyNode | null,
  nodeState: INodeState | null
): string | undefined => {
  const running = nodeState?.running;
  switch (getNodeIcon(node)) {
    case "router":
      return (running ? routerRunning : router) as string;
    case "host":
      return (running ? hostRunning : host) as string;
    case "switch":
      return (running ? swRunning : sw) as string;
    default:
      return undefined;
  }
};

const getEdgeClass = (
  peer1: string,
  peer2: string,
  prjState: IProjectState,
) => {
  const isPeerIfUp = (peer: string): boolean => {
    const peerId = peer.split(".");
    const peerState = getNodeState(peerId[0], prjState);
    if (!peerState?.running) return false;

    for (const ifState of peerState.interfaces) {
      if (ifState.name == peerId[1] || ifState.name == `eth${peerId[1]}`)
        return ifState.state == IfState.UP;
    } 

    return false;
  }

  if (prjState.running) {
    if (isPeerIfUp(peer1) && isPeerIfUp(peer2))
      return "up";

    return "down";
  }

  return "inactive";
}

export const getElements = (
  topology: ITopology,
  prjState: IProjectState,
): cytoscape.ElementDefinition[] => {
  const elements: cytoscape.ElementDefinition[] = [];

  if (topology.nodes) {
    Object.keys(topology.nodes).forEach((name) => {
      const nodeAttr = topology.nodes[name];
      const icon = getNodeIcon(nodeAttr);
      elements.push({
        group: "nodes",
        data: {
          id: name,
          name,
          image: getNodeImage(nodeAttr, getNodeState(name, prjState)),
        },
        position: nodeAttr?.ui?.position,
        classes: icon ? `icon-${icon}` : "",
      });
    });
  }

  if (topology.links) {
    topology.links.forEach((link) => {
      elements.push({
        group: "edges",
        data: {
          id: `${link.peer1} -- ${link.peer2}`,
          source: getNodeIdFromPeer(link.peer1),
          target: getNodeIdFromPeer(link.peer2),
          fromLabel: getNodeIdxFromPeer(link.peer1),
          toLabel: getNodeIdxFromPeer(link.peer2),
        },
        classes: getEdgeClass(link.peer1, link.peer2, prjState),
      });
    });
  }

  const labels = parseTopologyLabels(topology);
  Object.keys(labels).forEach((id) => {
    elements.push({
      group: "nodes",
      data: { id, text: labels[id].text },
      position: { ...labels[id].position },
      classes: "label",
    });
  });

  return elements;
};

const updateElements = (cy: cytoscape.Core, elements: cytoscape.ElementDefinition[]) => {
  const ids = new Set(elements.map((el) => el.data?.id as string));

  cy.batch(() => {
    elements.forEach((def) => {
      const existing = cy.getElementById(def.data?.id as string);
      if (existing.nonempty()) {
        existing.data(def.data);
        existing.removeClass(ALL_CLASSES);
        if (def.classes) existing.addClass(def.classes);
      } else {
        cy.add(def);
      }
    });

    cy.elements().forEach((el) => {
      if (!ids.has(el.id())) el.remove();
    });
  });
};


type PropsT = {
  prjStatus: IProjectState;
  topology: string;
  updateState: () => void;
  onSelectEdge: (edge: string) => void;
}

export type ProjectGrahHandle = {
  exportImage: () => Promise<Buffer | null>;
  fit: () => void;
  applyLayout: (kind: GraphLayoutKind) => void;
  saveNodePositions: () => Promise<ApiResponse>;
}

export default forwardRef<ProjectGrahHandle, PropsT>(function ProjectGraph({
  prjStatus,
  topology,
  updateState,
  onSelectEdge,
}: PropsT, ref): React.JSX.Element {
  const {t} = useTranslation();
  const [error, setError] = useState("");
  const [contextMenu, setContextMenu] = useState<NodeContextMenuT>({
    prjId: prjStatus.id,
    nodeId: "",
    x: 0,
    y: 0,
  });
  const [labelMenu, setLabelMenu] = useState<LabelContextMenuT>(HIDDEN_LABEL_MENU);
  const [labelModal, setLabelModal] = useState<{
    open: boolean;
    mode: "add" | "edit";
    id: string;
    text: string;
    position: cytoscape.Position;
  }>({ open: false, mode: "add", id: "", text: "", position: { x: 0, y: 0 } });
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const pendingLabelPositionRef = useRef<cytoscape.Position>({ x: 0, y: 0 });

  useImperativeHandle(ref, () => {
    return {
      exportImage: (): Promise<Buffer | null> => {
        return new Promise<Buffer | null>((resolve) => {
          const cy = cyRef.current;
          if (cy == null || cy.destroyed()) {
            resolve(null);
            return;
          }

          const blob = cy.png({ output: "blob" });
          if (blob instanceof Blob) {
            blob.arrayBuffer().then((aBuf) => resolve(Buffer.from(aBuf)));
            return;
          }
          resolve(null);
        });
      },
      fit: () => {
        const cy = cyRef.current;
        if (cy != null && !cy.destroyed()) {
          cy.fit();
        }
      },
      applyLayout: (kind: GraphLayoutKind) => {
        const cy = cyRef.current;
        if (cy == null || cy.destroyed()) return;

        const layout = cy.elements().not(".label").layout(LAYOUT_OPTIONS[kind]);
        layout.one("stop", () => cy.fit());
        layout.run();
      },
      saveNodePositions: (): Promise<ApiResponse> => {
        const cy = cyRef.current;
        if (cy == null || cy.destroyed())
          return Promise.resolve({
            status: false,
            error: "Topology graph is not ready",
          });

        const positions: { [id: string]: cytoscape.Position } = {};
        cy.nodes().not(".label").forEach((n) => {
          positions[n.id()] = n.position();
        });

        const labelEntries: { id: string; text: string; position: cytoscape.Position }[] = [];
        cy.nodes(".label").forEach((n) => {
          labelEntries.push({ id: n.id(), text: String(n.data("text") ?? ""), position: n.position() });
        });

        const topo = YAML.parse(topology) as ITopology;

        const nodes: {[key: string]: ITopologyNode | null;}  = {}
        Object.keys(topo.nodes).forEach((nId) => {
          const nodeAttr = topo.nodes[nId];
          nodes[nId] = nodeAttr == null
            ? null
            : {
                ...nodeAttr,
                ui: {
                  ...nodeAttr.ui,
                  position: positions[nId]
                }
              };
        });
        topo.nodes = nodes;

        mergeLabelsIntoTopology(topo, serializeLabels(labelEntries));

        return window.api.writeTopologyFile(prjStatus.id, YAML.stringify(topo))
      }
    }
  });

  useEffect(() => {
    if (!containerRef.current) return;
    if (!prjStatus.id) return;

    try {
      const topo = YAML.parse(topology) as ITopology;
      const cy = cyRef.current;

      if (cy == null || cy.destroyed()) {
        const net = cytoscape({
          container: containerRef.current,
          style: cyStyle,
          elements: getElements(topo, prjStatus),
          layout: { name: "preset" },
          wheelSensitivity: 0.2,
        });

        if (!hasSavedPositions(topo.nodes)) {
          const autoLayout = net.nodes().not(".label").layout(LAYOUT_OPTIONS.force);
          autoLayout.one("stop layoutstop", () => net.fit());
          autoLayout.run();
        }

        net.on(
          "cxttap",
          "node",
          (evt: cytoscape.EventObject) => {
            const nodeId = evt.target.id();
            if (nodeId && !evt.target.hasClass("label")) {
              const rect = net.container()?.getBoundingClientRect();
              setContextMenu({
                prjId: prjStatus.id,
                nodeId,
                x: (rect?.left ?? 0) + evt.renderedPosition.x,
                y: (rect?.top ?? 0) + evt.renderedPosition.y,
              });
            }
          }
        );
        if (features.topologyWrite) {
          net.on("cxttap", (evt: cytoscape.EventObject) => {
            // renderedPosition is relative to the graph container; the menu is
            // position:fixed, so offset by the container's viewport rect.
            const rect = net.container()?.getBoundingClientRect();
            const menuX = (rect?.left ?? 0) + evt.renderedPosition.x;
            const menuY = (rect?.top ?? 0) + evt.renderedPosition.y;

            if (evt.target === net) {
              setLabelMenu({
                mode: "canvas",
                labelId: "",
                x: menuX,
                y: menuY,
              });
              pendingLabelPositionRef.current = { ...evt.position };
            } else if (evt.target !== net && evt.target.hasClass("label")) {
              setLabelMenu({
                mode: "label",
                labelId: evt.target.id(),
                x: menuX,
                y: menuY,
              });
            } else {
              setLabelMenu(HIDDEN_LABEL_MENU);
            }
          });
          net.on("dbltap", "node.label", (evt: cytoscape.EventObject) => {
            setLabelModal({
              open: true,
              mode: "edit",
              id: evt.target.id(),
              text: String(evt.target.data("text") ?? ""),
              position: { ...evt.target.position() },
            });
          });
        }
        net.on("tap", () => {
          setContextMenu({ ...contextMenu, nodeId: "", x: 0, y: 0 });
          setLabelMenu(HIDDEN_LABEL_MENU);
        });
        net.on("select", "edge", (evt: cytoscape.EventObject) => {
          onSelectEdge(evt.target.id())
        });
        net.on("unselect", "edge", (evt: cytoscape.EventObject) => {
          onSelectEdge(evt.target.id())
        });

        cyRef.current = net;
      } else {
        updateElements(cy, getElements(topo, prjStatus));
      }
    } catch (err) {
      setError(t("ProjectGraphErrMsg", {error: err}));
      return;
    }
  }, [prjStatus, topology]);

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
    if (!container) return;

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

  const getNodeState = (nodeId: string): INodeState | null => {
    for (const nState of prjStatus.nodes) {
      if (nState.name == nodeId) return nState;
    }
    return null;
  };

  const handleAddLabel = () => {
    setLabelModal({
      open: true,
      mode: "add",
      id: "",
      text: "",
      position: { ...pendingLabelPositionRef.current },
    });
    setLabelMenu(HIDDEN_LABEL_MENU);
  };

  const handleDeleteLabel = () => {
    const cy = cyRef.current;
    if (cy != null && !cy.destroyed())
      cy.getElementById(labelMenu.labelId).remove();
    setLabelMenu(HIDDEN_LABEL_MENU);
  };

  const handleHideLabelModal = () =>
    setLabelModal({ ...labelModal, open: false });

  const handleLabelModalConfirm = (rawText: string) => {
    const cy = cyRef.current;
    if (cy != null && !cy.destroyed())
      applyLabelConfirm(cy, labelModal.mode, rawText, labelModal.id, labelModal.position);

    handleHideLabelModal();
  };

  const handleHideContextMenu = (update: boolean) => {
    if (update) updateState();
    setContextMenu({ ...contextMenu, nodeId: "", x: 0, y: 0 });
  };

  if (error)
    return (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    );

  return (
    <>
      <div
        ref={containerRef}
        data-theme="light"
        className="w-full h-full min-h-0"
      />
      {prjStatus.running && contextMenu.nodeId != "" && (
        <NodeContextMenu
          contextMenu={contextMenu}
          state={getNodeState(contextMenu.nodeId)}
          onHide={handleHideContextMenu}
        />
      )}
      {features.topologyWrite && (
        <>
          <LabelContextMenu
            menu={labelMenu}
            onAdd={handleAddLabel}
            onDelete={handleDeleteLabel}
          />
          <LabelTextModal
            isOpen={labelModal.open}
            initialText={labelModal.text}
            onClose={handleHideLabelModal}
            onConfirm={handleLabelModalConfirm}
          />
        </>
      )}
    </>
  );
});
