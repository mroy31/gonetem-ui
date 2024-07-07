import React, { useEffect, useReducer } from 'react';
import { PullSrvMsg } from '../proto/netem_pb';

type ServerPullStateT = { [key: string]: PullSrvMsg.Code };
const INITIAL_STATE: ServerPullStateT = {}

function reducer(state: ServerPullStateT, msg:PullSrvMsg.AsObject): ServerPullStateT {
    return {
        ...state,
        [msg.image]: msg.code
    }
}

export default function ProgressServerPull(): JSX.Element {
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

    useEffect(() => {
        window.api.serverPullAddListener((msg: PullSrvMsg.AsObject) => dispatch(msg));

        return () => window.api.serverPullRemoveAllListeners();
    }, []);

    return (
        <div className="toast toast-middle toast-center">
            <div className="alert flex flex-col-reverse gap-1">
                {Object.keys(state).map((image) => (
                    <div className='p-2 w-full'>
                        <span className='me-2'>Pull image <span className='italic'>{image}</span></span>
                        {
                            state[image] == PullSrvMsg.Code.START && (
                                <progress className="progress progress-info w-48">
                                </progress>
                            )
                        }
                        {
                            state[image] == PullSrvMsg.Code.OK && (
                                <span className='text-green-500 font-semibold'>OK</span>
                            )
                        }
                    </div>
                ))}
            </div>
        </div>
    );
}