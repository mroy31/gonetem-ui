import { describe, it, expect } from "vitest";
import { hasSavedPositions } from "./topologyLayout";

describe("hasSavedPositions", () => {
  it("returns false when nodes are missing or empty", () => {
    expect(hasSavedPositions(null)).toBe(false);
    expect(hasSavedPositions(undefined)).toBe(false);
    expect(hasSavedPositions({})).toBe(false);
  });

  it("returns false when no node has a saved position", () => {
    expect(
      hasSavedPositions({
        r1: { ui: {} },
        h1: null,
        h2: {},
      })
    ).toBe(false);
  });

  it("returns true when some nodes have a saved position", () => {
    expect(
      hasSavedPositions({
        r1: { ui: {} },
        h1: { ui: { position: { x: 10, y: 20 } } },
        h2: null,
      })
    ).toBe(true);
  });

  it("returns true when all nodes have a saved position", () => {
    expect(
      hasSavedPositions({
        r1: { ui: { position: { x: 0, y: 0 } } },
        h1: { ui: { position: { x: 10, y: 20 } } },
      })
    ).toBe(true);
  });
});
