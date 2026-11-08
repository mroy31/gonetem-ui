import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import LabelTextModal from "./LabelTextModal";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

afterEach(cleanup);

describe("label text modal", () => {
  it("maps isOpen to the dialog open attribute", () => {
    const { container, rerender } = render(
      <LabelTextModal isOpen={false} initialText="" onClose={() => {}} onConfirm={() => {}} />
    );
    expect(container.querySelector("dialog")?.open).toBe(false);

    rerender(<LabelTextModal isOpen={true} initialText="" onClose={() => {}} onConfirm={() => {}} />);
    expect(container.querySelector("dialog")?.open).toBe(true);
  });

  it("prefills the input with the initial text", () => {
    render(
      <LabelTextModal isOpen={true} initialText="WAN link" onClose={() => {}} onConfirm={() => {}} />
    );
    expect((screen.getByLabelText("LabelTextLabel") as HTMLInputElement).value).toBe("WAN link");
  });

  it("confirms the edited text", () => {
    const onConfirm = vi.fn();
    render(
      <LabelTextModal isOpen={true} initialText="old" onClose={() => {}} onConfirm={onConfirm} />
    );

    fireEvent.change(screen.getByLabelText("LabelTextLabel"), { target: { value: "new text" } });
    fireEvent.click(screen.getByText("Save"));

    expect(onConfirm).toHaveBeenCalledWith("new text");
  });

  it("confirms an empty text on confirm", () => {
    const onConfirm = vi.fn();
    render(
      <LabelTextModal isOpen={true} initialText="to delete" onClose={() => {}} onConfirm={onConfirm} />
    );

    fireEvent.change(screen.getByLabelText("LabelTextLabel"), { target: { value: "" } });
    fireEvent.click(screen.getByText("Save"));

    expect(onConfirm).toHaveBeenCalledWith("");
  });

  it("cancels without confirming", () => {
    const onConfirm = vi.fn();
    const onClose = vi.fn();
    render(
      <LabelTextModal isOpen={true} initialText="x" onClose={onClose} onConfirm={onConfirm} />
    );

    fireEvent.change(screen.getByLabelText("LabelTextLabel"), { target: { value: "edited but canceled" } });
    fireEvent.click(screen.getByText("Cancel"));

    expect(onClose).toHaveBeenCalled();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("re-prefills when reopened with a different initial text", () => {
    const { rerender } = render(
      <LabelTextModal isOpen={false} initialText="first" onClose={() => {}} onConfirm={() => {}} />
    );

    rerender(<LabelTextModal isOpen={true} initialText="second" onClose={() => {}} onConfirm={() => {}} />);
    expect((screen.getByLabelText("LabelTextLabel") as HTMLInputElement).value).toBe("second");
  });
});
