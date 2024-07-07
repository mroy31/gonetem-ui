
import { contextBridge, ipcRenderer } from 'electron';
import { IOptions } from './api/options';
import { TopologyRunMsg, ProjectCloseMsg, ProjectSaveMsg, PullSrvMsg } from './proto/netem_pb';

const exposedApi: ContextBridgeApi = {
  isConnected: (): Promise<IsConnectedApiResponse> => ipcRenderer.invoke("server:isConnected"),
  connect: (): Promise<StringApiResponse> => ipcRenderer.invoke("server:connect"),
  getOptions: (): Promise<OptionsApiResponse> => ipcRenderer.invoke("client:getOptions"),
  setOptions: (options: IOptions):Promise<ApiResponse> => ipcRenderer.invoke("client:setOptions", options),
  openProject: ():Promise<ApiResponse> => ipcRenderer.invoke("server:openProject"),
  createProject: ():Promise<ApiResponse> => ipcRenderer.invoke("server:createProject"),
  saveProject: (prjId: string):Promise<ApiResponse> => ipcRenderer.invoke("server:saveProject", prjId),
  connectProject: (prjId: string):Promise<ApiResponse> => ipcRenderer.invoke("server:connectProject", prjId),
  listProjects: ():Promise<PrjListApiResponse> => ipcRenderer.invoke("server:listProjects"),
  getProjectState: (prjId: string):Promise<ApiResponse> => ipcRenderer.invoke("server:getProjectState", prjId),
  readTopologyFile: (prjId: string):Promise<FileApiResponse> => ipcRenderer.invoke("server:readTopology", prjId),
  writeTopologyFile: (prjId: string, data: string):Promise<ApiResponse> => ipcRenderer.invoke("server:writeTopology", prjId, data),
  checkTopologyFile: (prjId: string):Promise<ApiResponse> => ipcRenderer.invoke("server:checkTopology", prjId),
  runTopology: (prjId: string):Promise<ApiResponse> => ipcRenderer.invoke("server:runTopology", prjId),
  reloadTopology: (prjId: string):Promise<ApiResponse> => ipcRenderer.invoke("server:reloadTopology", prjId),
  readNodeConfigFiles: (prjId: string, nodeId: string):Promise<ConfigFilesApiResponse> => ipcRenderer.invoke("server:readNodeConfigFiles", prjId, nodeId),
  runNodeConsole: (prjId: string, nodeId: string, shell: boolean):Promise<ApiResponse> => ipcRenderer.invoke("server:runNodeConsole", prjId, nodeId, shell),
  runNodeStart: (prjId: string, nodeId: string):Promise<ApiResponse> => ipcRenderer.invoke("server:runNodeStart", prjId, nodeId),
  runNodeStop: (prjId: string, nodeId: string):Promise<ApiResponse> => ipcRenderer.invoke("server:runNodeStop", prjId, nodeId),
  runNodeRestart: (prjId: string, nodeId: string):Promise<ApiResponse> => ipcRenderer.invoke("server:runNodeRestart", prjId, nodeId),
  runNodeCapture: (prjId: string, nodeId: string, ifIndex: number):Promise<ApiResponse> => ipcRenderer.invoke("server:runNodeCapture", prjId, nodeId, ifIndex),
  runNodeSetIfState: (prjId: string, nodeId: string, ifIndex: number, up: boolean):Promise<ApiResponse> => ipcRenderer.invoke("server:runNodeSetIfState", prjId, nodeId, ifIndex, up),
  closeProject: (prjId: string):Promise<ApiResponse> => ipcRenderer.invoke("server:close", prjId),
  pullImages: ():Promise<ApiResponse> => ipcRenderer.invoke("server:pullImages"),
  // Server listeners
  serverPullAddListener: (cb: (msg: PullSrvMsg.AsObject) => void) => { ipcRenderer.on(`server:pull:event`, (_event, msg: PullSrvMsg.AsObject) => cb(msg)); },
  serverPullRemoveAllListeners: () => { ipcRenderer.removeAllListeners("server:pull:event"); },
  // Topology listeners
  topologyRunAddListener: (cb: (msg: TopologyRunMsg.AsObject) => void) => { ipcRenderer.on(`topology:run:event`, (_event, msg: TopologyRunMsg.AsObject) => cb(msg)); },
  topologyRunRemoveAllListeners: () => { ipcRenderer.removeAllListeners("topology:run:event"); },
  // Project listeners
  projectSaveAddListener: (cb: (msg: ProjectSaveMsg.AsObject) => void) => { ipcRenderer.on(`project:save:event`, (_event, msg: ProjectSaveMsg.AsObject) => cb(msg)); }, 
  projectSaveRemoveAllListeners: () => { ipcRenderer.removeAllListeners("project:save:event"); },
  projectCloseAddListener: (cb: (msg: ProjectCloseMsg.AsObject) => void) => { ipcRenderer.on(`project:close:event`, (_event, msg: ProjectCloseMsg.AsObject) => cb(msg)); }, 
  projectCloseRemoveAllListeners: () => { ipcRenderer.removeAllListeners("project:close:event"); },
  // internal console
  consoleRun: (nodeId: string): Promise<StringApiResponse> => ipcRenderer.invoke("console:run", nodeId),
  consoleWrite: (nodeId: string, data: string): Promise<ApiResponse> => ipcRenderer.invoke("console:write", nodeId, data),
  consoleResize: (nodeId: string, width: number, height: number):Promise<ApiResponse> => ipcRenderer.invoke("console:resize", nodeId, width, height),
  consoleSaveState: (nodeId: string, state: string): Promise<ApiResponse> => ipcRenderer.invoke("console:saveState", nodeId, state),
  consoleListOpen: (): Promise<StringListApiResponse> => ipcRenderer.invoke("console:listOpen"),
  consoleAddListener: (nodeId: string, cb: (msgType: string, data: string) => void) => {
    ipcRenderer.on(`console:stdout:${nodeId}`, (_event, data: string) => cb("stdout", data));
    ipcRenderer.on(`console:stderr:${nodeId}`, (_event, data: string) => cb("stderr", data));
    ipcRenderer.on(`console:error:${nodeId}`, (_event, data: string) => cb("error", data));
    ipcRenderer.on(`console:close:${nodeId}`, (_event) => cb("close", ""));
  },
  consoleRemoveListeners: (nodeId: string) => {
    for (const k of ["stdout", "stderr", "error", "close"]) {
      ipcRenderer.removeAllListeners(`console:${k}:${nodeId}`);
    }
  },
}

contextBridge.exposeInMainWorld('api', exposedApi);
