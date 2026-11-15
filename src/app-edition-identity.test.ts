// Unit tests for src/app-edition-identity.ts
import { describe, it, expect, vi } from "vitest";

const setName = vi.fn();

vi.mock("electron", () => ({
  app: {
    setName,
  },
}));

describe("app-edition-identity", () => {
  it("renames the app in the student edition", async () => {
    vi.resetModules();
    vi.doMock("./edition", () => ({
      edition: "student",
      studentServerUri: "localhost:10110",
    }));

    const { applyEditionIdentity } = await import("./app-edition-identity");
    expect(setName).toHaveBeenCalledWith("gonetem-ui-student");
    expect(applyEditionIdentity()).toBe("gonetem-ui-student");
    setName.mockClear();
  });

  it("leaves the app name untouched in the full edition (test build default)", async () => {
    vi.doUnmock("./edition");
    vi.resetModules();

    const { applyEditionIdentity } = await import("./app-edition-identity");
    expect(setName).not.toHaveBeenCalled();
    expect(applyEditionIdentity()).toBeNull();
  });
});
