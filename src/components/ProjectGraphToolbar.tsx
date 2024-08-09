import React from "react";
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
  return (
    <div className="flex-none flex bg-base-200">
      <div className="flex-1 p-2 ml-2">
        {selectedEdge != "" && <span>Selected edge(s): {selectedEdge}</span>}
      </div>

      <div className="flex-none join p-1">
        <button 
            className="btn btn-outline btn-sm join-item btn-primary" 
            onClick={fitHandle}
        >
          <ArrowsPointingInIcon className="w-5" />
          <span>Fit</span>
        </button>
        <button 
            className="btn btn-outline btn-sm join-item btn-primary" 
            onClick={dwImgHandle}
        >
          <PhotoIcon className="w-5" />
          <span>Image</span>
        </button>
        <button 
            className="btn btn-outline btn-sm join-item btn-primary" 
            onClick={saveTopologyHandle}
        >
          <DocumentCheckIcon className="w-5" />
          <span>Save</span>
        </button>
      </div>
    </div>
  );
}
