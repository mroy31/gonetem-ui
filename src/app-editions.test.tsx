import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

const mocks = vi.hoisted(() => ({
  edition: "full" as "full" | "student",
  features: {
    topologyWrite: true,
    topologyValidation: true,
    nodeConfigRead: true,
    optionsWrite: true,
  } as Record<string, boolean>,
}));

vi.mock("./edition", () => ({
  get edition() {
    return mocks.edition;
  },
  get features() {
    return mocks.features;
  },
}));

vi.mock("./i18n/renderer", () => ({ default: {} }));

vi.mock("cytoscape", () => ({
  default: Object.assign(() => ({ on: () => {} }), { use: () => {} }),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
  I18nextProvider: ({ children }: { children: React.ReactNode }) => children,
  initReactI18next: {},
}));

let App: React.ComponentType;

beforeEach(async () => {
  Object.defineProperty(window, "api", {
    value: {
      isConnected: async () => ({ status: true, result: { connected: false } }),
      getOptions: async () => ({
        status: true,
        result: {
          server: "s",
          autoconnect: true,
          tls: { enabled: false },
          consoleExternalCmd: "xterm",
        },
      }),
    },
    configurable: true,
  });

  App = (await import("./app")).default;
});

afterEach(cleanup);

const setEdition = (edition: "full" | "student") => {
  mocks.edition = edition;
  for (const key of Object.keys(mocks.features)) {
    mocks.features[key] = edition === "full";
  }
};

describe("application shell per edition", () => {
  it("full edition shows the Options button and no student badge", () => {
    setEdition("full");
    render(<App />);

    expect(screen.getByText("Options")).toBeTruthy();
    expect(screen.queryByText("StudentEditionBadge")).toBeNull();
  });

  it("student edition hides the Options affordance and shows the badge", () => {
    setEdition("student");
    render(<App />);

    expect(screen.queryByText("Options")).toBeNull();
    expect(screen.getByText("StudentEditionBadge")).toBeTruthy();
  });
});
