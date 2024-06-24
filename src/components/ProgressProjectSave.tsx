
import React, { useEffect, useReducer } from 'react';
import { ProjectSaveMsg } from '../proto/netem_pb';

interface IProjectSaveState {
    nodeCount: number;
    nodeSave: number;
}

const INITIAL_STATE: IProjectSaveState = {
    nodeCount: 0,
    nodeSave: 0,
}

function reducer(state: IProjectSaveState, msg: ProjectSaveMsg.AsObject): IProjectSaveState {
    switch(msg.code) {
        case ProjectSaveMsg.Code.NODE_COUNT:
            return {
                ...state,
                nodeCount: msg.total,
            }
        case ProjectSaveMsg.Code.NODE_SAVE:
            return {
                ...state,
                nodeSave: state.nodeSave+1,
            }
    }
}

export default function ProgressProjectSave(): JSX.Element {
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);


    useEffect(() => {
        window.api.projectSaveAddListener((msg: ProjectSaveMsg.AsObject) => dispatch(msg));

        return () => window.api.projectSaveRemoveAllListeners();
    }, []);

    return (
        <div className="toast toast-middle toast-center">
            { state.nodeCount > 0 && state.nodeSave < state.nodeCount && (
                <div className="alert">
                        <span>
                            Save nodes... ({state.nodeSave}/{state.nodeCount})
                            <progress 
                                className="progress progress-info w-56" 
                                value={state.nodeSave} max={state.nodeCount}>
                            </progress>
                        </span>
                </div>
            )}
        </div>
    )
}