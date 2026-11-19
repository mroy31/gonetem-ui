// TypeScript port of the gonetem console's buildOspfGraph: turns the two FRR
// `show ip ospf database router|network json` documents into an OSPF area
// graph. Rules are kept faithful to the Go original.

export interface OspfRouterLink {
  linkType?: string;
  designatedRouterAddress?: string;
  routerInterfaceAddress?: string;
  neighborRouterId?: string;
  tos0Metric?: number;
  networkAddress?: string;
  networkMask?: string;
}

export interface OspfRouterLsa {
  linkStateId?: string;
  advertisingRouter?: string;
  routerLinks?: { [id: string]: OspfRouterLink | null } | null;
}

export interface OspfRouterDb {
  routerId?: string;
  routerLinkStates?: {
    areas?: { [area: string]: OspfRouterLsa[] | null } | null;
  } | null;
}

export interface OspfNetworkLsa {
  linkStateId?: string;
  advertisingRouter?: string;
  networkMask?: number;
}

export interface OspfNetworkDb {
  routerId?: string;
  networkLinkStates?: {
    areas?: { [area: string]: OspfNetworkLsa[] | null } | null;
  } | null;
}

export type OspfVertexKind = "router" | "transit" | "stub";

export interface OspfVertex {
  name: string;
  kind: OspfVertexKind;
}

export interface OspfEdge {
  id: string;
  source: string;
  target: string;
  cost: string;
  interfaceAddress: string;
}

export interface OspfGraph {
  rootId: string;
  vertices: OspfVertex[];
  edges: OspfEdge[];
}

// Reports that the queried node answered without any OSPF information
// (e.g. ospfd running with no OSPF instance configured).
export class OspfNoDataError extends Error {
  constructor() {
    super("node exposes no usable OSPF data");
    this.name = "OspfNoDataError";
  }
}

const parseV4 = (addr: string): number[] | null => {
  const parts = addr.trim().split(".");
  if (parts.length != 4) return null;
  const bytes: number[] = [];
  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part)) return null;
    const value = Number(part);
    if (value > 255) return null;
    bytes.push(value);
  }
  return bytes;
};

const parseV6 = (addr: string): number[] | null => {
  const s = addr.trim();
  const dc = s.indexOf("::");
  if (dc != -1 && s.indexOf("::", dc + 1) != -1) return null;

  const headStr = dc == -1 ? s : s.slice(0, dc);
  const tailStr = dc == -1 ? "" : s.slice(dc + 2);
  const head = headStr == "" ? [] : headStr.split(":");
  const tail = tailStr == "" ? [] : tailStr.split(":");

  const parsed = (list: string[]): number[] | null => {
    const out: number[] = [];
    for (const g of list) {
      if (!/^[0-9a-fA-F]{1,4}$/.test(g)) return null;
      out.push(parseInt(g, 16));
    }
    return out;
  };
  const headGroups = parsed(head);
  const tailGroups = parsed(tail);
  if (headGroups == null || tailGroups == null) return null;

  const bytes: number[] = [];
  const push = (group: number) => {
    bytes.push((group >> 8) & 0xff, group & 0xff);
  };
  if (dc == -1) {
    if (headGroups.length != 8) return null;
    headGroups.forEach(push);
  } else {
    const fill = 8 - headGroups.length - tailGroups.length;
    if (fill < 1) return null;
    headGroups.forEach(push);
    for (let i = 0; i < fill; i++) push(0);
    tailGroups.forEach(push);
  }
  return bytes;
};

interface IpBytes {
  bytes: number[];
  v6: boolean;
}

const parseIp = (addr: string): IpBytes | null => {
  if (addr.includes(":")) {
    const bytes = parseV6(addr);
    return bytes == null ? null : { bytes, v6: true };
  }
  const bytes = parseV4(addr);
  return bytes == null ? null : { bytes, v6: false };
};

const maskBytes = (bytes: number[], ones: number): number[] =>
  bytes.map((b, i) => {
    const inOctet = Math.max(0, Math.min(8, ones - i * 8));
    return b & (0xff << (8 - inOctet)) & 0xff;
  });

const renderV4 = (bytes: number[]): string => bytes.join(".");

