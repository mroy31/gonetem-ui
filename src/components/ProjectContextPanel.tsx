import classNames from "classnames";
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import TopologyEditorPanel from "./TopologyEditorPanel";
import ConfigurationViewerPanel from "./ConfigurationViewerPanel";
import { IProjectState } from "../api/interface";
import { IPrjAction } from "./ProjectPanel";
import ConsolePanel from "./ConsolePanel";
import { features } from "../edition";

const MIN_PANEL_WIDTH = 250;
const MIN_GRAPH_WIDTH = 300;

export default function ProjectContextPanel({
  prjStatus,
  topology,
  dispatch,
}: {
  prjStatus: IProjectState;
  topology: string;
  dispatch: React.Dispatch<IPrjAction>;
}): React.JSX.Element {
  const {t} = useTranslation();
  const [width, setWidth] = useState(450);
  const [selectedTab, setSelectedTab] = useState<"topo" | "config" | "console">(
    features.nodeConfigRead ? "config" : "console"
  );
  const isResized = useRef(false);

  const tabClasses = (tabId: string) => {
    return classNames({
      tab: true,
      "tab-active": selectedTab == tabId,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResized.current) return;
      setWidth((previousWidth) => {
        const next = previousWidth - e.movementX;
        const max = window.innerWidth - MIN_GRAPH_WIDTH;
        return Math.max(MIN_PANEL_WIDTH, Math.min(next, max));
      });
    };

    const handleMouseUp = () => {
      isResized.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
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
        <div role="tablist flex-none" className="tabs tabs-border">
          {features.nodeConfigRead && (
            <a
              role="tab"
              className={tabClasses("config")}
              onClick={() => setSelectedTab("config")}
            >
              {t("Configuration")}
            </a>
          )}
          {features.topologyWrite && (
            <a
              role="tab"
              className={tabClasses("topo")}
              onClick={() => setSelectedTab("topo")}
            >
              {t("Topology")}
            </a>
          )}
          <a
            role="tab"
            className={tabClasses("console")}
            onClick={() => setSelectedTab("console")}
          >
            {t("Console")}
          </a>
        </div>

        <div className="flex-1 w-full mt-1 min-h-0">
          {features.nodeConfigRead && selectedTab == "config" && (
            <ConfigurationViewerPanel prjStatus={prjStatus} />
          )}
          {features.topologyWrite && selectedTab == "topo" && (
            <TopologyEditorPanel
              topology={topology}
              prjId={prjStatus.id}
              dispatch={dispatch}
            />
          )}
          {selectedTab == "console" && (
            <ConsolePanel prjStatus={prjStatus} />
          )}
        </div>
      </div>
    </div>
  );
}
