
import * as React from 'react';

export interface INodeMessages {
    name: string;
    messagesList: string[];
}


export default function NodeMessagesToast({
    nodeMessages,
    clearNodeMessages,
}: {
    nodeMessages: INodeMessages[],
    clearNodeMessages: () => void
}): JSX.Element {
    return nodeMessages.length > 0 ? (
        <div className="toast toast-end">
          <div className="alert alert-warning flex flex-col">
            { nodeMessages.map((nodeMsg) => (
                <>
                {nodeMsg.messagesList.length > 0 && (
                    <div>
                        <span className='font-bold underline'>{nodeMsg.name}:</span>
                        <ul>
                            {nodeMsg.messagesList.map((msg) => (
                                <li>{msg}</li>
                            ))}
                        </ul>
                    </div>
                )}
                </>
            ))}
            <div className='flex justify-end w-full'>
                <button
                    className='btn btn-neutral btn-sm'
                    onClick={clearNodeMessages}
                >
                    Close
                </button>
            </div>
          </div>
        </div>
    ) : null;
}