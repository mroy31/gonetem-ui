import React, { useState, useMemo, useCallback } from "react";
import { XMarkIcon, ArrowPathIcon, PlayIcon, DocumentCheckIcon } from "@heroicons/react/24/solid";
import { IProjectState } from "../api/interface";
import { IPrjAction, PrjActionKing } from "./ProjectPanel";
import { ProgressOperation, useAppContext } from "../context";
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
  const {setError, currentPrgOperation, setCurrentPrgOperation} = useAppContext();

  const updateState = useCallback(() => {
    window.api.getProjectState(prjStatus.id).then((res) => {
      res.status
        ? dispatch({type: PrjActionKing.STATE, state: res.result})
        : setError(res.error);
    });
  }, [prjStatus.id])

  const handleRun = () => {
    if (prjStatus.running) return;

    setCurrentPrgOperation(ProgressOperation.TopologyRun);
    window.api.runTopology(prjStatus.id).then((res) => {
      setCurrentPrgOperation(ProgressOperation.None);
      res.status
        ? updateState()
        : setError(res.error);
    });
  };

  const handleReload = () => {
    setCurrentPrgOperation(ProgressOperation.TopologyReload);
    window.api.reloadTopology(prjStatus.id).then((res) => {
      setCurrentPrgOperation(ProgressOperation.None);
      res.status
        ? updateState()
        : setError(res.error);
    });
  }

  const handleSave = () => {
    setCurrentPrgOperation(ProgressOperation.ProjectSave);
    window.api.saveProject(prjStatus.id).then((res) => {
      setCurrentPrgOperation(ProgressOperation.None);
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
          disabled={prjStatus.running || currentPrgOperation != ProgressOperation.None}
          className={runBtnClasses}
        >
          { prjStatus.running ? (
            <span>Running</span>
          ) : (
            <>
              <PlayIcon className="w-5" />
              <span>Run</span>
            </>
          )}

        </button>
        <button 
          onClick={handleSave}
          disabled={currentPrgOperation != ProgressOperation.None}
          className="btn btn-outline btn-neutral btn-sm join-item"
        >
          <DocumentCheckIcon className="w-5" />
          <span>Save</span>
        </button>
        <button 
          onClick={handleReload}
          disabled={currentPrgOperation != ProgressOperation.None}
          className="btn btn-outline btn-neutral btn-sm join-item"
        >
          <ArrowPathIcon className="w-5" />
          <span>Reload</span>
        </button>
        <button
          onClick={onClose}
          disabled={currentPrgOperation != ProgressOperation.None}
          className="btn btn-outline btn-warning btn-sm join-item"
        >
          <XMarkIcon className="w-5" />
          <span>Close</span>
        </button>
      </div>
    </div>
  );
}
