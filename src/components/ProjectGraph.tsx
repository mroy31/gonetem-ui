import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import YAML from "yaml";
import cytoscape from "cytoscape";
import { Buffer } from 'buffer';
import { INodeState, IProjectState, IfState } from "../api/interface";
import NodeContextMenu, { NodeContextMenuT } from "./NodeContextMenu";
import router from "../../img/router.svg";
import routerRunning from "../../img/router-running.svg";
import host from "../../img/host.svg";
import hostRunning from "../../img/host-running.svg";
import sw from "../../img/switch.svg";
import swRunning from "../../img/switch-running.svg";

interface ITopologyNode {
  type: string;
  ui?: {
    icon?: "host" | "router" | "switch";
    position: cytoscape.Position;
  }
}

interface ITopology {
  nodes: {
    [key: string]: ITopologyNode | null;
  };
  links: {
    peer1: string;
    peer2: string;
  }[] | null;
}

const NODE_SIZE = 50;
const ALL_CLASSES = "icon-router icon-host icon-switch up down inactive";

const cyStyle: cytoscape.StylesheetJson = [
  {
    selector: "node",
    style: {
      shape: "rectangle",
      width: NODE_SIZE,
      height: NODE_SIZE,
      "background-image": "data(image)",
      "background-fit": "contain",
      label: "data(name)",
      "text-halign": "center",
      "text-valign": "bottom",
      "text-margin-y": 4,
      "font-size": 14,
    },
  },
  {
    selector: "node.icon-router",
    style: {
      "background-shape": "circle",
      "background-fit": "cover",
    } as cytoscape.Css.Node,
  },
  {
    selector: "edge",
    style: {
      width: 1,
      "curve-style": "straight",
      "source-label": "data(fromLabel)",
      "target-label": "data(toLabel)",
      "source-text-offset": 25,
      "target-text-offset": 25,
      "font-size": 12,
      color: "#00F",
    },
  },
  {
    selector: "edge:selected",
    style: {
      width: 3,
      "overlay-color": "#0000FF",
      "overlay-opacity": 0.25,
      "overlay-padding": 5,
    },
  },
  { selector: "edge.up", style: { "line-color": "#91bf8f" } },
  { selector: "edge.down", style: { "line-color": "#FF0000" } },
  { selector: "edge.inactive", style: { "line-color": "#696969" } },
];

const getNodeIdFromPeer = (peer: string) => {
  return peer.split(".")[0];
};

const getNodeIdxFromPeer = (peer: string) => {
  return peer.split(".")[1];
};

const getNodeState = (
  nodeName: string,
  state: IProjectState
): INodeState | null => {
  for (const node of state.nodes) {
    if (node.name == nodeName) return node;
  }

  return null;
};

const getNodeIcon = (
  node: ITopologyNode | null
): "router" | "host" | "switch" | null => {
  if (node?.ui?.icon) {
    switch (node.ui.icon) {
      case "router":
      case "host":
      case "switch":
        return node.ui.icon;
      default:
        return null;
    }
  }

  switch (node?.type) {
    case "docker.router":
    case "docker.vyos":
      return "router";
    case "docker.host":
      return "host";
    case "ovs":
      return "switch";
    default:
      return null;
  }
};

const getNodeImage = (
  node: ITopologyNode | null,
  nodeState: INodeState | null
): string | undefined => {
  const running = nodeState?.running;
  switch (getNodeIcon(node)) {
    case "router":
      return (running ? routerRunning : router) as string;
    case "host":
      return (running ? hostRunning : host) as string;
    case "switch":
      return (running ? swRunning : sw) as string;
    default:
      return undefined;
  }
};

const getEdgeClass = (
  peer1: string,
  peer2: string,
  prjState: IProjectState,
) => {
  const isPeerIfUp = (peer: string): boolean => {
    const peerId = peer.split(".");
    const peerState = getNodeState(peerId[0], prjState);
    if (!peerState?.running) return false;

    for (const ifState of peerState.interfaces) {
      if (ifState.name == peerId[1] || ifState.name == `eth${peerId[1]}`)
        return ifState.state == IfState.UP;
    } 

    return false;
  }

  if (prjState.running) {
    if (isPeerIfUp(peer1) && isPeerIfUp(peer2))
      return "up";

    return "down";
  }

  return "inactive";
}

const getElements = (
  topology: ITopology,
  prjState: IProjectState,
): cytoscape.ElementDefinition[] => {
  const elements: cytoscape.ElementDefinition[] = [];

  if (topology.nodes) {
    Object.keys(topology.nodes).forEach((name) => {
      const nodeAttr = topology.nodes[name];
      const icon = getNodeIcon(nodeAttr);
      elements.push({
        group: "nodes",
        data: {
          id: name,
          name,
          image: getNodeImage(nodeAttr, getNodeState(name, prjState)),
        },
        position: nodeAttr?.ui?.position,
        classes: icon ? `icon-${icon}` : "",
      });
    });
  }

  if (topology.links) {
    topology.links.forEach((link) => {
      elements.push({
        group: "edges",
        data: {
          id: `${link.peer1} -- ${link.peer2}`,
          source: getNodeIdFromPeer(link.peer1),
          target: getNodeIdFromPeer(link.peer2),
          fromLabel: getNodeIdxFromPeer(link.peer1),
          toLabel: getNodeIdxFromPeer(link.peer2),
        },
        classes: getEdgeClass(link.peer1, link.peer2, prjState),
      });
    });
  }

  return elements;
};

