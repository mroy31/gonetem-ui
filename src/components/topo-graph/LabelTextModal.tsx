import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { features } from "../../edition";

export default function LabelTextModal({
  isOpen,
  initialText,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  initialText: string;
  onClose: () => void;
  onConfirm: (text: string) => void;
}): React.JSX.Element {
  const { t } = useTranslation();
  const [text, setText] = useState(initialText);

  useEffect(() => {
    if (isOpen) setText(initialText);
  }, [isOpen, initialText]);

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

        <div className="modal-action">
          <button onClick={onClose} className="btn">
            {t("Cancel")}
          </button>
          <button onClick={() => onConfirm(text)} className="btn btn-primary">
            {t("Save")}
          </button>
        </div>
      </div>
    </dialog>
  );
}
