import React, { useMemo, useState } from "react";
import { useTranslation } from 'react-i18next';
import classNames from "classnames";
import { IOptions } from "../api/options";

export default function OptionsModal({
  options,
  isOpen,
  setIsOpen,
}: {
  options: IOptions;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}): JSX.Element {
  const {t} = useTranslation();
  const [server, setServer] = useState(options?.server || "localhost:10110");
  const [autoconnect, setAutoconnect] = useState<boolean>(options?.autoconnect);
  const [tls, setTls] = useState(options?.tls);
  const [consoleCmd, setConsoleCmd] = useState(options?.consoleExternalCmd);

  const modalClass = useMemo(
    () =>
      classNames({
        modal: true,
        "modal-open": isOpen,
      }),
    [isOpen]
  );

  const setOptions = () => {
    window.api
      .setOptions({
        server,
        autoconnect,
        tls,
        consoleExternalCmd: consoleCmd,
      })
      .then((res) => {
        if (res.status) setIsOpen(false);
      });
  };

  return (
    <dialog className={modalClass}>
      <div className="modal-box">
        <h2 className="text-2xl font-bold">{t("Options")}</h2>

        <div className="flex flex-col gap-2 w-full">
          <div className="divider">{t("ServerConnectionHeader")}</div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">{t("ServerURILabel")}</span>
            </div>
            <input
              type="text"
              value={server}
              onChange={(e) => setServer(e.target.value)}
              className="input input-bordered w-full max-w-xs"
            />
          </label>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">{t("ConnectAtStartupLabel")}</span> 
              <input 
                type="checkbox"
                checked={autoconnect}
                onChange={(e) => setAutoconnect(e.target.checked)}
                className="checkbox"/>
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">{t("TLSEnabledLabel")}</span> 
              <input 
                type="checkbox"
                checked={tls.enabled}
                onChange={(e) => setTls({...tls, enabled: e.target.checked})}
                className="checkbox"/>
            </label>
          </div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">{t("CACertificateLabel")}</span>
            </div>
            <input
              type="text"
              value={tls.ca ?? ""}
              onChange={(e) => setTls({...tls, ca: e.target.value})}
              className="input input-bordered w-full max-w-xs"
            />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">{t("ClientCertificateLabel")}</span>
            </div>
            <input
              type="text"
              value={tls.cert ?? ""}
              onChange={(e) => setTls({...tls, cert: e.target.value})}
              className="input input-bordered w-full max-w-xs"
            />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">{t("ClientPrivateKeyLabel")}</span>
            </div>
            <input
              type="text"
              value={tls.key ?? ""}
              onChange={(e) => setTls({...tls, key: e.target.value})}
              className="input input-bordered w-full max-w-xs"
            />
          </label>

          <div className="divider">Console</div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">{t("ExternalConsoleCommandLabel")}</span>
            </div>
            <input
              type="text"
              value={consoleCmd ?? ""}
              onChange={(e) => setConsoleCmd(e.target.value)}
              className="input input-bordered w-full max-w-xs"
            />
          </label>
        </div>

        <div className="modal-action">
          <button onClick={() => setIsOpen(false)} className="btn">
            {t("Close")}
          </button>
          <button onClick={setOptions} className="btn btn-primary">
            {t("Save")}
          </button>
        </div>
      </div>
    </dialog>
  );
}
