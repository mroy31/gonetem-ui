import { describe, it, expect } from "vitest";
import {
  buildOspfGraph,
  OspfGraph,
  OspfNoDataError,
  ospfStubSubnet,
  ospfSubnet,
} from "./ospfGraph";

import abrRouter from "./__fixtures__/ospf_abr_lsdb_router.json";
import abrNetwork from "./__fixtures__/ospf_abr_lsdb_network.json";
import r1Router from "./__fixtures__/ospf_r1_lsdb_router.json";
import r1Network from "./__fixtures__/ospf_r1_lsdb_network.json";

const build = (router: unknown, network: unknown): OspfGraph =>
  buildOspfGraph(JSON.stringify(router), JSON.stringify(network));

const vertexNames = (g: OspfGraph) => g.vertices.map((v) => v.name).sort();
const edgePairs = (g: OspfGraph) =>
  g.edges.map((e) => `${e.source}->${e.target}`).sort();

describe("ospf graph from vendored FRR fixtures", () => {
  it("builds the single-area transit view", () => {
    const g = build(r1Router, r1Network);

    expect(g.rootId).toBe("1.1.1.1");
    expect(vertexNames(g)).toEqual([
      "1.1.1.1",
      "10.0.12.0/24",
      "2.2.2.2",
      "3.3.3.3",
    ]);
    expect(g.vertices.find((v) => v.name === "10.0.12.0/24")?.kind).toBe(
      "transit",
    );
    expect(edgePairs(g)).toEqual([
      "1.1.1.1->10.0.12.0/24",
      "2.2.2.2->10.0.12.0/24",
      "3.3.3.3->10.0.12.0/24",
    ]);
    const edge = g.edges.find((e) => e.source === "1.1.1.1");
    expect(edge?.cost).toBe("10");
    expect(edge?.interfaceAddress).toBe("");
  });

  it("merges areas, dedups p2p views and merges stubs in the ABR view", () => {
    const g = build(abrRouter, abrNetwork);

    expect(g.rootId).toBe("2.2.2.2");
    expect(vertexNames(g)).toEqual([
      "1.1.1.1",
      "10.0.12.0/24",
      "10.0.24.0/24",
      "2.2.2.2",
      "3.3.3.3",
      "4.4.4.4",
    ]);
    // One shared 2.2.2.2 vertex across areas 0.0.0.0 and 0.0.0.1.
    expect(g.vertices.filter((v) => v.name === "2.2.2.2")).toHaveLength(1);
    // p2p listed by both ends: the smaller router-id 2.2.2.2's view wins.
    const p2p = g.edges.filter(
      (e) => e.source == "2.2.2.2" && e.target == "4.4.4.4",
    );
    expect(p2p).toHaveLength(1);
    expect(p2p[0].interfaceAddress).toBe("10.0.24.12");
    expect(p2p[0].cost).toBe("20");
    expect(
      g.edges.filter(
        (e) => e.source == "4.4.4.4" && e.target == "2.2.2.2",
      ),
    ).toHaveLength(0);
    // Same stub prefix advertised by both routers: one vertex, one edge each.
    expect(
      g.vertices.filter((v) => v.name === "10.0.24.0/24"),
    ).toHaveLength(1);
    expect(g.vertices.find((v) => v.name === "10.0.24.0/24")?.kind).toBe(
      "stub",
    );
    expect(
      g.edges.filter((e) => e.target === "10.0.24.0/24").map((e) => e.source),
    ).toEqual(["2.2.2.2", "4.4.4.4"]);
  });
});

const lsa = (
  advRouter: string,
  links: { [id: string]: Record<string, unknown> },
) => ({
  lsaType: "router-LSA",
  linkStateId: advRouter,
  advertisingRouter: advRouter,
  routerLinks: links,
});

const transitLink = (dr: string, iface: string, cost = 10) => ({
  linkType: "a Transit Network",
  designatedRouterAddress: dr,
  routerInterfaceAddress: iface,
  tos0Metric: cost,
});

