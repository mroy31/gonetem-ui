import * as React from "react";
import { useTranslation } from "react-i18next";
import { features } from "../edition";

export type LabelContextMenuT = {
  mode: "" | "canvas" | "label";
  labelId: string;
  x: number;
  y: number;
};

export const HIDDEN_LABEL_MENU: LabelContextMenuT = {
  mode: "",
  labelId: "",
  x: 0,
  y: 0,
};

const LabelContextMenu = ({
  menu,
  onAdd,
  onDelete,
}: {
  menu: LabelContextMenuT;
  onAdd: () => void;
  onDelete: () => void;
}): React.JSX.Element | null => {
  const {t} = useTranslation();

  if (!features.topologyWrite || menu.mode == "") return null;

  return (
    <div
      style={{
        top: menu.y,
        left: menu.x,
      }}
      className="fixed z-10 flex flex-col gap-1 bg-base-200 rounded-lg"
    >
      <ul className="menu p-1">
        {menu.mode == "canvas" && (
          <li>
            <a onClick={onAdd}>{t("AddLabelMenu")}</a>
          </li>
        )}
        {menu.mode == "label" && (
          <li>
            <a onClick={onDelete}>{t("DeleteLabelMenu")}</a>
          </li>
        )}
      </ul>
    </div>
  );
};

export default LabelContextMenu;