const renderV6 = (bytes: number[]): string => {
  const groups: string[] = [];
  for (let i = 0; i < bytes.length; i += 2)
    groups.push((((bytes[i] ?? 0) << 8) | (bytes[i + 1] ?? 0)).toString(16));

  let bestStart = -1;
  let bestLen = 0;
  let cur = -1;
  for (let i = 0; i <= groups.length; i++) {
    if (i < groups.length && groups[i] === "0") {
      if (cur < 0) cur = i;
    } else if (cur >= 0) {
      if (i - cur > bestLen) {
        bestStart = cur;
        bestLen = i - cur;
      }
      cur = -1;
    }
  }
  if (bestLen >= 2) {
    return (
      groups.slice(0, bestStart).join(":") +
      "::" +
      groups.slice(bestStart + bestLen).join(":")
    );
  }
  return groups.join(":");
};

const renderIp = (bytes: number[], v6: boolean): string =>
  v6 ? renderV6(bytes) : renderV4(bytes);

// Renders the subnet prefix of a transit network: the network LSA carries
// the DR interface address and the prefix length; the subnet is that address
// masked. Unparsable input labels with the bare address.
export const ospfSubnet = (addr: string, maskLen: number): string => {
  const ip = parseIp(addr);
  const maxBits = ip?.v6 ? 128 : 32;
  if (
    ip == null ||
    !Number.isInteger(maskLen) ||
    maskLen < 0 ||
    maskLen > maxBits
  )
    return addr;
  return renderIp(maskBytes(ip.bytes, maskLen), ip.v6) + "/" + maskLen;
};

const maskOnes = (mask: number[]): number => {
  let ones = 0;
  let seenZero = false;
  for (const b of mask)
    for (let i = 7; i >= 0; i--) {
      if ((b >> i) & 1) {
        if (seenZero) return 0;
        ones++;
      } else seenZero = true;
    }
  return ones;
};

// Renders the subnet prefix of a stub-network link: the router LSA carries
// the network address and a dotted string mask. Unparsable input - address,
// mask, or a mask with no valid CIDR size such as the non-contiguous or
// zero masks - labels with the bare address and an unusable prefix length,
// so the stub stays visible instead of being silently hidden.
export const ospfStubSubnet = (
  addr: string,
  mask: string,
): [string, number] => {
  const ip = parseV4(addr);
  const maskBytesV4 = parseV4(mask);
  if (ip == null || maskBytesV4 == null) return [addr, -1];
  const ones = maskOnes(maskBytesV4);
  if (ones == 0) return [addr, -1];
  return [renderV4(ip.map((b, i) => b & maskBytesV4[i])) + "/" + ones, ones];
};

const sortedKeys = <T>(obj: { [key: string]: T }): string[] =>
  Object.keys(obj).sort();

