import React, { useMemo, useCallback } from "react";
import { XMarkIcon, ArrowPathIcon, PlayIcon, DocumentCheckIcon, ComputerDesktopIcon } from "@heroicons/react/24/solid";
import { IProjectState } from "../api/interface";
import { IPrjAction, PrjActionKing } from "./ProjectPanel";
import { ProgressOperation, useAppContext } from "../context";
import classNames from "classnames";
import { useTranslation } from "react-i18next";

export default function ProjectToolbar({
  prjStatus,
  onClose,
  dispatch,
}: {
  prjStatus: IProjectState;
  onClose: () => void;
  dispatch: React.Dispatch<IPrjAction>;
}): JSX.Element {
  const {t} = useTranslation();
  const {setError, currentPrgOperation, setCurrentPrgOperation} = useAppContext();

  const runAllConsoles = useCallback(() => {
    window.api.runAllConsoles(prjStatus.id, false).then((res) => {
      if (!res.status) setError(res.error);
    });
  }, [prjStatus.id]);

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
      res.status
        ? updateState()
        : setError(res.error);
      setCurrentPrgOperation(ProgressOperation.None);
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
            <span>{t("Running")}</span>
          ) : (
            <>
              <PlayIcon className="w-5" />
              <span>{t("Run")}</span>
            </>
          )}

        </button>
        <button 
          onClick={handleSave}
          disabled={currentPrgOperation != ProgressOperation.None}
          className="btn btn-outline btn-neutral btn-sm join-item"
        >
          <DocumentCheckIcon className="w-5" />
          <span>{t("Save")}</span>
        </button>
        <button 
          onClick={handleReload}
          disabled={currentPrgOperation != ProgressOperation.None}
          className="btn btn-outline btn-neutral btn-sm join-item"
        >
          <ArrowPathIcon className="w-5" />
          <span>{t("Reload")}</span>
        </button>
        <button 
            className="btn btn-outline btn-sm join-item" 
            disabled={!prjStatus.running}
            onClick={runAllConsoles}
        >
          <ComputerDesktopIcon className="w-5" />
          <span>{t("Consoles")}</span>
        </button>
        <button
          onClick={onClose}
          disabled={currentPrgOperation != ProgressOperation.None}
          className="btn btn-outline btn-warning btn-sm join-item"
        >
          <XMarkIcon className="w-5" />
          <span>{t("Close")}</span>
        </button>
      </div>
    </div>
  );
}
