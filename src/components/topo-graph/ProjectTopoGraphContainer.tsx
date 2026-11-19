import React, { useCallback, useRef, useState } from "react";
import ProjectTopoGraph, { ProjectTopoGrahHandle } from "./ProjectTopoGraph";
import ProjectTopoGraphToolbar from "./ProjectTopoGraphToolbar";
import { features } from "../../edition";
import { IProjectState } from "../../api/interface";
import { IPrjAction, PrjActionKing } from "../project/ProjectPanel";
import { useAppContext } from "../../context";
import { useTranslation } from "react-i18next";

export default function ProjectTopoGraphContainer({
  prjId,
  status,
  topology,
  dispatch,
  updateState,
}: {
  prjId: string;
  status: IProjectState;
  topology: string;
  dispatch: React.ActionDispatch<[action: IPrjAction]>;
  updateState: () => void;
}): React.JSX.Element {
  const { t } = useTranslation();
  const { setError, setInfoMsg } = useAppContext();
  const [selectedEdge, setSelectedEdge] = useState("");
  const graphRef = useRef<ProjectTopoGrahHandle>(null);

  const dwImgHandle = useCallback(() => {
    if (graphRef.current == null) return;

    graphRef.current.exportImage().then((data) => {
      if (data == null) return;
      window.api.recordTopologyImg(data).then((res) => {
        if (!res.status) setError(res.error);
      });
    });
  }, [graphRef]);

  const saveTopologyHandle = useCallback(() => {
    if (prjId == "") return;
    if (graphRef.current == null) return;

    graphRef.current.saveNodePositions().then((res) => {
      if (!res.status) {
        dispatch({ type: PrjActionKing.ERROR, error: res.error });
        return;
      }

      window.api.readTopologyFile(prjId).then((res) => {
        if (!res.status) {
          dispatch({ type: PrjActionKing.ERROR, error: res.error });
          return;
        }

        dispatch({ type: PrjActionKing.TOPOLOGY, topology: res.result });
        setInfoMsg(t("TopoPositionSavedMsg"));
      });
    });
  }, [graphRef, prjId]);

  return (
    <div className="flex flex-col flex-1 min-w-0">
      <ProjectTopoGraph
        ref={graphRef}
        updateState={updateState}
        prjStatus={status}
        topology={topology}
        onSelectEdge={setSelectedEdge}
      />

      <ProjectTopoGraphToolbar
        saveTopologyHandle={
          features.topologyWrite ? saveTopologyHandle : undefined
        }
        dwImgHandle={dwImgHandle}
        fitHandle={() => graphRef.current?.fit()}
        layoutHandle={(kind) => graphRef.current?.applyLayout(kind)}
        selectedEdge={selectedEdge}
      />
    </div>
  );
}