export function buildOspfGraph(
  routerDbJson: string,
  networkDbJson: string,
): OspfGraph {
  let routerDb: OspfRouterDb;
  let networkDb: OspfNetworkDb;
  try {
    routerDb = JSON.parse(routerDbJson) as OspfRouterDb;
  } catch (err) {
    throw new Error(
      `unable to parse OSPF router database: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
  if (!routerDb.routerId) throw new OspfNoDataError();

  try {
    networkDb = JSON.parse(networkDbJson) as OspfNetworkDb;
  } catch (err) {
    throw new Error(
      `unable to parse OSPF network database: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  const routerAreas = routerDb.routerLinkStates?.areas ?? {};
  const networkAreas = networkDb.networkLinkStates?.areas ?? {};

  const vertices: OspfVertex[] = [];
  const byName = new Map<string, OspfVertex>();
  const vertex = (name: string, kind: OspfVertexKind): OspfVertex => {
    const existing = byName.get(name);
    if (existing) return existing;
    const created = { name, kind };
    byName.set(name, created);
    vertices.push(created);
    return created;
  };

  // Router vertices first, so every originating router exists even when
  // all of its links are unusable.
  const originated = new Set<string>();
  for (const area of sortedKeys(routerAreas)) {
    for (const lsa of routerAreas[area] ?? []) {
      if (lsa?.advertisingRouter) {
        vertex(lsa.advertisingRouter, "router");
        originated.add(lsa.advertisingRouter);
      }
    }
  }

  // Subnet label per transit network, keyed by the DR interface address
  // (the link-state id of its network LSA). A missing network LSA - a
  // one-sided adjacency - degrades to labeling with the DR address.
  const transitName = new Map<string, string>();
  for (const area of sortedKeys(networkAreas)) {
    for (const lsa of networkAreas[area] ?? []) {
      if (!lsa?.linkStateId) continue;
      transitName.set(
        lsa.linkStateId,
        ospfSubnet(lsa.linkStateId, lsa.networkMask ?? 0),
      );
    }
  }

  const edges: OspfEdge[] = [];
  const transitSeen = new Set<string>();
  const p2pSeen = new Set<string>();

  for (const area of sortedKeys(routerAreas)) {
    for (const lsa of routerAreas[area] ?? []) {
      if (!lsa?.advertisingRouter) continue;
      const owner = byName.get(lsa.advertisingRouter);
      if (owner == null) continue;

      const links = lsa.routerLinks ?? {};
      for (const li of sortedKeys(links)) {
        const link = links[li];
        if (link == null) continue;
        const linkType = link.linkType ?? "";
        const cost = String(link.tos0Metric ?? 0);

        if (linkType.startsWith("a Transit")) {
          const dr = link.designatedRouterAddress ?? "";
          if (dr == "") continue;
          const name = transitName.get(dr) ?? dr;
          const net = vertex(name, "transit");
          const key = `${owner.name}\u0000${net.name}`;
          if (transitSeen.has(key)) continue;
          transitSeen.add(key);
          edges.push({
            id: `t:${owner.name} -- ${net.name}`,
            source: owner.name,
            target: net.name,
            cost,
            interfaceAddress: "",
          });
        } else if (linkType.startsWith("another Router")) {
          const neighborId = link.neighborRouterId ?? "";
          if (neighborId == "") continue;
          vertex(neighborId, "router");
          // Both ends of a p2p adjacency list it, each with its own
          // interface address. Keep one edge per direction pair: the
          // smaller router-id's view wins, unless the other end originates
          // no router LSA (one-sided view), in which case this LSA is all
          // the graph can show.
          if (neighborId < owner.name && originated.has(neighborId)) continue;
          const iface = link.routerInterfaceAddress ?? "";
          const key = `${owner.name}\u0000${iface}`;
          if (p2pSeen.has(key)) continue;
          p2pSeen.add(key);
          edges.push({
            id: `p:${owner.name} -- ${iface}`,
            source: owner.name,
            target: neighborId,
            cost,
            interfaceAddress: iface,
          });
        }
        // Stub Network links are leaves handled in a second pass.
      }
    }
  }

  // Stub-network links in a dedicated second pass: every transit vertex is
  // interned by now, so a subnet that is transit somewhere keeps its
  // transit typing when another router advertises it as a stub. A /32 stub
  // is a loopback duplicating the router-id vertex label and stays hidden;
  // there is no way to show it. Several routers (or areas) advertising the
  // same prefix merge into one vertex, one edge each.
  const stubSeen = new Set<string>();
  for (const area of sortedKeys(routerAreas)) {
    for (const lsa of routerAreas[area] ?? []) {
      const owner = lsa?.advertisingRouter
        ? byName.get(lsa.advertisingRouter)
        : undefined;
      if (owner == null) continue;

      const links = lsa.routerLinks ?? {};
      for (const li of sortedKeys(links)) {
        const link = links[li];
        if (
          link == null ||
          !(link.linkType ?? "").startsWith("Stub Network") ||
          !link.networkAddress
        )
          continue;
        const [name, ones] = ospfStubSubnet(
          link.networkAddress,
          link.networkMask ?? "",
        );
        if (ones == 32) continue;
        const net = vertex(name, "stub");
        const key = `${owner.name}\u0000${net.name}`;
        if (stubSeen.has(key)) continue;
        stubSeen.add(key);
        edges.push({
          id: `s:${owner.name} -- ${net.name}`,
          source: owner.name,
          target: net.name,
          cost: String(link.tos0Metric ?? 0),
          interfaceAddress: "",
        });
      }
    }
  }

  vertex(routerDb.routerId, "router");
  return { rootId: routerDb.routerId, vertices, edges };
}
