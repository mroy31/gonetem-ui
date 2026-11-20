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
      <LabelTextModal
        isOpen={false}
        initialText=""
        onClose={() => {}}
        onConfirm={() => {}}
      />,
    );
    expect(container.querySelector("dialog")?.open).toBe(false);

    rerender(
      <LabelTextModal
        isOpen={true}
        initialText=""
        onClose={() => {}}
        onConfirm={() => {}}
      />,
    );
    expect(container.querySelector("dialog")?.open).toBe(true);
  });

  it("prefills the input with the initial text", () => {
    render(
      <LabelTextModal
        isOpen={true}
        initialText="WAN link"
        onClose={() => {}}
        onConfirm={() => {}}
      />,
    );
    expect(
      (screen.getByLabelText("LabelTextLabel") as HTMLInputElement).value,
    ).toBe("WAN link");
  });

  it("confirms the edited text", () => {
    const onConfirm = vi.fn();
    render(
      <LabelTextModal
        isOpen={true}
        initialText="old"
        onClose={() => {}}
        onConfirm={onConfirm}
      />,
    );

    fireEvent.change(screen.getByLabelText("LabelTextLabel"), {
      target: { value: "new text" },
    });
    fireEvent.click(screen.getByText("Save"));

    expect(onConfirm).toHaveBeenCalledWith("new text", "subnet");
  });

  it("confirms an empty text on confirm", () => {
    const onConfirm = vi.fn();
    render(
      <LabelTextModal
        isOpen={true}
        initialText="to delete"
        onClose={() => {}}
        onConfirm={onConfirm}
      />,
    );

    fireEvent.change(screen.getByLabelText("LabelTextLabel"), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByText("Save"));

    expect(onConfirm).toHaveBeenCalledWith("", "subnet");
  });

  it("cancels without confirming", () => {
    const onConfirm = vi.fn();
    const onClose = vi.fn();
    render(
      <LabelTextModal
        isOpen={true}
        initialText="x"
        onClose={onClose}
        onConfirm={onConfirm}
      />,
    );

    fireEvent.change(screen.getByLabelText("LabelTextLabel"), {
      target: { value: "edited but canceled" },
    });
    fireEvent.click(screen.getByText("Cancel"));

    expect(onClose).toHaveBeenCalled();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("re-prefills when reopened with a different initial text", () => {
    const { rerender } = render(
      <LabelTextModal
        isOpen={false}
        initialText="first"
        onClose={() => {}}
        onConfirm={() => {}}
      />,
    );

    rerender(
      <LabelTextModal
        isOpen={true}
        initialText="second"
        onClose={() => {}}
        onConfirm={() => {}}
      />,
    );
    expect(
      (screen.getByLabelText("LabelTextLabel") as HTMLInputElement).value,
    ).toBe("second");
  });

  it("defaults the kind selection to subnet on add", () => {
    render(
      <LabelTextModal
        isOpen={true}
        initialText=""
        kind="subnet"
        onClose={() => {}}
        onConfirm={() => {}}
      />,
    );
    expect(
      (screen.getByLabelText("LabelKindSubnet") as HTMLInputElement).checked,
    ).toBe(true);
    expect(
      (screen.getByLabelText("LabelKindAsNumber") as HTMLInputElement).checked,
    ).toBe(false);
  });

  it("prefills the kind on edit", () => {
    render(
      <LabelTextModal
        isOpen={true}
        initialText="AS 65001"
        kind="as"
        onClose={() => {}}
        onConfirm={() => {}}
      />,
    );
    expect(
      (screen.getByLabelText("LabelKindAsNumber") as HTMLInputElement).checked,
    ).toBe(true);
    expect(
      (screen.getByLabelText("LabelKindSubnet") as HTMLInputElement).checked,
    ).toBe(false);
  });

  it("re-prefills the kind when reopened", () => {
    const { rerender } = render(
      <LabelTextModal
        isOpen={false}
        initialText=""
        kind="as"
        onClose={() => {}}
        onConfirm={() => {}}
      />,
    );
    rerender(
      <LabelTextModal
        isOpen={true}
        initialText=""
        kind="subnet"
        onClose={() => {}}
        onConfirm={() => {}}
      />,
    );
    expect(
      (screen.getByLabelText("LabelKindSubnet") as HTMLInputElement).checked,
    ).toBe(true);
  });

  it("confirms the chosen kind", () => {
    const onConfirm = vi.fn();
    render(
      <LabelTextModal
        isOpen={true}
        initialText="65001"
        kind="subnet"
        onClose={() => {}}
        onConfirm={onConfirm}
      />,
    );

    fireEvent.click(screen.getByLabelText("LabelKindAsNumber"));
    fireEvent.click(screen.getByText("Save"));

    expect(onConfirm).toHaveBeenCalledWith("65001", "as");
  });

  it("accepts any text for the as kind without validation", () => {
    const onConfirm = vi.fn();
    render(
      <LabelTextModal
        isOpen={true}
        initialText=""
        kind="as"
        onClose={() => {}}
        onConfirm={onConfirm}
      />,
    );

    fireEvent.change(screen.getByLabelText("LabelTextLabel"), {
      target: { value: "not a number at all" },
    });
    fireEvent.click(screen.getByText("Save"));

    expect(onConfirm).toHaveBeenCalledWith("not a number at all", "as");
  });
});
