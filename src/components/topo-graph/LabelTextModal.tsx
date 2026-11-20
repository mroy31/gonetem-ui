import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { features } from "../../edition";
import type { LabelKind } from "./topologyLabels";

export default function LabelTextModal({
  isOpen,
  initialText,
  kind = "subnet",
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  initialText: string;
  kind?: LabelKind;
  onClose: () => void;
  onConfirm: (text: string, kind: LabelKind) => void;
}): React.JSX.Element {
  const { t } = useTranslation();
  const [text, setText] = useState(initialText);
  const [selectedKind, setSelectedKind] = useState<LabelKind>(kind);

  useEffect(() => {
    if (isOpen) {
      setText(initialText);
      setSelectedKind(kind);
    }
  }, [isOpen, initialText, kind]);

  return (
    <dialog open={isOpen && features.topologyWrite} className="modal">
      <div className="modal-box">
        <h2 className="text-2xl font-bold">{t("LabelTextModalHeader")}</h2>

        <fieldset className="fieldset">
          <label className="fieldset-legend" htmlFor="labelTextInput">
            {t("LabelTextLabel")}
          </label>
          <input
            id="labelTextInput"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="input"
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">{t("LabelKindLabel")}</legend>
          <label className="label">
            <input
              type="radio"
              name="labelKind"
              value="subnet"
              checked={selectedKind == "subnet"}
              onChange={() => setSelectedKind("subnet")}
              className="radio"
            />
            {t("LabelKindSubnet")}
          </label>
          <label className="label">
            <input
              type="radio"
              name="labelKind"
              value="as"
              checked={selectedKind == "as"}
              onChange={() => setSelectedKind("as")}
              className="radio"
            />
            {t("LabelKindAsNumber")}
          </label>
        </fieldset>

        <div className="modal-action">
          <button onClick={onClose} className="btn">
            {t("Cancel")}
          </button>
          <button
            onClick={() => onConfirm(text, selectedKind)}
            className="btn btn-primary"
          >
            {t("Save")}
          </button>
        </div>
      </div>
    </dialog>
  );
}