const updateElements = (cy: cytoscape.Core, elements: cytoscape.ElementDefinition[]) => {
  const ids = new Set(elements.map((el) => el.data?.id as string));

  cy.batch(() => {
    elements.forEach((def) => {
      const existing = cy.getElementById(def.data?.id as string);
      if (existing.nonempty()) {
        existing.data(def.data);
        existing.removeClass(ALL_CLASSES);
        if (def.classes) existing.addClass(def.classes);
      } else {
        cy.add(def);
      }
    });

    cy.elements().forEach((el) => {
      if (!ids.has(el.id())) el.remove();
    });
  });
};


type PropsT = {
  prjStatus: IProjectState;
  topology: string;
  updateState: () => void;
  onSelectEdge: (edge: string) => void;
}

export type ProjectGrahHandle = {
  exportImage: () => Promise<Buffer | null>;
  fit: () => void;
  saveNodePositions: () => Promise<ApiResponse>;
}

export default forwardRef<ProjectGrahHandle, PropsT>(function ProjectGraph({
  prjStatus,
  topology,
  updateState,
  onSelectEdge,
}: PropsT, ref): React.JSX.Element {
  const {t} = useTranslation();
  const [error, setError] = useState("");
  const [contextMenu, setContextMenu] = useState<NodeContextMenuT>({
    prjId: prjStatus.id,
    nodeId: "",
    x: 0,
    y: 0,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);

  useImperativeHandle(ref, () => {
    return {
      exportImage: (): Promise<Buffer | null> => {
        return new Promise<Buffer | null>((resolve) => {
          const cy = cyRef.current;
          if (cy == null || cy.destroyed()) {
            resolve(null);
            return;
          }

          const blob = cy.png({ output: "blob" });
          if (blob instanceof Blob) {
            blob.arrayBuffer().then((aBuf) => resolve(Buffer.from(aBuf)));
            return;
          }
          resolve(null);
        });
      },
      fit: () => {
        const cy = cyRef.current;
        if (cy != null && !cy.destroyed()) {
          cy.fit();
        }
      },
      saveNodePositions: (): Promise<ApiResponse> => {
        const cy = cyRef.current;
        if (cy == null || cy.destroyed())
          return Promise.resolve({
            status: false,
            error: "Topology graph is not ready",
          });

        const positions: { [id: string]: cytoscape.Position } = {};
        cy.nodes().forEach((n) => {
          positions[n.id()] = n.position();
        });
        const topo = YAML.parse(topology) as ITopology;

        const nodes: {[key: string]: ITopologyNode | null;}  = {}
        Object.keys(topo.nodes).forEach((nId) => {
          const nodeAttr = topo.nodes[nId];
          nodes[nId] = nodeAttr == null
            ? null
            : {
                ...nodeAttr,
                ui: {
                  ...nodeAttr.ui,
                  position: positions[nId]
                }
              };
        });
        topo.nodes = nodes;

        return window.api.writeTopologyFile(prjStatus.id, YAML.stringify(topo))
      }
    }
  });

  useEffect(() => {
    if (!containerRef.current) return;
    if (!prjStatus.id) return;

    try {
      const topo = YAML.parse(topology) as ITopology;
      const cy = cyRef.current;

      if (cy == null || cy.destroyed()) {
        const net = cytoscape({
          container: containerRef.current,
          style: cyStyle,
          elements: getElements(topo, prjStatus),
          layout: { name: "preset" },
          wheelSensitivity: 0.2,
        });

        net.on(
          "cxttap",
          "node",
          (evt: cytoscape.EventObject) => {
            const nodeId = evt.target.id();
            if (nodeId) {
              setContextMenu({
                prjId: prjStatus.id,
                nodeId,
                x: evt.renderedPosition.x,
                y: evt.renderedPosition.y,
              });
            }
          }
        );
        net.on("tap", () => setContextMenu({ ...contextMenu, nodeId: "", x: 0, y: 0 }));
        net.on("select", "edge", (evt: cytoscape.EventObject) => {
          onSelectEdge(evt.target.id())
        });
        net.on("unselect", "edge", (evt: cytoscape.EventObject) => {
          onSelectEdge(evt.target.id())
        });

        cyRef.current = net;
      } else {
        updateElements(cy, getElements(topo, prjStatus));
      }
    } catch (err) {
      setError(t("ProjectGraphErrMsg", {error: err}));
      return;
    }
  }, [prjStatus, topology]);

  useEffect(() => {
    return () => {
      if (cyRef.current != null && !cyRef.current.destroyed()) {
        cyRef.current.destroy();
      }
      cyRef.current = null;
    };
  }, []);

  const getNodeState = (nodeId: string): INodeState | null => {
    for (const nState of prjStatus.nodes) {
      if (nState.name == nodeId) return nState;
    }
    return null;
  };

  const handleHideContextMenu = (update: boolean) => {
    if (update) updateState();
    setContextMenu({ ...contextMenu, nodeId: "", x: 0, y: 0 });
  };

  if (error)
    return (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    );

  return (
    <>
      <div
        ref={containerRef}
        data-theme="light"
        className="w-full h-full min-h-0"
      />
      {prjStatus.running && contextMenu.nodeId != "" && (
        <NodeContextMenu
          contextMenu={contextMenu}
          state={getNodeState(contextMenu.nodeId)}
          onHide={handleHideContextMenu}
        />
      )}
    </>
  );
});
