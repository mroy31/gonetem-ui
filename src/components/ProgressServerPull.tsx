import React, { useEffect, useReducer } from 'react';
import { useTranslation } from 'react-i18next';
import { PullSrvMsg } from '../proto/netem_pb';

type ServerPullStateT = { [key: string]: {code: PullSrvMsg.Code; error: string; }};
const INITIAL_STATE: ServerPullStateT = {}

function reducer(state: ServerPullStateT, msg:PullSrvMsg.AsObject): ServerPullStateT {
    return {
        ...state,
        [msg.image]: {
            code: msg.code,
            error: msg.error
        }
    }
}

export default function ProgressServerPull(): JSX.Element {
    const {t} = useTranslation();
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
                        <div>
                            <span className='me-2'>
                                {t("PullDockerImgProgress", {image, interpolation: {escapeValue: false}})}
                            </span>
                            {
                                state[image].code == PullSrvMsg.Code.START && (
                                    <progress className="progress progress-info w-32">
                                    </progress>
                                )
                            }
                            {
                                state[image].code == PullSrvMsg.Code.OK && (
                                    <span className='text-green-500 font-semibold flex-1 text-ellipsis'>OK</span>
                                )
                            }
                            {
                                state[image].code == PullSrvMsg.Code.ERROR && (
                                    <span className='text-red-500 font-bold'>NOK</span>
                                )
                            }
                        </div>
                        {
                            state[image].code == PullSrvMsg.Code.ERROR && (
                                <p className='text-red-500'>{state[image].error}</p>
                            )
                        }
                    </div>
                ))}
            </div>
        </div>
    );
}