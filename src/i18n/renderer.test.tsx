import { describe, it, expect, vi, beforeAll } from "vitest";
import type i18next from "i18next";

const i18nRead = vi.fn(async (language: string) => ({
  status: true,
  result:
    language === "fr"
      ? {}
      : { HelloTest: "Hello", OtherTest: "Other value" },
}));

const i18nCreate = vi.fn(async () => ({ status: true }));

let i18n: typeof i18next;

beforeAll(async () => {
  Object.defineProperty(window, "api", {
    value: { i18nRead, i18nCreate },
    configurable: true,
  });
  const mod = await import("./renderer");
  i18n = mod.default;
});

describe("renderer i18n through the IPC backend", () => {
  it("loads the locale bundle through window.api", async () => {
    await vi.waitFor(() => {
      expect(i18n.t("HelloTest")).toBe("Hello");
    });
    expect(i18nRead).toHaveBeenCalled();
  });

  it("falls back to en when the key is missing in fr", async () => {
    await i18n.changeLanguage("fr");
    await vi.waitFor(() => {
      expect(i18n.t("HelloTest")).toBe("Hello");
    });
    expect(i18n.language).toBe("fr");
  });

  it("reports unknown keys to the main process via saveMissing", async () => {
    await i18n.changeLanguage("en");
    expect(i18n.t("TotallyMissingKey")).toBe("TotallyMissingKey");
    await vi.waitFor(() => {
      expect(i18nCreate).toHaveBeenCalled();
    });
  });
});