const p2pLink = (neighbor: string, iface: string, cost = 5) => ({
  linkType: "another Router (point-to-point)",
  neighborRouterId: neighbor,
  routerInterfaceAddress: iface,
  tos0Metric: cost,
});

const stubLink = (netAddr: string, mask: string, cost = 10) => ({
  linkType: "Stub Network",
  networkAddress: netAddr,
  networkMask: mask,
  tos0Metric: cost,
});

const routerDb = (routerId: string, areas: Record<string, unknown[]>) => ({
  routerId,
  routerLinkStates: { areas },
});

const networkDb = (
  areas: Record<string, { linkStateId: string; networkMask: number }[]>,
) => ({
  routerId: "1.1.1.1",
  networkLinkStates: { areas },
});

describe("ospf graph construction rules", () => {
  it("labels a transit vertex with the masked subnet prefix", () => {
    const g = build(
      routerDb("1.1.1.1", {
        "0.0.0.0": [lsa("1.1.1.1", { l0: transitLink("10.0.0.2", "10.0.0.1") })],
      }),
      networkDb({ "0.0.0.0": [{ linkStateId: "10.0.0.2", networkMask: 24 }] }),
    );

    expect(g.vertices.map((v) => v.name)).toContain("10.0.0.0/24");
  });

  it("falls back to the bare DR address when the network LSA is missing", () => {
    const g = build(
      routerDb("1.1.1.1", {
        "0.0.0.0": [
          lsa("1.1.1.1", { l0: transitLink("172.16.5.1", "172.16.5.2") }),
        ],
      }),
      networkDb({ "0.0.0.0": [] }),
    );

    const transit = g.vertices.find((v) => v.kind === "transit");
    expect(transit?.name).toBe("172.16.5.1");
  });

  it("keeps one shared vertex for a router-id originating in several areas", () => {
    const g = build(
      routerDb("1.1.1.1", {
        "0.0.0.0": [lsa("1.1.1.1", {})],
        "0.0.0.1": [lsa("1.1.1.1", {})],
        "0.0.0.2": [lsa("1.1.1.1", {})],
      }),
      networkDb({}),
    );

    expect(g.vertices.filter((v) => v.name === "1.1.1.1")).toHaveLength(1);
    expect(g.vertices).toHaveLength(1);
  });

  it("renders a one-sided point-to-point adjacency", () => {
    const g = build(
      routerDb("3.3.3.3", {
        "0.0.0.0": [
          lsa("3.3.3.3", { l0: p2pLink("9.9.9.9", "10.0.9.3") }),
        ],
      }),
      networkDb({}),
    );

    const edge = g.edges.find((e) => e.target === "9.9.9.9");
    expect(edge?.source).toBe("3.3.3.3");
    expect(edge?.interfaceAddress).toBe("10.0.9.3");
    expect(g.vertices.find((v) => v.name === "9.9.9.9")?.kind).toBe("router");
  });

  it("dedups a point-to-point listed by both ends keeping the smaller id", () => {
    const g = build(
      routerDb("2.2.2.2", {
        "0.0.0.0": [
          lsa("2.2.2.2", { l0: p2pLink("1.1.1.1", "10.0.1.2") }),
          lsa("1.1.1.1", { l0: p2pLink("2.2.2.2", "10.0.1.1") }),
        ],
      }),
      networkDb({}),
    );

    expect(g.edges.filter((e) => e.id.startsWith("p:"))).toHaveLength(1);
    const edge = g.edges.find((e) => e.id.startsWith("p:"));
    expect(edge?.source).toBe("1.1.1.1");
    expect(edge?.interfaceAddress).toBe("10.0.1.1");
  });

  it("keeps transit typing when a transit subnet is also advertised as a stub", () => {
    const g = build(
      routerDb("1.1.1.1", {
        "0.0.0.0": [
          lsa("1.1.1.1", { l0: transitLink("10.0.0.2", "10.0.0.1") }),
          lsa("2.2.2.2", {
            l0: stubLink("10.0.0.0", "255.255.255.0"),
          }),
        ],
      }),
      networkDb({ "0.0.0.0": [{ linkStateId: "10.0.0.2", networkMask: 24 }] }),
    );

    const shared = g.vertices.filter((v) => v.name === "10.0.0.0/24");
    expect(shared).toHaveLength(1);
    expect(shared[0].kind).toBe("transit");
    expect(
      g.edges.filter((e) => e.target === "10.0.0.0/24").map((e) => e.source),
    ).toEqual(["1.1.1.1", "2.2.2.2"]);
  });

  it("hides /32 stub links", () => {
    const g = build(
      routerDb("1.1.1.1", {
        "0.0.0.0": [
          lsa("1.1.1.1", {
            l0: stubLink("1.1.1.1", "255.255.255.255", 0),
            l1: stubLink("192.168.1.0", "255.255.255.0"),
          }),
        ],
      }),
      networkDb({}),
    );

    expect(g.vertices.map((v) => v.name)).not.toContain("1.1.1.1/32");
    expect(g.vertices.map((v) => v.name)).toContain("192.168.1.0/24");
  });

  it("merges duplicate stub advertisements into one vertex with one edge each", () => {
    const g = build(
      routerDb("1.1.1.1", {
        "0.0.0.0": [
          lsa("1.1.1.1", { l0: stubLink("192.168.7.0", "255.255.255.0") }),
        ],
        "0.0.0.1": [
          lsa("2.2.2.2", { l0: stubLink("192.168.7.0", "255.255.255.0") }),
        ],
      }),
      networkDb({}),
    );

    expect(g.vertices.filter((v) => v.name === "192.168.7.0/24")).toHaveLength(
      1,
    );
    expect(
      g.edges.filter((e) => e.target === "192.168.7.0/24"),
    ).toHaveLength(2);
  });

  it("creates router vertices even when all their links are unusable", () => {
    const g = build(
      routerDb("1.1.1.1", {
        "0.0.0.0": [
          lsa("5.5.5.5", { l0: { linkType: "a Transit Network" } }),
        ],
      }),
      networkDb({}),
    );

    expect(g.vertices.find((v) => v.name === "5.5.5.5")?.kind).toBe("router");
    expect(g.edges).toHaveLength(0);
  });

  it("reports no usable OSPF data without a router-id", () => {
    expect(() => build({}, {})).toThrow(OspfNoDataError);
    expect(() => build({ routerId: "" }, {})).toThrow(OspfNoDataError);
  });

  it("surfaces unparsable JSON as a parse error", () => {
    expect(() =>
      buildOspfGraph("not json", "{}"),
    ).toThrowError(/unable to parse OSPF router database/);
    expect(() =>
      buildOspfGraph('{"routerId":"1.1.1.1"}', "not json"),
    ).toThrowError(/unable to parse OSPF network database/);
  });
});

