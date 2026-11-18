import classNames from "classnames";
import React, { useEffect, useCallback, useReducer } from "react";
import { useTranslation } from "react-i18next";
import ProjectContextPanel from "./ProjectContextPanel";
import ProjectToolbar from "./ProjectToolbar";
import { IProjectState } from "../api/interface";
import ProjectTopoGraphContainer from "./ProjectTopoGraphContainer";
import ProjectOspfGraph from "./ProjectOspfGraph";

type IView = "topo" | "ospf";

export enum PrjActionKing {
  INIT = "INIT",
  STATE = "STATE",
  TOPOLOGY = "TOPOLOGY",
  VIEW = "VIEW",
  ERROR = "ERROR",
}

export type IPrjAction =
  | { type: PrjActionKing.INIT; state: IProjectState; topology: string }
  | { type: PrjActionKing.STATE; state: IProjectState }
  | { type: PrjActionKing.TOPOLOGY; topology: string }
  | { type: PrjActionKing.VIEW; view: IView }
  | { type: PrjActionKing.ERROR; error: string };

interface IPrjState {
  error: string;
  loading: boolean;
  status: IProjectState | null;
  topology: string;
  view: IView;
}

function reducer(state: IPrjState, action: IPrjAction): IPrjState {
  switch (action.type) {
    case PrjActionKing.INIT:
      return {
        ...state,
        error: "",
        loading: false,
        status: action.state,
        topology: action.topology,
      };
    case PrjActionKing.STATE:
      return {
        ...state,
        error: "",
        status: action.state,
      };
    case PrjActionKing.TOPOLOGY:
      return {
        ...state,
        error: "",
        topology: action.topology,
      };
    case PrjActionKing.VIEW:
      return {
        ...state,
        view: action.view,
      };
    case PrjActionKing.ERROR:
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    default:
      return state;
  }
}

export default function ProjectPanel({
  prjId,
  onClose,
}: {
  prjId: string;
  onClose: () => void;
}): React.JSX.Element {
  const { t } = useTranslation();
  const [state, dispatch] = useReducer(reducer, {
    error: "",
    loading: true,
    status: null,
    topology: "",
    view: "topo",
  });

  const updateState = useCallback(() => {
    window.api.getProjectState(prjId).then((res) => {
      res.status
        ? dispatch({ type: PrjActionKing.STATE, state: res.result })
        : dispatch({ type: PrjActionKing.ERROR, error: res.error });
    });
  }, [prjId]);

  useEffect(() => {
    if (prjId == "") return;
    const init = async (): Promise<IPrjAction> => {
      try {
        const state = await window.api.getProjectState(prjId);
        const topology = await window.api.readTopologyFile(prjId);

        if (!state.status)
          return { type: PrjActionKing.ERROR, error: state.error };
        if (!topology.status)
          return { type: PrjActionKing.ERROR, error: topology.error };

        return {
          type: PrjActionKing.INIT,
          state: state.result,
          topology: topology.result,
        };
      } catch (err) {
        return {
          type: PrjActionKing.ERROR,
          error: t("ProjectPanelErrMsg", {
            error: err instanceof Error ? err.message : String(err),
          }),
        };
      }
    };

    init().then((action) => dispatch(action));
  }, [prjId]);

  if (state.loading) {
    return (
      <div className="flex-1 h-full bg-base-100 flex align-middle justify-center">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      {state.error ? (
        <div className="flex-1 bg-base-100 flex align-middle justify-center">
          <div className="alert alert-error flex gap-2">
            <span>{state.error}</span>
          </div>
        </div>
      ) : state.status == null ? (
        <div className="flex-1 h-full bg-base-100 flex align-middle justify-center">
          <span className="loading loading-bars loading-lg"></span>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-[minmax(0,1fr)_auto] bg-base-100 min-h-0">
          <div className="flex flex-col h-full min-h-0 min-w-0">
            <ProjectToolbar
              prjStatus={state.status}
              onClose={onClose}
              dispatch={dispatch}
            />

            <div className="flex flex-1 min-h-0 overflow-scroll">
              <ul
                role="tablist"
                aria-orientation="vertical"
                className="menu menu-sm bg-base-200 rounded-box flex-none py-1"
              >
                <li role="presentation">
                  <a
                    role="tab"
                    className={classNames({
                      "menu-active": state.view == "topo",
                    })}
                    onClick={() =>
                      dispatch({ type: PrjActionKing.VIEW, view: "topo" })
                    }
                  >
                    <span className="[writing-mode:vertical-rl] py-1 px-2">
                      {t("Topology")}
                    </span>
                  </a>
                </li>
                <li role="presentation">
                  <a
                    role="tab"
                    className={classNames({
                      "menu-active": state.view == "ospf",
                      "menu-disabled": !state.status.running,
                    })}
                    onClick={() =>
                      dispatch({ type: PrjActionKing.VIEW, view: "ospf" })
                    }
                  >
                    <span className="[writing-mode:vertical-rl] py-1 px-2">
                      {t("Ospf")}
                    </span>
                  </a>
                </li>
              </ul>

              {state.view == "topo" && (
                <ProjectTopoGraphContainer
                  updateState={updateState}
                  status={state.status}
                  topology={state.topology}
                  prjId={prjId}
                  dispatch={dispatch}
                />
              )}
              {state.view == "ospf" && (
                <ProjectOspfGraph
                  prjId={prjId}
                  status={state.status}
                  topology={state.topology}
                />
              )}
            </div>
          </div>

          <ProjectContextPanel
            dispatch={dispatch}
            prjStatus={state.status}
            topology={state.topology}
          />
        </div>
      )}
    </>
  );
}
