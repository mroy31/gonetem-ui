import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import OptionsModal from "./OptionsModal";
import { IOptions } from "../api/options";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const OPTIONS: IOptions = {
  server: "localhost:10110",
  autoconnect: false,
  tls: { enabled: false },
  consoleExternalCmd: "",
};

const setOptions = vi.fn(async () => ({ status: true }));

Object.defineProperty(window, "api", {
  value: { setOptions },
  configurable: true,
});

afterEach(() => {
  cleanup();
  setOptions.mockClear();
});

describe("options modal", () => {
  it("maps isOpen to the dialog open attribute", () => {
    const { container, rerender } = render(
      <OptionsModal options={OPTIONS} isOpen={false} setIsOpen={() => {}} />
    );
    expect(container.querySelector("dialog")?.open).toBe(false);

    rerender(<OptionsModal options={OPTIONS} isOpen={true} setIsOpen={() => {}} />);
    expect(container.querySelector("dialog")?.open).toBe(true);
  });

  it("renders all five labeled fields as fieldsets with labelable inputs", () => {
    render(<OptionsModal options={OPTIONS} isOpen={true} setIsOpen={() => {}} />);

    for (const label of [
      "ServerURILabel",
      "CACertificateLabel",
      "ClientCertificateLabel",
      "ClientPrivateKeyLabel",
      "ExternalConsoleCommandLabel",
    ]) {
      expect(screen.getByLabelText(label)).toBeTruthy();
    }
  });

  it("toggles both checkboxes on click", () => {
    render(<OptionsModal options={OPTIONS} isOpen={true} setIsOpen={() => {}} />);

    const boxes = screen.getAllByRole("checkbox");
    expect(boxes.length).toBe(2);

    fireEvent.click(boxes[0]);
    expect((boxes[0] as HTMLInputElement).checked).toBe(true);

    fireEvent.click(boxes[1]);
    expect((boxes[1] as HTMLInputElement).checked).toBe(true);
  });

  it("saves edited values and closes on success", () => {
    const setIsOpen = vi.fn();
    render(<OptionsModal options={OPTIONS} isOpen={true} setIsOpen={setIsOpen} />);

    const serverInput = screen.getByLabelText("ServerURILabel") as HTMLInputElement;
    fireEvent.change(serverInput, { target: { value: "remote:9999" } });

    fireEvent.click(screen.getByText("Save"));

    expect(setOptions).toHaveBeenCalledWith(
      expect.objectContaining({ server: "remote:9999" })
    );
    return vi.waitFor(() => {
      expect(setIsOpen).toHaveBeenCalledWith(false);
    });
  });

  it("closes via the Close button", () => {
    const setIsOpen = vi.fn();
    render(<OptionsModal options={OPTIONS} isOpen={true} setIsOpen={setIsOpen} />);

    fireEvent.click(screen.getByText("Close"));
    expect(setIsOpen).toHaveBeenCalledWith(false);
  });
});
