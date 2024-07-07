import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  FolderOpenIcon,
  WrenchScrewdriverIcon,
  PlusIcon,
  BoltIcon,
  CloudArrowDownIcon,
} from "@heroicons/react/24/solid";
import OptionsModal from "./components/OptionsModal";
import { IOptions } from "./api/options";
import ErrorToast from "./components/ErrorToast";
import ProjectPanel from "./components/ProjectPanel";
import ProjectListModal from "./components/ProjectListModal";
import { AppContext, ProgressOperation } from "./context";
import ProgressTopologyRun from "./components/ProgressTopologyRun";
import ProgressProjectClose from "./components/ProgressProjectClose";
import ProgressProjectSave from "./components/ProgressProjectSave";
import NodeMessagesToast, { INodeMessages } from "./components/NodeMessagesToast";
import ProgressServerPull from "./components/ProgressServerPull";


function App(): JSX.Element {
  const [version, setVersion] = useState("");
  const [optionsModalOpen, setOptionsModalOpen] = useState(false);
  const [prjListModalOpen, setprjListModalOpen] = useState(false);
  const [options, setOptions] = useState<IOptions | null>(null);
  const [currentPrj, setCurrentPrj] = useState("");
  const [currentPrgOperation, setCurrentPrgOperation] = useState<ProgressOperation>(ProgressOperation.None);
  const [nodeMessages, setNodeMessages] = useState<INodeMessages[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    window.api.isConnected().then((res): void => {
      if (res.status == false) {
        setError(`An error is occured: ${error}`);
        return;
      }

      if (res.result?.connected) {
        setVersion(res.result?.version ?? "");
        setCurrentPrj(res.result?.currentPrj ?? "");
      }
    });

    window.api.getOptions().then((res) => setOptions(res.result));
  }, []);

  const handleConnect = async () => {
    const res = await window.api.connect();
    res.status
      ? setVersion(res.result)
      : setError(`unable to connect to server: ${res.error}`);
  };

  const handleOpenProject = async () => {
    const res = await window.api.openProject();
    res.status ? setCurrentPrj(res.result) : setError(res.error);
  };

  const handleCreateProject = async () => {
    const res = await window.api.createProject();
    res.status ? setCurrentPrj(res.result) : setError(res.error);
  };

  const handleCloseProject = async () => {
    if (currentPrj != "") {
      setCurrentPrgOperation(ProgressOperation.ProjectClose);
      const res = await window.api.closeProject(currentPrj);
      setCurrentPrgOperation(ProgressOperation.None);

      if (!res.status) setError(res.error);
      setCurrentPrj("");
    }
  };

  const handleConnectProject = async (prjId: string) => {
    if (prjId != "") {
      window.api.connectProject(prjId);
      setCurrentPrj(prjId);
    }
    setprjListModalOpen(false);
  };

  const handleServerPullImages = async () => {
    setCurrentPrgOperation(ProgressOperation.ServerPullImages);
    const res = await window.api.pullImages();
    setCurrentPrgOperation(ProgressOperation.None);

    if (!res.status) setError(res.error);
  }

  const connected = version != "";
  return (
    <AppContext.Provider 
      value={{
        error, setError, 
        options, 
        currentPrgOperation, setCurrentPrgOperation}}>

    <div className="flex flex-col h-screen">
      <div className="navbar bg-base-200 flex-none">
        <div className="flex-1">
          <span className="btn btn-ghost text-xl">GONETEM</span>
        </div>

        <div className="flex-none">
          <div className="flex gap-1 align-middle">
            <div className="join px-1">
              <button
                onClick={() => setOptionsModalOpen(true)}
                className="btn btn-outline btn-neutral btn-sm join-item"
              >
                <WrenchScrewdriverIcon className="w-5" />
                <span>Options</span>
              </button>
            </div>
          </div>

          <div className="divider divider-horizontal bg-base-content w-1"></div>

          <div>
            {version ? (
              <span className="italic">Connected: {version}</span>
            ) : (
              <button
                className="btn btn-ghost btn-primary btn-sm"
                onClick={handleConnect}
              >
                Connect to server
              </button>
            )}
          </div>
        </div>
      </div>

      {currentPrj != "" ? (
        <ProjectPanel prjId={currentPrj} onClose={handleCloseProject} />
      ) : (
        <div className="flex-1 mt-10 flex justify-center align-middle h-full min-h-0">
          <div className="flex gap-2">
            <div className="join join-vertical px-2">
              <button
                disabled={!connected || currentPrj != ""}
                onClick={handleOpenProject}
                className="btn btn-outline btn-accent btn-sm join-item"
              >
                <FolderOpenIcon className="w-5" />
                <span>Open a .gnet project</span>
              </button>
              <button
                disabled={!connected || currentPrj != ""}
                onClick={handleCreateProject}
                className="btn btn-outline btn-primary btn-sm join-item"
              >
                <PlusIcon className="w-5" />
                <span>Create an empty .gnet project</span>
              </button>
              <button
                disabled={!connected || currentPrj != ""}
                onClick={() => setprjListModalOpen(true)}
                className="btn btn-outline btn-neutral btn-sm join-item"
              >
                <BoltIcon className="w-5" />
                <span>Connect to a running project</span>
              </button>
              <button
                disabled={!connected || currentPrj != ""}
                onClick={handleServerPullImages}
                className="btn btn-outline btn-neutral btn-sm join-item"
              >
                <CloudArrowDownIcon className="w-5" />
                <span>Pull docker images</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {connected && (
        <ProjectListModal
          isOpen={prjListModalOpen}
          onClose={handleConnectProject}
        />
      )}

      {options && (
        <OptionsModal
          options={options}
          isOpen={optionsModalOpen}
          setIsOpen={setOptionsModalOpen}
        />
      )}

      {error != "" && (
        <ErrorToast error={error} clearError={() => setError("")} />
      )}
      
      {nodeMessages.length > 0 && (
        <NodeMessagesToast
          nodeMessages={nodeMessages}
          clearNodeMessages={() => setNodeMessages([])}
        />
      )}

      { (currentPrgOperation == ProgressOperation.TopologyRun || 
         currentPrgOperation == ProgressOperation.TopologyReload) && (
        <ProgressTopologyRun
          setNodeMessages={setNodeMessages}
        />
      )}
      { currentPrgOperation == ProgressOperation.ProjectClose && (
        <ProgressProjectClose/>
      )}
      { currentPrgOperation == ProgressOperation.ProjectSave && (
        <ProgressProjectSave/>
      )}
      { currentPrgOperation == ProgressOperation.ServerPullImages && (
        <ProgressServerPull/>
      )}
    </div>

    </AppContext.Provider>
  );
}

const container = document.getElementById("app-container");
if (container != null) {
  const root = createRoot(container);
  root.render(<App />);
}
