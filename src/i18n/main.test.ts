import { describe, it, expect, beforeAll } from "vitest";
import { cp, mkdtemp, readFile, writeFile } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";

type I18n = typeof import("i18next").default;

let i18n: I18n;

beforeAll(async () => {
  const root = await mkdtemp(join(tmpdir(), "gnt-i18n-"));
  await cp(
    join(process.cwd(), "app", "localization"),
    join(root, "app", "localization"),
    { recursive: true }
  );

  const frFile = join(root, "app", "localization", "locales", "fr", "translation.json");
  const frData = JSON.parse(await readFile(frFile, "utf8")) as Record<string, string>;
  delete frData["ConnectServerHeader"];
  await writeFile(frFile, JSON.stringify(frData));

  Object.defineProperty(process, "resourcesPath", {
    value: root,
    configurable: true,
  });

  const main = await import("./main");
  const i18next = await import("i18next");
  i18n = i18next.default;
  await main.initMainI18n();
});

describe("main process i18n", () => {
  it("is initialized for the supported default language", () => {
    expect(i18n.isInitialized).toBe(true);
    expect(i18n.language).toBe("fr");
  });

  it("loads the fr resource bundle from disk", () => {
    expect(i18n.t("OpenProjectLabel")).toBe("Ouvrir un projet .gnet");
  });

  it("falls back to en for keys missing in fr", () => {
    expect(i18n.t("ConnectServerHeader")).toBe("Connect to server");
  });

  it("returns the key itself when absent from every locale", () => {
    expect(i18n.t("no.such.key.at.all")).toBe("no.such.key.at.all");
  });
});
