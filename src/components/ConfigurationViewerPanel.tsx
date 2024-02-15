import React, { useCallback, useEffect, useReducer, useState } from "react";
import YAML from "yaml";
import { INodeState, IProjectState } from "../api/interface";

type ConfigFileT = {
  name: string;
  data: string;
};

enum ActionKing {
  UPDATE_NODE_STATES = "UPDATE_NODE_STATES",
  UPDATE_NODE = "UPDATE_NODE",
  UPDATE_NODE_FILES = "UPDATE_NODE_FILES",
  UPDATE_SELECTED = "UPDATE_SELECTED",
  ERROR = "ERROR",
}

interface IAction {
  type: ActionKing;
  nodes?: INodeState[];
  error?: string;
  node?: string;
  selected?: string;
  files?: ConfigFileT[];
}

interface IState {
  error: string;
  loading: boolean;
  nodes: INodeState[];
  node: string;
  selected: string;
  files: ConfigFileT[];
}

const getDefaultSelected = (files: ConfigFileT[]): string => {
  if (files.length > 0) {
    for (const f of files) {
      if (f.name == "Network") return "Network";
    }
    return files[0].name;
  }
  return "";
};

function reducer(state: IState, action: IAction): IState {
  switch (action.type) {
    case ActionKing.ERROR:
      return {
        ...state,
        error: action.error as string,
        loading: false,
      };
    case ActionKing.UPDATE_NODE_STATES:
      return {
        ...state,
        error: "",
        loading: action.node != state.node,
        nodes: action.nodes,
        node: action.node,
      };
    case ActionKing.UPDATE_NODE:
      return {
        ...state,
        error: "",
        loading: action.node != state.node,
        node: action.node,
      };
    case ActionKing.UPDATE_NODE_FILES:
      const selected = getDefaultSelected(action.files);
      return {
        ...state,
        error: "",
        loading: false,
        files: action.files,
        selected,
      };
    case ActionKing.UPDATE_SELECTED:
      return {
        ...state,
        selected: action.selected,
      };
  }
}

const parseNetworkFile = (network: string): string => {
  return YAML.stringify(JSON.parse(network), {});
};

export default function ConfigurationViewerPanel({
  prjStatus,
}: {
  prjStatus: IProjectState;
}): JSX.Element {
  const [state, dispatch] = useReducer(reducer, {
    error: "",
    loading: true,
    nodes: [],
    node: "",
    files: [],
    selected: "",
  });

  useEffect(() => {
    const newNodes = prjStatus.nodes.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
    const selectedNode = newNodes.length > 0 ? newNodes[0].name : "";
    dispatch({
      type: ActionKing.UPDATE_NODE_STATES,
      nodes: newNodes,
      node: selectedNode,
    });
  }, [prjStatus.nodes]);

  useEffect(() => {
    if (state.node == "") return;

    window.api.readNodeConfigFiles(prjStatus.id, state.node).then((res) => {
      res.status
        ? dispatch({
            type: ActionKing.UPDATE_NODE_FILES,
            files: res.result.files,
          })
        : dispatch({ type: ActionKing.ERROR, error: res.error });
    });
  }, [state.node, prjStatus.id]);

  const getConfigData = useCallback((): string => {
    if (state.node != "" && state.loading) return "Loading...";

    if (state.selected != "") {
      for (const f of state.files) {
        if (f.name == state.selected) {
          if (f.data == "") return "Config file empty";
          if (f.name == "Network") return parseNetworkFile(f.data);
          return f.data;
        }
      }
    }
    return "No config file";
  }, [state]);

  const handleNodeChange = (nodeId: string) =>
    dispatch({ type: ActionKing.UPDATE_NODE, node: nodeId });

  const handleSelectedChange = (fileName: string) => {
    dispatch({ type: ActionKing.UPDATE_SELECTED, selected: fileName });
  };

  return (
    <div className="flex flex-col w-full h-full min-h-0">
      <div className="bg-base-200 flex-none flex justify-between align-middle p-2">
        <div>
          <select
            className="select select-bordered select-secondary select-sm"
            value={state.node}
            onChange={(e) => handleNodeChange(e.target.value)}
          >
            {state.nodes.map((node) => (
              <option key={node.name} value={node.name}>
                {node.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            className="select select-bordered select-sm"
            value={state.selected}
            onChange={(e) => handleSelectedChange(e.target.value)}
          >
            {state.files.map((f) => (
              <option key={f.name} value={f.name}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-scroll">
        {state.error ? (
          <div className="alert alert-error flex gap-2">
            <span>{state.error}</span>
          </div>
        ) : (
          <textarea
            className="textarea w-full h-full"
            value={getConfigData()}
            readOnly
          />
        )}
      </div>
    </div>
  );
}
