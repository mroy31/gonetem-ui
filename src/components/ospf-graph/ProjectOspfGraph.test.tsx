import React from "react";
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import ProjectOspfGraph, { ospfLayoutBox } from "./ProjectOspfGraph";
import { OspfGraph, OspfVertex, OspfEdge } from "./ospfGraph";

describe("ospfLayoutBox", () => {
  const star = (leaves: number): OspfGraph => {
    const vertices: OspfVertex[] = [{ name: "root", kind: "router" }];
    const edges: OspfEdge[] = [];
    for (let i = 0; i < leaves; i++) {
      const name = `n${i}`;
      vertices.push({ name, kind: "stub" });
      edges.push({
        id: name,
        source: "root",
        target: name,
        cost: "1",
        interfaceAddress: "",
      });
    }
    return { rootId: "root", vertices, edges };
  };

  it("grows with the widest BFS level, not the viewport", () => {
    const small = ospfLayoutBox(star(2));
    const big = ospfLayoutBox(star(10));
    expect(big.w).toBeGreaterThan(small.w);
    expect(big.h).toBe(small.h); // same number of levels
  });

  it("returns a deterministic box independent of call order", () => {
    const first = ospfLayoutBox(star(5));
    const again = ospfLayoutBox(star(5));
    expect(first).toEqual(again);
    expect(first.x1).toBe(0);
    expect(first.y1).toBe(0);
    expect(first.w).toBeGreaterThan(0);
    expect(first.h).toBeGreaterThan(0);
  });

  it("measures the widest level, not the raw vertex count", () => {
    // A path graph (widest level = 1) is taller and narrower than a star
    // (widest level = 5): the box tracks the BFS shape, not vertex count.
    const vertices: OspfVertex[] = [
      { name: "root", kind: "router" },
      { name: "a", kind: "router" },
      { name: "b", kind: "router" },
      { name: "c", kind: "router" },
      { name: "d", kind: "router" },
    ];
    const edges: OspfEdge[] = [
      {
        id: "e1",
        source: "root",
        target: "a",
        cost: "1",
        interfaceAddress: "",
      },
      { id: "e2", source: "a", target: "b", cost: "1", interfaceAddress: "" },
      { id: "e3", source: "b", target: "c", cost: "1", interfaceAddress: "" },
      { id: "e4", source: "c", target: "d", cost: "1", interfaceAddress: "" },
    ];
    const path = ospfLayoutBox({ rootId: "root", vertices, edges });
    const wide = ospfLayoutBox(star(5));
    expect(wide.w).toBeGreaterThan(path.w); // widest level 5 > 1
    expect(path.h).toBeGreaterThan(wide.h); // 5 levels (450) > 2 levels (300 floor)
  });

  it("keeps unreachable vertices in an extra level instead of dropping them", () => {
    // 4-vertex path = 4 levels (clears the 300 floor), plus one unreachable
    // vertex that must occupy a 5th level rather than be ignored.
    const build = (withOrphan: boolean): OspfGraph => {
      const vertices: OspfVertex[] = [
        { name: "root", kind: "router" },
        { name: "a", kind: "router" },
        { name: "b", kind: "router" },
        { name: "c", kind: "router" },
      ];
      const edges: OspfEdge[] = [
        {
          id: "e1",
          source: "root",
          target: "a",
          cost: "1",
          interfaceAddress: "",
        },
        { id: "e2", source: "a", target: "b", cost: "1", interfaceAddress: "" },
        { id: "e3", source: "b", target: "c", cost: "1", interfaceAddress: "" },
      ];
      if (withOrphan) vertices.push({ name: "orphan", kind: "router" });
      return { rootId: "root", vertices, edges };
    };
    const before = ospfLayoutBox(build(false)); // 4 levels -> 360
    const after = ospfLayoutBox(build(true)); // 5 levels -> 450
    expect(after.h).toBeGreaterThan(before.h);
  });
});

interface MockElement {
  group: string;
  data: { id: string; [key: string]: unknown };
}

interface MockLayout {
  one: (events: string, cb: () => void) => void;
  run: () => void;
}

interface MockCollection {
  layout: () => MockLayout;
  remove: () => void;
}

