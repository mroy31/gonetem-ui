import { describe, it, expect } from "vitest";
import { edition, studentServerUri, features } from "./edition";

describe("edition (node project define)", () => {
  it("reads the full-edition defaults injected via define", () => {
    expect(edition).toBe("full");
    expect(studentServerUri).toBe("");
    expect(features).toEqual({
      topologyWrite: true,
      topologyValidation: true,
      nodeConfigRead: true,
      optionsWrite: true,
    });
  });
});
