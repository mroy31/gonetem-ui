export type GraphLayoutKind = "force" | "grid" | "concentric" | "hierarchical";

interface PositionedTopologyNode {
  ui?: {
    position?: { x: number; y: number };
  } | null;
}

export function hasSavedPositions(
  nodes: { [key: string]: PositionedTopologyNode | null } | null | undefined
): boolean {
  if (!nodes) return false;
  return Object.values(nodes).some((node) => node?.ui?.position != null);
}
