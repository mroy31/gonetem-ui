import * as React from "react";
import { useTranslation } from "react-i18next";

export interface INodeMessages {
  name: string;
  messagesList: string[];
}

export default function NodeMessagesToast({
  nodeMessages,
  clearNodeMessages,
}: {
  nodeMessages: INodeMessages[];
  clearNodeMessages: () => void;
}): JSX.Element {
  const {t} = useTranslation();
  const hasNodeMessages = React.useCallback((): boolean => {
    for (const nMessages of nodeMessages) {
      if (nMessages.messagesList.length > 0) return true;
    }
    return false;
  }, [nodeMessages]);

  return hasNodeMessages() ? (
    <div className="toast toast-end">
      <div className="alert alert-warning flex flex-col">
        {nodeMessages.map((nodeMsg) => (
          <>
            {nodeMsg.messagesList.length > 0 && (
              <div key={nodeMsg.name}>
                <span className="font-bold underline">{nodeMsg.name}:</span>
                <ul>
                  {nodeMsg.messagesList.map((msg, idx) => (
                    <li key={idx}>{msg}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ))}
        <div className="flex justify-end w-full">
          <button
            className="btn btn-neutral btn-sm"
            onClick={clearNodeMessages}
          >
            { t("Close") }
          </button>
        </div>
      </div>
    </div>
  ) : null;
}
