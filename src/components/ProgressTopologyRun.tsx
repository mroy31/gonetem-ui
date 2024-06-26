
import React, { useEffect, useReducer } from 'react';
import { TopologyRunMsg } from '../proto/netem_pb';
import { ProgressOperation, useAppContext } from '../context';
import { INodeMessages } from './NodeMessagesToast';

interface ITopologyRunState {
    nodeCount: number;
    linkCount: number;
    bridgeCount: number;
    nodeStart: number;
    nodeStop: number;
    nodeRm: number;
    nodeLoadConfig: number;
    linkSetup: number;
    bridgeStart: number;
    nodeMessages: INodeMessages[];
}

const INITIAL_STATE: ITopologyRunState = {
    nodeCount: 0,
    linkCount: 0,
    bridgeCount: 0,
    nodeStart: 0,
    nodeStop: 0,
    nodeRm: 0,
    nodeLoadConfig: 0,
    linkSetup: 0,
    bridgeStart: 0,
    nodeMessages: [],
}

function reducer(state: ITopologyRunState, msg: TopologyRunMsg.AsObject): ITopologyRunState {
    switch(msg.code) {
        case TopologyRunMsg.Code.NODE_COUNT:
            return {
                ...state,
                nodeCount: msg.total,
            }
        case TopologyRunMsg.Code.BRIDGE_COUNT:
            return {
                ...state,
                bridgeCount: msg.total,
            }
        case TopologyRunMsg.Code.LINK_COUNT:
            return {
                ...state,
                linkCount: msg.total,
            }
        case TopologyRunMsg.Code.NODE_START:
            return {
                ...state,
                nodeStart: state.nodeStart+1,
            }
        case TopologyRunMsg.Code.LINK_SETUP:
            return {
                ...state,
                linkSetup: state.linkSetup+1,
            }
        case TopologyRunMsg.Code.BRIDGE_START:
            return {
                ...state,
                bridgeStart: state.bridgeStart+1,
            }
        case TopologyRunMsg.Code.NODE_LOADCONFIG:
            return {
                ...state,
                nodeLoadConfig: state.nodeLoadConfig+1,
            }
        case TopologyRunMsg.Code.NODE_STOP:
            return {
                ...state,
                nodeStop: state.nodeStop+1,
            }
        case TopologyRunMsg.Code.NODE_RM:
            return {
                ...state,
                nodeRm: state.nodeRm+1,
            }
        case TopologyRunMsg.Code.NODE_MESSAGES:
            return {
                ...state,
                nodeMessages: msg.nodemessagesList
            }
        default:
            return state
    }
}

export default function ProgressTopologyRun({
    setNodeMessages,
}: {
    setNodeMessages: (nodeMessages: INodeMessages[]) => void;
}): JSX.Element {
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
    const {currentPrgOperation} = useAppContext();


    useEffect(() => {
        window.api.topologyRunAddListener((msg: TopologyRunMsg.AsObject) => dispatch(msg));

        return () => window.api.topologyRunRemoveAllListeners();
    }, []);

    useEffect(() => setNodeMessages(state.nodeMessages), [state.nodeMessages])

    return (
        <div className="toast toast-middle toast-center">
            { currentPrgOperation == ProgressOperation.TopologyReload && (
                <div className="alert">
                    Project reloading...
                    <progress className="progress progress-info w-56">
                    </progress>
                </div>
            )}

            { state.nodeCount > 0 && state.nodeStart < state.nodeCount && (
                <div className="alert">
                        <span>
                            Node starting... ({state.nodeStart}/{state.nodeCount})
                            <progress 
                                className="progress progress-info w-56" 
                                value={state.nodeStart} max={state.nodeCount}>
                            </progress>
                        </span>
                </div>
            )}

            { state.bridgeCount > 0 && state.bridgeStart < state.bridgeCount && (
                <div className="alert">
                        <span>
                            Bridge starting... ({state.bridgeStart}/{state.bridgeCount})
                            <progress 
                                className="progress progress-info w-56" 
                                value={state.bridgeStart} max={state.bridgeCount}>
                            </progress>
                        </span>
                </div>
            )}

            { state.linkCount > 0 && state.linkSetup < state.linkCount && (
                <div className="alert">
                        <span>
                            Link setup... ({state.linkSetup}/{state.linkCount})
                            <progress 
                                className="progress progress-info w-56" 
                                value={state.linkSetup} max={state.linkCount}>
                            </progress>
                        </span>
                </div>
            )}

            { state.nodeCount > 0 && (
                <div className="alert">
                        <span>
                            Node load config... ({state.nodeLoadConfig}/{state.nodeCount})
                            <progress 
                                className="progress progress-info w-56" 
                                value={state.nodeLoadConfig} max={state.nodeCount}>
                            </progress>
                        </span>
                </div>
            )}
        </div>
    )
}