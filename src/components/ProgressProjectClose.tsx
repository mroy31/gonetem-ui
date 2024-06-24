
import React, { useEffect, useReducer } from 'react';
import { ProjectCloseMsg } from '../proto/netem_pb';

interface IProjectCloseState {
    nodeCount: number;
    bridgeCount: number;
    nodeClose: number;
    bridgeClose: number;
}

const INITIAL_STATE: IProjectCloseState = {
    nodeCount: 0,
    bridgeCount: 0,
    nodeClose: 0,
    bridgeClose: 0,
}

function reducer(state: IProjectCloseState, msg: ProjectCloseMsg.AsObject): IProjectCloseState {
    switch(msg.code) {
        case ProjectCloseMsg.Code.NODE_COUNT:
            return {
                ...state,
                nodeCount: msg.total,
            }
        case ProjectCloseMsg.Code.BRIDGE_COUNT:
            return {
                ...state,
                bridgeCount: msg.total,
            }
        case ProjectCloseMsg.Code.NODE_CLOSE:
            return {
                ...state,
                nodeClose: state.nodeClose+1,
            }
        case ProjectCloseMsg.Code.BRIDGE_CLOSE:
            return {
                ...state,
                bridgeClose: state.bridgeClose+1,
            }
    }
}

export default function ProgressProjectClose(): JSX.Element {
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);


    useEffect(() => {
        window.api.projectCloseAddListener((msg: ProjectCloseMsg.AsObject) => dispatch(msg));

        return () => window.api.projectCloseRemoveAllListeners();
    }, []);

    return (
        <div className="toast toast-middle toast-center">
            <div className="alert">
                <span>
                    Project closing...
                    <progress className="progress progress-info w-56">
                    </progress>
                </span>
            </div>
            { state.nodeCount > 0 && state.nodeClose < state.nodeCount && (
                <div className="alert">
                        <span>
                            Close nodes... ({state.nodeClose}/{state.nodeCount})
                            <progress 
                                className="progress progress-info w-56" 
                                value={state.nodeClose} max={state.nodeCount}>
                            </progress>
                        </span>
                </div>
            )}

            { state.bridgeCount > 0 && state.bridgeClose < state.bridgeCount && (
                <div className="alert">
                        <span>
                            Close bridges... ({state.bridgeClose}/{state.bridgeCount})
                            <progress 
                                className="progress progress-info w-56" 
                                value={state.bridgeClose} max={state.bridgeCount}>
                            </progress>
                        </span>
                </div>
            )}
        </div>
    )
}