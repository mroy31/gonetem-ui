
import React, { useEffect, useCallback, useReducer, useRef } from 'react';
import ProjectContextPanel from './ProjectContextPanel';
import ProjectToolbar from './ProjectToolbar';
import { IProjectState } from '../api/interface';
import ProjectGraph, {ProjectGrahHandle} from './ProjectGraph';
import ProjectContextBar from './ProjectContextBar';
import { useAppContext } from '../context';

export enum PrjActionKing {
    INIT = 'INIT',
    STATE = 'STATE',
    TOPOLOGY = 'TOPOLOGY',
    ERROR = 'ERROR',
    SELECT_EDGE = 'SELECT_EDGE',
}

export interface IPrjAction {
    type: PrjActionKing;
    error?: string;
    state?: IProjectState;
    topology?: string;
    edge?: string;
}

interface IPrjState {
    error: string;
    loading: boolean;
    status: IProjectState;
    topology: string;
    selectedEdge: string;
}

function reducer(state: IPrjState, action: IPrjAction): IPrjState {
    switch (action.type) {
        case PrjActionKing.INIT:
            return {
                ...state,
                error: "",
                loading: false,
                status: action.state,
                topology: action.topology,
            };
        case PrjActionKing.STATE:
            return {
                ...state,
                error: "",
                status: action.state,
            };
        case PrjActionKing.TOPOLOGY:
            return {
                ...state,
                error: "",
                topology: action.topology,
            };
        case PrjActionKing.ERROR:
            return {
                ...state,
                error: action.error as string,
                loading: false,
            };
        case PrjActionKing.SELECT_EDGE:
            return {
                ...state,
                selectedEdge: action.edge,
            }
        default:
            return state;
    }
}

export default function ProjectPanel({
    prjId,
    onClose,
}: {
    prjId: string;
    onClose: () => void;
}): JSX.Element {
    const { setError } = useAppContext();
    const graphRef = useRef<ProjectGrahHandle>(null);
    const [state, dispatch] = useReducer(reducer, {
        error: "",
        loading: true,
        status: null,
        topology: "",
        selectedEdge: "",
    });

    const updateState = useCallback(() => {
        window.api.getProjectState(prjId).then((res) => {
            res.status
                ? dispatch({type: PrjActionKing.STATE, state: res.result})
                : dispatch({type: PrjActionKing.ERROR, error: res.error});
        });
    }, [prjId]);

    const dwImgHandle = useCallback(() => {
        if (graphRef.current == null) return;

        graphRef.current.exportImage().then((data) => {
            window.api.recordTopologyImg(data).then((res) => {
                if (res.error) setError(res.error);
            });
        });
    }, [graphRef]);

    useEffect(() => {
        if (prjId == "") return;
        const init = async (): Promise<IPrjAction> => {
            try {
                const state = await window.api.getProjectState(prjId);
                const topology = await window.api.readTopologyFile(prjId);

                if (!state.status) return {type: PrjActionKing.ERROR, error: state.error};
                if (!topology.status) return {type: PrjActionKing.ERROR, error: topology.error};

                return {
                    type: PrjActionKing.INIT,
                    state: state.result,
                    topology: topology.result,
                }
            } catch (err) {
                return {
                    type: PrjActionKing.ERROR,
                    error: `Unable to init panel ${err.message}`}
            }
        };

        init().then((action) => dispatch(action));
    }, [prjId]);

    if (state.loading) {
        return (
        <div className="flex-1 h-full bg-base-100 flex align-middle justify-center">
            <span className="loading loading-bars loading-lg"></span>
        </div>
        );
    }

    return (
    <>
        {state.error ? (
            <div className="flex-1 bg-base-100 flex align-middle justify-center">
                <div className="alert alert-error flex gap-2">
                    <span>{state.error}</span>
                </div>
            </div>
        ) : (
            <div className="flex-1 grid grid-cols-[auto_min-content] bg-base-100 min-h-0">
                <div className='flex flex-col h-full min-h-0'>
                    <ProjectToolbar 
                        prjStatus={state.status}
                        onClose={onClose}
                        dispatch={dispatch}
                    />

                    <div className='flex-1 min-h-0 overflow-scroll'>
                        <ProjectGraph 
                            ref={graphRef}
                            updateState={updateState}
                            prjStatus={state.status}
                            topology={state.topology}
                            onSelectEdge={(edge: string) => dispatch({
                                type: PrjActionKing.SELECT_EDGE,
                                edge: edge, 
                            })}
                        />
                    </div>

                    <ProjectContextBar
                        dwImgHandle={dwImgHandle}
                        fitHandle={() => graphRef.current?.fit()}
                        prjStatus={state.status}
                        selectedEdge={state.selectedEdge}
                    />                    
                </div>

                <ProjectContextPanel 
                    dispatch={dispatch}
                    prjStatus={state.status}
                    topology={state.topology}/>
            </div>
        )}
    </>
    )    
}