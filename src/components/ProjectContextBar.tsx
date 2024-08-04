import React, { useCallback } from "react";
import { useAppContext } from "../context";
import { IProjectState } from "../api/interface";

export default function ProjectContextBar({
  prjStatus,
  selectedEdge,
  dwImgHandle,
}: {
  prjStatus: IProjectState;
  selectedEdge: string;
  dwImgHandle: () => void;
}): JSX.Element {
  const { setError } = useAppContext();

  const runAllConsoles = useCallback(() => {
    window.api.runAllConsoles(prjStatus.id, false).then((res) => {
      if (!res.status) setError(res.error);
    });
  }, [prjStatus.id]);

  return (
    <div className="flex-none flex bg-base-200">
      <div className="flex-1 p-2 ml-2">
        {selectedEdge != "" && <span>Selected edge(s): {selectedEdge}</span>}
      </div>

      <div className="flex-none join p-1">
        <button 
            className="btn btn-outline btn-sm join-item" 
            onClick={dwImgHandle}
        >
          Topo image
        </button>
        <button 
            className="btn btn-outline btn-sm join-item" 
            disabled={!prjStatus.running}
            onClick={runAllConsoles}
        >
          All consoles
        </button>
      </div>
    </div>
  );
}
