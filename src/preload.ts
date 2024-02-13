
import { contextBridge, ipcRenderer } from 'electron';
import { IOptions } from './api/options';

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
  runNodeConsole: (prjId: string, nodeId: string):Promise<ApiResponse> => ipcRenderer.invoke("server:runNodeConsole", prjId, nodeId),
  runNodeStart: (prjId: string, nodeId: string):Promise<ApiResponse> => ipcRenderer.invoke("server:runNodeStart", prjId, nodeId),
  runNodeStop: (prjId: string, nodeId: string):Promise<ApiResponse> => ipcRenderer.invoke("server:runNodeStop", prjId, nodeId),
  runNodeRestart: (prjId: string, nodeId: string):Promise<ApiResponse> => ipcRenderer.invoke("server:runNodeRestart", prjId, nodeId),
  runNodeCapture: (prjId: string, nodeId: string, ifIndex: number):Promise<ApiResponse> => ipcRenderer.invoke("server:runNodeCapture", prjId, nodeId, ifIndex),
  runNodeSetIfState: (prjId: string, nodeId: string, ifIndex: number, up: boolean):Promise<ApiResponse> => ipcRenderer.invoke("server:runNodeSetIfState", prjId, nodeId, ifIndex, up),
  closeProject: (prjId: string):Promise<ApiResponse> => ipcRenderer.invoke("server:close", prjId),
}

contextBridge.exposeInMainWorld('api', exposedApi);