describe("subnet label helpers", () => {
  it("masks transit prefixes and degrades on unparsable input", () => {
    expect(ospfSubnet("10.0.12.13", 24)).toBe("10.0.12.0/24");
    expect(ospfSubnet("10.0.12.13", 0)).toBe("0.0.0.0/0");
    expect(ospfSubnet("10.0.12.13", 33)).toBe("10.0.12.13");
    expect(ospfSubnet("10.0.12.13", NaN)).toBe("10.0.12.13");
    expect(ospfSubnet("not-an-address", 24)).toBe("not-an-address");
  });

  it("masks stub subnets and keeps unparsable stubs visible", () => {
    expect(ospfStubSubnet("192.168.9.1", "255.255.255.0")).toEqual([
      "192.168.9.0/24",
      24,
    ]);
    expect(ospfStubSubnet("192.168.9.1", "255.0.255.0")).toEqual([
      "192.168.9.1",
      -1,
    ]);
    expect(ospfStubSubnet("192.168.9.1", "0.0.0.0")).toEqual([
      "192.168.9.1",
      -1,
    ]);
    expect(ospfStubSubnet("192.168.9.1", "")).toEqual(["192.168.9.1", -1]);
    expect(ospfStubSubnet("9.9.9.9", "255.255.255.255")).toEqual([
      "9.9.9.9/32",
      32,
    ]);
  });
});
