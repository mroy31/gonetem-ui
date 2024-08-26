import classNames from "classnames";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { IProject } from "../api/interface";

const PrjListTable = ({
  prjList,
  onSelect,
}: {
  prjList: IProject[];
  onSelect: (prjId: string) => void;
}): JSX.Element => {
  const {t} = useTranslation();

  if (prjList.length > 0)
    return (
            <table className="table table-zebra p-1">
              <thead>
                <tr>
                  <th>{t("Name")}</th>
                  <th>{t("OpenAt")}</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {prjList.map((prj) => (
                  <tr key={prj.id}>
                    <td>{prj.name}</td>
                    <td>{prj.openAt}</td>
                    <td>
                      <button
                        onClick={() => onSelect(prj.id)} 
                        className="btn btn-outline btn-primary btn-sm">
                        {t("Select")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
    );

  return <p className="italic p-3">{t("NoProjectOpenMsg")}</p>
}


export default function ProjectListModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: (selectedPrj: string) => void;
}): JSX.Element {
  const {t} = useTranslation();
  const [prjList, setPrjList] = useState<IProject[]>([]);
  const [error, setError] = useState("");
  const modalClass = useMemo(
    () =>
      classNames({
        modal: true,
        "modal-open": isOpen,
      }),
    [isOpen]
  );

  useEffect(() => {
    window.api.listProjects().then((res) => {
      if (!res.status) {
        setError(error);
        return;
      }

      setError("");
      setPrjList(res.result);
    })
  }, [isOpen]);

  return (
    <dialog className={modalClass}>
      <div className="modal-box">
        <h3>{t("SelectProjectHeader")}</h3>

        {
          error ? (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          ) : (
            <PrjListTable 
              prjList={prjList}
              onSelect={onClose}
            />
          )
        }

        <div className="modal-action">
          <button onClick={() => onClose("")} className="btn">
            {t("Close")}
          </button>
        </div>
      </div>
    </dialog>
  );
}