interface MockCy {
  store: MockElement[];
  elements: () => MockCollection;
  add: (els: MockElement[]) => void;
  getElementById: () => MockCollection;
  fit: () => void;
  zoom: (value?: number) => number;
  resize: () => void;
  destroyed: () => boolean;
  destroy: () => void;
  on: () => void;
}

const h = vi.hoisted(() => ({ instances: [] as MockCy[] }));

vi.mock("cytoscape", () => ({
  default: (opts: { elements?: MockElement[] }) => {
    const store: MockElement[] = [];
    const coll: MockCollection = {
      layout: () => ({
        one: (_events: string, cb: () => void) => cb(),
        run: () => {},
      }),
      remove: () => {
        store.length = 0;
      },
    };
    const inst: MockCy = {
      store,
      elements: () => coll,
      add: (els: MockElement[]) => store.push(...els),
      getElementById: () => coll,
      fit: () => {},
      zoom: (value?: number) => value ?? 1,
      resize: () => {},
      destroyed: () => false,
      destroy: () => {},
      on: () => {},
    };
    store.push(...(opts.elements ?? []));
    h.instances.push(inst);
    return inst;
  },
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const TOPOLOGY = [
  "nodes:",
  "  r1:",
  "    type: docker.router",
  "  v1:",
  "    type: docker.vyos",
  "  h1:",
  "    type: docker.host",
  "",
].join("\n");

const status = {
  id: "p1",
  name: "lab",
  openAt: "2026-01-01",
  running: true,
  nodes: [],
};

const routerDb = (routerId: string, subnet: string) =>
  JSON.stringify({
    routerId,
    routerLinkStates: {
      areas: {
        "0.0.0.0": [
          {
            advertisingRouter: routerId,
            routerLinks: {
              l0: {
                linkType: "a Transit Network",
                designatedRouterAddress: subnet + ".13",
                routerInterfaceAddress: subnet + ".11",
                tos0Metric: 10,
              },
            },
          },
        ],
      },
    },
  });

const networkDb = (subnet: string) =>
  JSON.stringify({
    routerId: "1.1.1.1",
    networkLinkStates: {
      areas: {
        "0.0.0.0": [{ linkStateId: subnet + ".13", networkMask: 24 }],
      },
    },
  });

const OK_R1_ROUTER = routerDb("1.1.1.1", "10.0.0");
const OK_R1_NETWORK = networkDb("10.0.0");
const OK_V1_ROUTER = routerDb("2.2.2.2", "10.9.9");
const OK_V1_NETWORK = networkDb("10.9.9");

const runNodeExecOnce = vi.fn();

beforeEach(() => {
  h.instances.length = 0;
  runNodeExecOnce.mockReset();
  runNodeExecOnce.mockImplementation(
    async (_prj: string, node: string, cmd: string[]) => {
      const isRouter = cmd[2].includes("router");
      if (node == "r1")
        return {
          status: true,
          result: isRouter ? OK_R1_ROUTER : OK_R1_NETWORK,
        };
      if (node == "v1")
        return {
          status: true,
          result: isRouter ? OK_V1_ROUTER : OK_V1_NETWORK,
        };
      return { status: true, result: "{}" };
    },
  );
  Object.defineProperty(window, "api", {
    value: { runNodeExecOnce },
    configurable: true,
  });
});

afterEach(cleanup);

const renderedNodeIds = () =>
  (h.instances[0]?.store ?? [])
    .filter((el) => el.group == "nodes")
    .map((el) => el.data.id);

const renderView = (topology: string, running = true) =>
  render(
    <ProjectOspfGraph
      prjId="p1"
      status={{ ...status, running }}
      topology={topology}
    />,
  );

describe("ospf graph view", () => {
  it("renders tabs in topology order and fetches the first router by default", async () => {
    renderView(TOPOLOGY);

    expect(screen.getByRole("tab", { name: "r1" })).toBeTruthy();
    expect(screen.getByRole("tab", { name: "v1" })).toBeTruthy();
    expect(screen.queryByRole("tab", { name: "h1" })).toBeNull();

    await vi.waitFor(() => {
      expect(runNodeExecOnce).toHaveBeenCalledWith("p1", "r1", [
        "vtysh",
        "-c",
        "show ip ospf database router json",
      ]);
    });
    await vi.waitFor(() => {
      expect(renderedNodeIds()).toContain("10.0.0.0/24");
    });
    expect(screen.getByText("OspfKindRouter")).toBeTruthy();
    expect(screen.getByText("OspfKindTransitNetwork")).toBeTruthy();
    expect(screen.getByText("OspfKindStubNetwork")).toBeTruthy();
  });

  it("refetches when switching the router tab", async () => {
    renderView(TOPOLOGY);

    await vi.waitFor(() => {
      expect(renderedNodeIds()).toContain("10.0.0.0/24");
    });

    fireEvent.click(screen.getByRole("tab", { name: "v1" }));

    await vi.waitFor(() => {
      expect(runNodeExecOnce).toHaveBeenCalledWith("p1", "v1", [
        "vtysh",
        "-c",
        "show ip ospf database router json",
      ]);
    });
    await vi.waitFor(() => {
      expect(renderedNodeIds()).toContain("2.2.2.2");
      expect(renderedNodeIds()).not.toContain("10.0.0.0/24");
    });
  });

  it("discards a superseded fetch", async () => {
    type Resp = { status: boolean; result?: string; error?: string };
    const calls: {
      node: string;
      d: { promise: Promise<Resp>; resolve: (r: Resp) => void };
    }[] = [];
    runNodeExecOnce.mockImplementation((_prj: string, node: string) => {
      let resolve!: (r: Resp) => void;
      const promise = new Promise<Resp>((res) => {
        resolve = res;
      });
      calls.push({ node, d: { promise, resolve } });
      return promise;
    });

    renderView(TOPOLOGY);
    await vi.waitFor(() => expect(calls.length).toBe(2));

    fireEvent.click(screen.getByRole("tab", { name: "v1" }));
    await vi.waitFor(() => expect(calls.length).toBe(4));

    calls[2].d.resolve({ status: true, result: OK_V1_ROUTER });
    calls[3].d.resolve({ status: true, result: OK_V1_NETWORK });
    calls[0].d.resolve({ status: true, result: OK_R1_ROUTER });
    calls[1].d.resolve({ status: true, result: OK_R1_NETWORK });

    await vi.waitFor(() => {
      expect(renderedNodeIds()).toContain("2.2.2.2");
    });
    expect(renderedNodeIds()).not.toContain("1.1.1.1");
  });

  it("shows the no-data message and keeps tabs usable", async () => {
    runNodeExecOnce.mockImplementation(
      async (_prj: string, node: string, cmd: string[]) => {
        if (node == "r1") return { status: true, result: "{}" };
        const isRouter = cmd[2].includes("router");
        return {
          status: true,
          result: isRouter ? OK_V1_ROUTER : OK_V1_NETWORK,
        };
      },
    );

    renderView(TOPOLOGY);

    await vi.waitFor(() => {
      expect(screen.getByText("OspfNoDataMsg")).toBeTruthy();
    });

    fireEvent.click(screen.getByRole("tab", { name: "v1" }));

    await vi.waitFor(() => {
      expect(screen.queryByText("OspfNoDataMsg")).toBeNull();
      expect(renderedNodeIds()).toContain("2.2.2.2");
    });
  });

  it("shows the fetch error and keeps tabs usable", async () => {
    runNodeExecOnce.mockImplementation(
      async (_prj: string, node: string, cmd: string[]) => {
        if (node == "r1") return { status: false, error: "boom" };
        const isRouter = cmd[2].includes("router");
        return {
          status: true,
          result: isRouter ? OK_V1_ROUTER : OK_V1_NETWORK,
        };
      },
    );

    renderView(TOPOLOGY);

    await vi.waitFor(() => {
      expect(screen.getByText("OspfExecErrMsg")).toBeTruthy();
    });
    expect(screen.getByRole("tab", { name: "v1" })).toBeTruthy();

    fireEvent.click(screen.getByRole("tab", { name: "v1" }));

    await vi.waitFor(() => {
      expect(screen.queryByText("OspfExecErrMsg")).toBeNull();
      expect(renderedNodeIds()).toContain("2.2.2.2");
    });
  });

  it("renders an empty state when the topology has no eligible router", () => {
    renderView("nodes:\n  h1:\n    type: docker.host\n");

    expect(screen.getByText("OspfNoRouterMsg")).toBeTruthy();
    expect(screen.queryAllByRole("tab")).toHaveLength(0);
    expect(runNodeExecOnce).not.toHaveBeenCalled();
  });
});
