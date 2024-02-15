import * as React from "react";
import classNames from "classnames";
import { INodeState, IfState } from "../api/interface";
import { useCallback, useState } from "react";
import { useAppContext } from "../context";

export type NodeContextMenuT = {
  prjId: string;
  nodeId: string;
  x: number;
  y: number;
};

const NodeContextMenu = ({
  contextMenu,
  state,
  onHide,
}: {
  contextMenu: NodeContextMenuT;
  state: INodeState;
  onHide: (state: boolean) => void;
}): JSX.Element => {
  const { setError } = useAppContext();
  const [loading, setLoading] = useState("");

  const handleRunConsole = useCallback((shell: boolean) => {
    if (state.running && loading == "") {
      window.api
        .runNodeConsole(contextMenu.prjId, contextMenu.nodeId, shell)
        .then((res) => {
          res.status ? onHide(false) : setError(res.error);
        });
    }
  }, [contextMenu, state.running]);

  const handleStart = useCallback(() => {
    if (!state.running && loading == "") {
      setLoading("start");
      window.api
        .runNodeStart(contextMenu.prjId, contextMenu.nodeId)
        .then((res) => {
          setLoading("");
          res.status ? onHide(true) : setError(res.error);
        });
    }
  }, [contextMenu, state.running]);

  const handleStop = useCallback(() => {
    if (state.running && loading == "") {
      setLoading("stop");
      window.api
        .runNodeStop(contextMenu.prjId, contextMenu.nodeId)
        .then((res) => {
          setLoading("");
          res.status ? onHide(true) : setError(res.error);
        });
    }
  }, [contextMenu, state.running]);

  const handleRestart = useCallback(() => {
    if (state.running && loading == "") {
      setLoading("restart");
      window.api
        .runNodeRestart(contextMenu.prjId, contextMenu.nodeId)
        .then((res) => {
          setLoading("");
          res.status ? onHide(true) : setError(res.error);
        });
    }
  }, [contextMenu, state.running]);

  const handleCapture = useCallback(
    (ifName: string) => {
      if (state.running && loading == "") {
        const match = ifName.match(/eth([0-9]+)/);

        if (match.length > 1) {
          setLoading("capture");

          const ifIndex = parseInt(match[1]);
          window.api
            .runNodeCapture(contextMenu.prjId, contextMenu.nodeId, ifIndex)
            .then((res) => {
              setLoading("");
              res.status ? onHide(false) : setError(res.error);
            });
        }
      }
    },
    [contextMenu, state.running]
  );

  const handleIfState = useCallback(
    (ifName: string, up: boolean) => {
      if (state.running && loading == "") {
        const match = ifName.match(/eth([0-9]+)/);

        if (match.length > 1) {
          const ifIndex = parseInt(match[1]);
          window.api
            .runNodeSetIfState(contextMenu.prjId, contextMenu.nodeId, ifIndex, up)
            .then((res) => {
              setLoading("");
              res.status ? onHide(true) : setError(res.error);
            });
        }
      }
    },
    [contextMenu, state.running]
  );

  const actionClasses = classNames({ disabled: loading != "" });
  return (
    <div
      style={{
        top: contextMenu.y,
        left: contextMenu.x,
      }}
      className="fixed z-10 flex flex-col gap-1 bg-base-200 rounded-lg"
    >
      <ul className="menu p-1">
        <li className="menu-title">
          {contextMenu.nodeId} ({state.running ? "running" : "not running"})
        </li>
        {!state.running && (
          <li>
            <a className={actionClasses} onClick={handleStart}>
              {loading == "start" ? "Starting..." : "Start"}
            </a>
          </li>
        )}
        {state.running && (
          <>
            <li>
              <a className={actionClasses} onClick={() => handleRunConsole(false)}>
                External console
              </a>
            </li>
            <li>
              <a className={actionClasses} onClick={() => handleRunConsole(true)}>
                Debug shell
              </a>
            </li>
            <li>
              <a className={actionClasses} onClick={handleStop}>
                {loading == "stop" ? "Stoping..." : "Stop"}
              </a>
            </li>
            <li>
              <a className={actionClasses} onClick={handleRestart}>
                {loading == "restart" ? "Restarting..." : "Restart"}
              </a>
            </li>
            <li>
              <details>
                <summary>
                  {loading == "capture" ? "Capturing..." : "Capture"}
                </summary>
                <ul>
                  {state.interfaces
                    .filter((int) => int.state == IfState.UP)
                    .map((int) => (
                      <li key={int.name}>
                        <a onClick={() => handleCapture(int.name)}>
                          {int.name}
                        </a>
                      </li>
                    ))}
                </ul>
              </details>
            </li>
            {
              state.interfaces
                .filter((int) => int.state == IfState.UP).length > 0 && (
                  <li>
                    <details>
                      <summary>Shutdown interface</summary>
                      <ul>
                        {state.interfaces
                          .filter((int) => int.state == IfState.UP)
                          .map((int) => (
                            <li key={int.name}>
                              <a onClick={() => handleIfState(int.name, false)}>
                                {int.name}
                              </a>
                            </li>
                          ))}
                      </ul>
                    </details>
                  </li>
              )
            }
            {
              state.interfaces
                .filter((int) => int.state == IfState.DOWN).length > 0 && (
                  <li>
                    <details>
                      <summary>Enable interface</summary>
                      <ul>
                        {state.interfaces
                          .filter((int) => int.state == IfState.DOWN)
                          .map((int) => (
                            <li key={int.name}>
                              <a onClick={() => handleIfState(int.name, true)}>
                                {int.name}
                              </a>
                            </li>
                          ))}
                      </ul>
                    </details>
                  </li>
              )
            }
          </>
        )}
      </ul>
    </div>
  );
};

export default NodeContextMenu;
