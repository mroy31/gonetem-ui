import React, { useEffect, useRef, useState } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { SerializeAddon } from "xterm-addon-serialize";
import { INodeState, IProjectState } from "../api/interface";
import "xterm/css/xterm.css";

const TermPanel = ({
  node,
  onClose,
}: {
  node: INodeState;
  onClose: () => void;
}): JSX.Element => {
  const term = useRef(new Terminal());
  const fitAddon = useRef(new FitAddon());
  const serializeAddon = useRef(new SerializeAddon());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.api.consoleAddListener(node.name, (msgType: string, data: string) => {
      switch (msgType) {
        case "stderr":
        case "stdout":
          term.current.write(data, () => {
            window.api.consoleSaveState(node.name, serializeAddon.current.serialize()).then((res) => {
              if (!res.status)
                console.log(`ERROR: unable to save console state for node ${node.name}`);
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

    return () => window.api.consoleRemoveListeners(node.name);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((_entries) => {
        fitAddon.current.fit();
      });

      window.api.consoleRun(node.name).then((res) => {
        if (!res.status) {
          console.log(res.error);
          return;
        }

        term.current.loadAddon(fitAddon.current);
        term.current.loadAddon(serializeAddon.current);
        term.current.onData((data: string) => {
          window.api.consoleWrite(node.name, data).then((res) => {
            if (!res.status) console.log(res.error);
          });
        });
        term.current.onResize((size) => {
          window.api.consoleResize(node.name, size.cols, size.rows).then((res) => {
            if (!res.status) console.log(res.error);
          });
        });

        if (res.result != "")
          term.current.write(res.result);
        term.current.open(containerRef.current);
        fitAddon.current.fit();

        resizeObserver.observe(containerRef.current);
      });

      return () => resizeObserver.disconnect();
    }
  }, [containerRef]);

  return <div className="flex-1 min-h-0" ref={containerRef}></div>;
};

export default function ConsolePanel({
  prjStatus,
}: {
  prjStatus: IProjectState;
}): JSX.Element {
  const [nodes, setNodes] = useState<INodeState[]>([]);
  const [selected, setSelected] = useState<INodeState>(null);

  useEffect(() => {
    const newNodes = prjStatus.nodes
      .sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      })
      .filter((n) => n.running);
    setNodes(newNodes);

    window.api.consoleListOpen().then((res) => {
      if (res.status) {
        if (res.result.length > 0) {
          const name = res.result[0];
          setSelected(newNodes.filter((n) => n.name == name)[0]);
        }
      }
    });
  }, [prjStatus.nodes]);

  if (!prjStatus.running) return <div className="p-2 italic">Project not running</div>;

  if (selected == null) {
    return (
      <div className="flex flex-col w-full h-full min-h-0">
        <div className="join join-vertical px-6 py-4">
          {nodes.map((node) => (
            <button
              key={node.name}
              onClick={() => setSelected(node)}
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
        {selected.name}
      </div>

      <TermPanel
        node={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
