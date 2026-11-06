import { describe, it, expect, vi, beforeAll } from "vitest";
import { screen } from "@testing-library/react";

vi.mock("vis-network", () => ({
  Network: class {
    on() {}
  },
}));

const EN_FIXTURE: Record<string, string> = {
  Options: "Options",
  ConnectServerHeader: "Connect to server",
  OpenProjectLabel: "Open a project",
  CreateProjectLabel: "Create a project",
  ConnectToProjectLabel: "Connect to a project",
  PullDockerImgLabel: "Pull docker images",
};

const OPTIONS = {
  server: "127.0.0.1:50051",
  autoconnect: false,
  tls: { enabled: false, ca: "", cert: "", key: "" },
  consoleExternalCmd: "xterm",
};

beforeAll(async () => {
  Object.defineProperty(window, "api", {
    value: {
      i18nRead: async (lng: string) => ({
        status: true,
        result: lng === "en" ? EN_FIXTURE : {},
      }),
      i18nCreate: async () => ({ status: true }),
      isConnected: async () => ({ status: true, result: { connected: false } }),
      getOptions: async () => ({ status: true, result: OPTIONS }),
    },
    configurable: true,
  });

  const container = document.createElement("div");
  container.id = "app-container";
  document.body.appendChild(container);

  await import("./app");
});

describe("application shell", () => {
  it("renders the navbar brand", async () => {
    await vi.waitFor(() => {
      expect(screen.getByText("GONETEM UI")).toBeTruthy();
    });
  });

  it("offers to connect when no server connection exists", async () => {
    await vi.waitFor(() => {
      expect(screen.getByText("Connect to server")).toBeTruthy();
    });
  });

  it("renders the disconnected project actions", async () => {
    await vi.waitFor(() => {
      expect(screen.getByText("Open a project")).toBeTruthy();
      expect(screen.getByText("Pull docker images")).toBeTruthy();
    });
  });
});
