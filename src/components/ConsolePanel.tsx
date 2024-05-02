import React, { useCallback, useEffect, useRef, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { IDisposable, Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { SerializeAddon } from "xterm-addon-serialize";
import classNames from "classnames";
import { INodeState, IProjectState } from "../api/interface";
import "xterm/css/xterm.css";

function usePrevious<T>(value: T): T {
  const ref: any = useRef<T>();

  useEffect(() => {
    ref.current = JSON.parse(JSON.stringify(value));
  }, [value]);

  return ref.current;
}

const TermPanel = ({
  nodeName,
  onClose,
}: {
  nodeName: string;
  onClose: () => void;
}): JSX.Element => {
  const previousNodeName = usePrevious(nodeName);
  const [isTermInit, setTermInit] = useState<boolean>(false);
  const [resizeListener, setResizeListener] = useState<IDisposable>(null);
  const [dataListener, setDataListener] = useState<IDisposable>(null);

  const term = useRef(new Terminal());
  const fitAddon = useRef(new FitAddon());
  const serializeAddon = useRef(new SerializeAddon());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((_entries) => {
      fitAddon.current.fit();
    });
    resizeObserver.observe(containerRef.current);

    if (containerRef.current && !isTermInit) {
      term.current.loadAddon(fitAddon.current);
      term.current.loadAddon(serializeAddon.current);

      term.current.open(containerRef.current);
      fitAddon.current.fit();

      setTermInit(true);
      return () => resizeObserver.disconnect();
    }
  }, [containerRef.current, isTermInit]);

  useEffect(() => {
    if (!isTermInit) return;

    if (resizeListener != null) resizeListener.dispose();
    if (dataListener != null) dataListener.dispose();

    if (previousNodeName) {
      window.api.consoleRemoveListeners(previousNodeName);
      term.current.reset();
    }

    window.api.consoleAddListener(nodeName, (msgType: string, data: string) => {
      switch (msgType) {
        case "stderr":
        case "stdout":
          term.current.write(data, () => {
            window.api
              .consoleSaveState(nodeName, serializeAddon.current.serialize())
              .then((res) => {
                if (!res.status)
                  console.log(
                    `ERROR: unable to save console state for node ${nodeName}`
                  );
              });
          });
          break;

        case "error":
          console.log(data);
          break;

        case "close":
          term.current.clear();
          onClose();
          break;
      }
    });

    window.api.consoleRun(nodeName).then((res) => {
      if (!res.status) {
        console.log(res.error);
        return;
      }

      setDataListener(term.current.onData((data: string) => {
        window.api.consoleWrite(nodeName, data).then((res) => {
          if (!res.status) console.log(res.error);
        });
      }));
      setResizeListener(term.current.onResize((size) => {
        window.api.consoleResize(nodeName, size.cols, size.rows).then((res) => {
          if (!res.status) console.log(res.error);
        });
      }));

      if (res.result != "") {
        term.current.write(res.result);
      }
      term.current.focus();
    });

    return () => window.api.consoleRemoveListeners(nodeName);
  }, [nodeName, isTermInit]);

  return <div className="flex-1 min-h-0" ref={containerRef}></div>;
};

const InodeStateSortFunc = (a: INodeState, b: INodeState): number => {
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0;
};

export default function ConsolePanel({
  prjStatus,
}: {
  prjStatus: IProjectState;
}): JSX.Element {
  const [nodes, setNodes] = useState<INodeState[]>([]);
  const [selectedConsole, setSelectedConsole] = useState<string>(null);
  const [runningConsoles, setRunningConsoles] = useState<string[]>([]);

  const closeConsole = useCallback(() => {
    const newRunningConsoles = runningConsoles.filter(
      (n) => n != selectedConsole
    );
    setRunningConsoles(newRunningConsoles);

    if (newRunningConsoles.length > 0) {
      setSelectedConsole(newRunningConsoles[0]);
    } else {
      setSelectedConsole(null);
    }
  }, [runningConsoles, selectedConsole]);

  useEffect(() => {
    const newNodes = prjStatus.nodes
      .sort(InodeStateSortFunc)
      .filter((n) => n.running);
    setNodes(newNodes);

    window.api.consoleListOpen().then((res) => {
      if (res.status) {
        setRunningConsoles(
          newNodes
            .filter((n) => res.result?.includes(n.name))
            .map((n) => n.name)
        );
        if (res.result.length > 0) {
          const name = res.result[0];
          setSelectedConsole(newNodes.filter((n) => n.name == name)[0].name);
        }
      }
    });
  }, [prjStatus.nodes]);

  const openConsole = (node: INodeState) => {
    if (!runningConsoles.includes(node.name)) {
      setRunningConsoles([...runningConsoles, node.name].sort());
    }
    setSelectedConsole(node.name);
  };

  if (!prjStatus.running)
    return <div className="p-2 italic">Project not running</div>;

  if (selectedConsole == null) {
    return (
      <div className="flex flex-col w-full h-full min-h-0">
        <div className="join join-vertical px-6 py-4">
          {nodes.map((node) => (
            <button
              key={node.name}
              onClick={() => openConsole(node)}
              className="btn btn-outline btn-neutral btn-sm join-item"
            >
              <span>{node.name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full min-h-0">
      <div className="bg-base-200 flex-none flex justify-between align-middle p-2">
        <div className="tabs tabs-bordered">
          {runningConsoles.map((n) => (
            <a
              key={n}
              className={classNames({
                tab: true,
                "tab-active": selectedConsole == n,
              })}
              onClick={() => setSelectedConsole(n)}
            >
              {n}
            </a>
          ))}
        </div>

        <div>
          <div className="dropdown dropdown-bottom dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="m-1 btn btn-outline btn-info btn-sm"
            >
              <PlusIcon className="w-5" />
            </div>
            <ul
              tabIndex={0}
              className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box"
            >
              {nodes
                .filter((n) => !runningConsoles.includes(n.name))
                .map((n) => (
                  <li key={n.name}>
                    <a onClick={() => openConsole(n)}>{n.name}</a>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      <TermPanel nodeName={selectedConsole} onClose={closeConsole} />
    </div>
  );
}
