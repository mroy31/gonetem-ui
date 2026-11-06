import React from "react";
import { useTranslation } from "react-i18next";
import { PhotoIcon, ArrowsPointingInIcon, DocumentCheckIcon, Squares2X2Icon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { GraphLayoutKind } from "./topologyLayout";


export default function ProjectGraphToolbar({
  selectedEdge,
  dwImgHandle,
  fitHandle,
  layoutHandle,
  saveTopologyHandle,
}: {
  selectedEdge: string;
  dwImgHandle: () => void;
  fitHandle: () => void;
  layoutHandle: (kind: GraphLayoutKind) => void;
  saveTopologyHandle: () => void;
}): React.JSX.Element {
  const {t} = useTranslation();

  const layouts: { kind: GraphLayoutKind; label: string }[] = [
    { kind: "force", label: t("LayoutForce") },
    { kind: "grid", label: t("LayoutGrid") },
    { kind: "concentric", label: t("LayoutConcentric") },
    { kind: "hierarchical", label: t("LayoutHierarchical") },
  ];

  return (
    <div className="flex-none flex bg-base-200">
      <div className="flex-1 p-2 ml-2">
        {selectedEdge != "" && <span>{t("SelectedEdgesLabel", {edges: selectedEdge})}</span>}
      </div>

      <div className="flex-none p-1 pr-0 dropdown dropdown-top">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-outline btn-sm btn-primary"
        >
          <Squares2X2Icon className="w-5" />
          <span>{t("Layout")}</span>
          <ChevronUpIcon className="w-4" />
        </div>
        <ul
          tabIndex={0}
          className="p-2 shadow-sm menu dropdown-content z-[1] bg-base-100 rounded-box w-40"
        >
          {layouts.map((l) => (
            <li key={l.kind}>
              <a onClick={() => layoutHandle(l.kind)}>{l.label}</a>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-none join p-1">
        <button 
            className="btn btn-outline btn-sm join-item btn-primary" 
            onClick={fitHandle}
        >
          <ArrowsPointingInIcon className="w-5" />
          <span>{t("Fit")}</span>
        </button>
        <button 
            className="btn btn-outline btn-sm join-item btn-primary" 
            onClick={dwImgHandle}
        >
          <PhotoIcon className="w-5" />
          <span>{t("Image")}</span>
        </button>
        <button 
            className="btn btn-outline btn-sm join-item btn-primary" 
            onClick={saveTopologyHandle}
        >
          <DocumentCheckIcon className="w-5" />
          <span>{t("Save")}</span>
        </button>
      </div>
    </div>
  );
}
