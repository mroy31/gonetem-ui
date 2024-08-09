import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import YAML from "yaml";
import { Network, type Node, type Edge, Position } from "vis-network";
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
    position: Position;
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

const getNodeIdFromPeer = (peer: string) => {
  return peer.split(".")[0];
};

const getNodeIdxFromPeer = (peer: string) => {
  return peer.split(".")[1];
};

const getNodeState = (nodeName: string, state: IProjectState): INodeState => {
  for (const node of state.nodes) {
    if (node.name == nodeName) return node;
  }

  return null;
};

const getNodeShape = (nodeType: string, nodeState: INodeState) => {
  switch (nodeType) {
    case "docker.router":
      return {
        shape: "circularImage",
        image: nodeState?.running ? routerRunning : router,
      };
    case "docker.host":
      return {
        shape: "image",
        image: nodeState?.running ? hostRunning : host,
      };
    case "ovs":
      return {
        shape: "image",
        image: nodeState?.running ? swRunning : sw,
      };
    default:
      return {
        shape: "square",
      };
  }
};

const getNodePosition = (
  topology: ITopology,
  nodeName: string,
  network: Network,
) => {
  if (network == null)
    return topology.nodes[nodeName].ui?.position || {};

  try {
    return network.getPosition(nodeName);
  } catch (err) {
    // node is just created and has no defined position
    return topology.nodes[nodeName].ui?.position || {};
  }
}

const getEdgeColor = (
  peer1: string,
  peer2: string,
  prjState: IProjectState,
) => {
  const isPeerIfUp = (peer: string): boolean => {
    const peerId = peer.split(".");
    const peerState = getNodeState(peerId[0], prjState);
    if (!peerState.running) return false;

    for (const ifState of peerState.interfaces) {
      if (ifState.name == peerId[1] || ifState.name == `eth${peerId[1]}`)
        return ifState.state == IfState.UP;
    } 

    return false;
  }

  if (prjState.running) {
    if (isPeerIfUp(peer1) && isPeerIfUp(peer2))
      return {
        color: {
          color: "#91bf8f",
          highlight: "#91bf8f",
          hover: "#91bf8f",
        }
      }
    
    return {
      color: {
        color: "#FF0000",
        highlight: "#FF0000",
        hover: "##FF0000",
      }
    }
  }

  return {
    color: {
      color: "#696969",
      highlight: "#696969",
      hover: "#696969",
    }
  }
}

const getNodesAndEdges = (
  topology: ITopology,
  prjState: IProjectState,
  network: Network,
): [Node[], Edge[]] => {
  const nodes: Node[] = topology.nodes ? Object.keys(topology.nodes).map((name) => {
    const nodeAttr = topology.nodes[name];
    return {
      id: name,
      label: name,
      fixed: false,
      ...getNodeShape(nodeAttr.type, getNodeState(name, prjState)),
      ...getNodePosition(topology, name, network),
    };
  }) : [];

  const edges: Edge[] = topology.links ? topology.links.map((link) => {
    return {
      id: `${link.peer1} -- ${link.peer2}`,
      from: getNodeIdFromPeer(link.peer1),
      to: getNodeIdFromPeer(link.peer2),
      labelFrom: getNodeIdxFromPeer(link.peer1),
      labelTo: getNodeIdxFromPeer(link.peer1),
      smooth: false,
      ...getEdgeColor(link.peer1, link.peer2, prjState),
      font: {
        size: 12,
        color: "#00F",
        align: "top",
      }
    };
  }) : [];
  return [nodes, edges];
};


type PropsT = {
  prjStatus: IProjectState;
  topology: string;
  updateState: () => void;
  onSelectEdge: (edge: string) => void;
}

export type ProjectGrahHandle = {
  exportImage: () => Promise<Buffer>;
  fit: () => void;
  saveNodePositions: () => Promise<ApiResponse>;
}

export default forwardRef<ProjectGrahHandle, PropsT>(function ProjectGraph({
  prjStatus,
  topology,
  updateState,
  onSelectEdge,
}: PropsT, ref): JSX.Element {
  const [error, setError] = useState("");
  const [network, setNetwork] = useState<Network>(null);
  const [contextMenu, setContextMenu] = useState<NodeContextMenuT>({
    prjId: prjStatus.id,
    nodeId: "",
    x: 0,
    y: 0,
  });
  const visJsRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => {
    return {
      exportImage: (): Promise<Buffer> => {
        return new Promise<Buffer>((resolve) => {
          if (visJsRef.current == null || network == null) {
            resolve(null);
            return;
          }

          const canvas = visJsRef.current.getElementsByTagName("canvas").item(0) as HTMLCanvasElement;
          canvas.toBlob((blob) => {
            blob.arrayBuffer().then((aBuf) => resolve(Buffer.from(aBuf)));
          });
        });
      },
      fit: () => {
        if (network != null) {
          network.fit();
        }
      },
      saveNodePositions: (): Promise<ApiResponse> => {
        if (network == null) return;

        const positions = network.getPositions();
        const topo = YAML.parse(topology) as ITopology;

        const nodes: {[key: string]: ITopologyNode | null;}  = {}
        Object.keys(topo.nodes).forEach((nId) => {
          nodes[nId] = {
            ...topo.nodes[nId],
            ui: {
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
    if (!visJsRef.current) return;
    if (!prjStatus.id) return;

    try {
      const topo = YAML.parse(topology) as ITopology;
      const [nodes, edges] = getNodesAndEdges(topo, prjStatus, network);

      if (network == null) {
        const net = new Network(
          visJsRef.current,
          { nodes, edges },
          {
            physics: false,
            interaction: {
              dragView: true,
              zoomView: true,
            },
          }
        );
        net.on(
          "oncontext",
          (evt: {
            pointer: {
              canvas: { x: number; y: number };
              DOM: { x: number; y: number };
            };
          }) => {
            const nodeId = net.getNodeAt({
              x: evt.pointer.DOM.x,
              y: evt.pointer.DOM.y,
            });
            if (nodeId) {
              setContextMenu({
                ...contextMenu,
                nodeId: nodeId as string,
                x: evt.pointer.DOM.x,
                y: evt.pointer.DOM.y,
              });
            }
          }
        );
        net.on("click", () => setContextMenu({ ...contextMenu, nodeId: "", x: 0, y: 0 }));
        net.on('selectEdge', (obj) => {
          onSelectEdge(obj.edges.join(" || "))  
        });
        net.on('deselectEdge', (obj) => {
          onSelectEdge(obj.edges.join(" || "))  
        });
        net.on('controlNodeDragEnd', () => {
          net.storePositions();
        });

        setNetwork(net);
      } else {
        network.setData({ nodes, edges });
      }
    } catch (err) {
      setError(`Unable to create network graph: ${err}`);
      return;
    }
  }, [visJsRef, prjStatus, topology]);

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
        ref={visJsRef}
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
