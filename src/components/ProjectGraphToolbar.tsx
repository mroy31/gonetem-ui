import React from "react";
import { useTranslation } from "react-i18next";
import { PhotoIcon, ArrowsPointingInIcon, DocumentCheckIcon } from "@heroicons/react/24/solid";


export default function ProjectGraphToolbar({
  selectedEdge,
  dwImgHandle,
  fitHandle,
  saveTopologyHandle,
}: {
  selectedEdge: string;
  dwImgHandle: () => void;
  fitHandle: () => void;
  saveTopologyHandle: () => void;
}): JSX.Element {
  const {t} = useTranslation();

  return (
    <div className="flex-none flex bg-base-200">
      <div className="flex-1 p-2 ml-2">
        {selectedEdge != "" && <span>{t("SelectedEdgesLabel", {edges: selectedEdge})}</span>}
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
