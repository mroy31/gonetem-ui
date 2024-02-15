import React, { useState, useMemo, useCallback } from "react";
import { XMarkIcon, ArrowPathIcon, PlayIcon, DocumentCheckIcon } from "@heroicons/react/24/solid";
import { IProjectState } from "../api/interface";
import { IPrjAction, PrjActionKing } from "./ProjectPanel";
import { useAppContext } from "../context";
import classNames from "classnames";

export default function ProjectToolbar({
  prjStatus,
  onClose,
  dispatch,
}: {
  prjStatus: IProjectState;
  onClose: () => void;
  dispatch: React.Dispatch<IPrjAction>;
}): JSX.Element {
  const {setError, setLoadingMsg} = useAppContext();
  const [runLoading, setRunLoading] = useState(false);
  const [reloadLoading, setReloadLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const updateState = useCallback(() => {
    window.api.getProjectState(prjStatus.id).then((res) => {
      res.status
        ? dispatch({type: PrjActionKing.STATE, state: res.result})
        : setError(res.error);
    });
  }, [prjStatus.id])

  const handleRun = () => {
    if (prjStatus.running) return;

    setRunLoading(true);
    setLoadingMsg("Wait while the project starting");
    window.api.runTopology(prjStatus.id).then((res) => {
      setRunLoading(false);
      setLoadingMsg("");
      res.status
        ? updateState()
        : setError(res.error);
    });
  };

  const handleReload = () => {
    setReloadLoading(true);
    window.api.reloadTopology(prjStatus.id).then((res) => {
      setReloadLoading(false);
      res.status
        ? updateState()
        : setError(res.error);
    });
  }

  const handleSave = () => {
    setSaveLoading(true);
    window.api.saveProject(prjStatus.id).then((res) => {
      setSaveLoading(false);
      res.status
        ? updateState()
        : setError(res.error);
    });
  }

  const runBtnClasses = useMemo(() => classNames({
    btn: true,
    "btn-outline": true,
    "btn-sm": true,
    "join-item": true,
    "btn-accent": !prjStatus.running,
    "btn-success": prjStatus.running
  }), [prjStatus]);

  return (
    <div className="flex-none flex bg-base-200">
      <div className="flex-1 font-semibold ml-2 p-2">
        {prjStatus.name} ({prjStatus.openAt})
      </div>

      <div className="flex-none join">
        <button 
          onClick={handleRun}
          disabled={prjStatus.running || runLoading || reloadLoading || saveLoading}
          className={runBtnClasses}
        >
          { prjStatus.running ? (
            <span>Running</span>
          ) : (
            <>
              <PlayIcon className="w-5" />
              <span>{runLoading ? "Running project..." : "Run"}</span>
            </>
          )}

        </button>
        <button 
          onClick={handleSave}
          disabled={runLoading || reloadLoading || saveLoading}
          className="btn btn-outline btn-neutral btn-sm join-item"
        >
          <DocumentCheckIcon className="w-5" />
          <span>{saveLoading ? "Saving project..." : "Save"}</span>
        </button>
        <button 
          onClick={handleReload}
          disabled={runLoading || reloadLoading || saveLoading}
          className="btn btn-outline btn-neutral btn-sm join-item"
        >
          <ArrowPathIcon className="w-5" />
          <span>{reloadLoading ? "Reloading project..." : "Reload"}</span>
        </button>
        <button
          onClick={onClose}
          disabled={runLoading || reloadLoading || saveLoading}
          className="btn btn-outline btn-warning btn-sm join-item"
        >
          <XMarkIcon className="w-5" />
          <span>Close</span>
        </button>
      </div>
    </div>
  );
}
