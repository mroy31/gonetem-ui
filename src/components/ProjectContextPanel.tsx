import classNames from "classnames";
import React, { useState, useEffect, useRef } from "react";
import TopologyEditorPanel from "./TopologyEditorPanel";
import ConfigurationViewerPanel from "./ConfigurationViewerPanel";
import { IProjectState } from "../api/interface";
import { IPrjAction } from "./ProjectPanel";
import ConsolePanel from "./ConsolePanel";

export default function ProjectContextPanel({
  prjStatus,
  topology,
  dispatch,
}: {
  prjStatus: IProjectState;
  topology: string;
  dispatch: React.Dispatch<IPrjAction>;
}): JSX.Element {
  const [width, setWidth] = useState(350);
  const [selectedTab, setSelectedTab] = useState<"topo" | "config" | "console">("config");
  const isResized = useRef(false);

  const tabClasses = (tabId: string) => {
    return classNames({
      tab: true,
      "tab-active": selectedTab == tabId,
    });
  };

  useEffect(() => {
    window.addEventListener("mousemove", (e) => {
      if (!isResized.current) return;
      setWidth((previousWidth) => previousWidth - e.movementX);
    });

    window.addEventListener("mouseup", () => {
      isResized.current = false;
    });
  }, []);

  return (
    <div className="flex min-h-0">
      {/* Handle */}
      <div
        className="w-2 cursor-col-resize bg-base-300"
        onMouseDown={() => {
          isResized.current = true;
        }}
      />

      <div
        className="flex flex-col h-full min-h-0"
        style={{ width: `${width / 16}rem` }}
      >
        <div role="tablist flex-none" className="tabs tabs-bordered">
          <a
            role="tab"
            className={tabClasses("config")}
            onClick={() => setSelectedTab("config")}
          >
            Configuration
          </a>
          <a
            role="tab"
            className={tabClasses("console")}
            onClick={() => setSelectedTab("console")}
          >
            Console
          </a>
          <a
            role="tab"
            className={tabClasses("topo")}
            onClick={() => setSelectedTab("topo")}
          >
            Topology
          </a>
        </div>

        <div className="flex-1 w-full mt-1 min-h-0">
          {selectedTab == "config" && (
            <ConfigurationViewerPanel prjStatus={prjStatus} />
          )}
          {selectedTab == "console" && (
            <ConsolePanel prjStatus={prjStatus} />
          )}
          {selectedTab == "topo" && (
            <TopologyEditorPanel
              topology={topology}
              prjId={prjStatus.id}
              dispatch={dispatch}
            />
          )}
        </div>
      </div>
    </div>
  );
}
