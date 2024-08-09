
import * as React from 'react';
import { XMarkIcon } from "@heroicons/react/24/solid";

export default function MsgToast({
    type,
    msg,
    clearMsg,
}: {
    type: string,
    msg: string,
    clearMsg: () => void
}): JSX.Element {
    React.useEffect(() => {
        if (type != "error") {
            setTimeout(clearMsg, 5000);
        }
    }, []);

    return (
        <div className="toast toast-center w-5/6 overflow-x-scroll">
          <div className={`alert alert-${type} flex justify-between gap-2`}>
            <span>{msg}</span>
            <div>
                <button
                    className={`btn btn-sm btn-${type}`}
                    onClick={clearMsg}
                >
                    <XMarkIcon className='w-5'/>
                </button>
            </div>
          </div>
        </div>
    );
}