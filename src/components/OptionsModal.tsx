import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { IOptions } from "../api/options";

export default function OptionsModal({
  options,
  isOpen,
  setIsOpen,
}: {
  options: IOptions;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}): React.JSX.Element {
  const {t} = useTranslation();
  const [server, setServer] = useState(options?.server || "localhost:10110");
  const [autoconnect, setAutoconnect] = useState<boolean>(options?.autoconnect);
  const [tls, setTls] = useState(options?.tls);
  const [consoleCmd, setConsoleCmd] = useState(options?.consoleExternalCmd);

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
    <dialog open={isOpen} className="modal">
      <div className="modal-box">
        <h2 className="text-2xl font-bold">{t("Options")}</h2>

        <div className="flex flex-col gap-2 w-full">
          <div className="divider">{t("ServerConnectionHeader")}</div>
          <fieldset className="fieldset">
            <label className="fieldset-legend" htmlFor="optServer">
              {t("ServerURILabel")}
            </label>
            <input
              id="optServer"
              type="text"
              value={server}
              onChange={(e) => setServer(e.target.value)}
              className="input"
            />
          </fieldset>
          <label className="flex items-center gap-2 cursor-pointer">
            <span>{t("ConnectAtStartupLabel")}</span>
            <input
              type="checkbox"
              checked={autoconnect}
              onChange={(e) => setAutoconnect(e.target.checked)}
              className="checkbox"/>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <span>{t("TLSEnabledLabel")}</span>
            <input
              type="checkbox"
              checked={tls.enabled}
              onChange={(e) => setTls({...tls, enabled: e.target.checked})}
              className="checkbox"/>
          </label>
          <fieldset className="fieldset">
            <label className="fieldset-legend" htmlFor="optCaCert">
              {t("CACertificateLabel")}
            </label>
            <input
              id="optCaCert"
              type="text"
              value={tls.ca ?? ""}
              onChange={(e) => setTls({...tls, ca: e.target.value})}
              className="input"
            />
          </fieldset>
          <fieldset className="fieldset">
            <label className="fieldset-legend" htmlFor="optClientCert">
              {t("ClientCertificateLabel")}
            </label>
            <input
              id="optClientCert"
              type="text"
              value={tls.cert ?? ""}
              onChange={(e) => setTls({...tls, cert: e.target.value})}
              className="input"
            />
          </fieldset>
          <fieldset className="fieldset">
            <label className="fieldset-legend" htmlFor="optClientKey">
              {t("ClientPrivateKeyLabel")}
            </label>
            <input
              id="optClientKey"
              type="text"
              value={tls.key ?? ""}
              onChange={(e) => setTls({...tls, key: e.target.value})}
              className="input"
            />
          </fieldset>

          <div className="divider">Console</div>
          <fieldset className="fieldset">
            <label className="fieldset-legend" htmlFor="optConsoleCmd">
              {t("ExternalConsoleCommandLabel")}
            </label>
            <input
              id="optConsoleCmd"
              type="text"
              value={consoleCmd ?? ""}
              onChange={(e) => setConsoleCmd(e.target.value)}
              className="input"
            />
          </fieldset>
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
