import React, { useEffect, useRef, useState } from "react";
import YAML from "yaml";
import { Network, type Node, type Edge } from "vis-network";
import { INodeState, IProjectState } from "../api/project";
import router from "../../img/router.svg";
import routerRunning from "../../img/router-running.svg";
import host from "../../img/host.svg";
import hostRunning from "../../img/host-running.svg";
import sw from "../../img/switch.svg";
import swRunning from "../../img/switch-running.svg";

interface ITopology {
  nodes: {
    [key: string]: {
      type: string;
    };
  };
  links: {
    peer1: string;
    peer2: string;
  }[];
}

const getNodeIdFromPeer = (peer: string) => {
  return peer.split(".")[0];
};

const getNodeState = (nodeName: string, state: IProjectState): INodeState => {
  for (const node of state.nodes) {
    if (node.name == nodeName) return node;
  }

  return null;
}

const getNodeShape = (nodeType: string, nodeState: INodeState) => {
  switch (nodeType) {
    case "docker.router":
      return {
        shape: "image",
        image: nodeState?.running ? routerRunning : router
      };
    case "docker.host":
      return {
        shape: "image",
        image: nodeState?.running ? hostRunning : host
      };
    case "ovs":
      return {
        shape: "image",
        image: nodeState?.running ? swRunning : sw
      };
    default:
      return {
        shape: "square",
      };
  }
};

const getNodesAndEdges = (topology: ITopology, prjState: IProjectState): [Node[], Edge[]] => {
  const nodes: Node[] = Object.keys(topology.nodes).map((name) => {
    const nodeAttr = topology.nodes[name];
    return {
      id: name,
      label: name,
      ...getNodeShape(nodeAttr.type, getNodeState(name, prjState)),
    };
  });

  const edges: Edge[] = topology.links.map((link) => {
    return {
      from: getNodeIdFromPeer(link.peer1),
      to: getNodeIdFromPeer(link.peer2),
      smooth: false,
    };
  });
  return [nodes, edges];
};

export default function ProjectGraph({
  prjStatus,
  topology,
}: {
  prjStatus: IProjectState;
  topology: string;
}): JSX.Element {
  const [error, setError] = useState("");
  const [network, setNetwork] = useState<Network>(null);
  const visJsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visJsRef.current) return;
    if (!prjStatus.id) return;

    try {
      const topo = YAML.parse(topology) as ITopology;
      const [nodes, edges] = getNodesAndEdges(topo, prjStatus);

      if (network == null) {
        setNetwork(new Network(
          visJsRef.current,
          { nodes, edges },
          {
            physics: false,
            interaction: {
              dragView: true,
              zoomView: true,
            },
          }
        ));
      } else {
        network.setData({nodes, edges});
      }
    } catch (err) {
      setError(`Unable to parse topology file: ${err}`);
      return;
    }
  }, [visJsRef, prjStatus, topology]);

  if (error)
    return (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    );

  return <div ref={visJsRef} data-theme="light" className="w-full h-full min-h-0" />;
}
