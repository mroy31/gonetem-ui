
import { IProject, IProjectState } from '../src/api/project';
import {IOptions} from '../src/api/options';
import {
  ProjectCloseMsg,
  ProjectSaveMsg,
  PullSrvMsg,
  TopologyRunMsg,
} from "../src/proto/netem_pb";


export {}; // needed to make TypeScript happy

declare global {
  export type ApiResponseErr = {
    status: false,
    error: string,
  }

  export type ApiResponse = {
    status: true,
  } | ApiResponseErr

  export type IsConnectedApiResponse = {
    status: true,
    result: {
      connected: false;
    } | {
      connected: true;
      version: string;
      currentPrj: string;
    }
  } | ApiResponseErr

  export type StringApiResponse = {
    status: true,
    result: string;
  } | ApiResponseErr

  export type StringListApiResponse = {
    status: true,
    result: string[];
  } | ApiResponseErr

  export type OptionsApiResponse = {
    status: true,
    result: IOptions;
  } | ApiResponseErr

  export type PrjListApiResponse = {
    status: true,
    result: IProject[];
  } | ApiResponseErr

  export type PrjStateApiResponse = {
    status: true,
    result: IProjectState;
  } | ApiResponseErr

  export type FileApiResponse = {
    status: true,
    result: string;
  } | ApiResponseErr

  export type ConfigFilesApiResponse = {
    status: true,
    result: {
      running: boolean;
      files: {
        name: string;
        data: string;
      }[];
    }
  } | ApiResponseErr

  export type I18nApiResponse = {
    status: true,
    result: {
      [key: string]: string;
    }
  } | ApiResponseErr

  export type ContextBridgeApi = {
    isConnected: () => Promise<IsConnectedApiResponse>,
    connect: () => Promise<StringApiResponse>,
    setOptions: (options: IOptions) => Promise<ApiResponse>,
    getOptions: () => Promise<OptionsApiResponse>,
    openProject: () => Promise<StringApiResponse>,
    createProject: () => Promise<StringApiResponse>,
    saveProject: (prjId: string) => Promise<ApiResponse>,
    connectProject: (prjId: string) => Promise<ApiResponse>,
    listProjects: () => Promise<PrjListApiResponse>,
    getProjectState: (prjId: string) => Promise<PrjStateApiResponse>,
    readTopologyFile: (prjId: string) => Promise<FileApiResponse>,
    writeTopologyFile: (prjId: string, data: string) => Promise<ApiResponse>,
    checkTopologyFile: (prjId: string) => Promise<ApiResponse>,
    runTopology: (prjId: string) => Promise<ApiResponse>,
    reloadTopology: (prjId: string) => Promise<ApiResponse>,
    recordTopologyImg: (data: Buffer) => Promise<ApiResponse>,
    runAllConsoles: (prjId: string, shell: boolean) => Promise<ApiResponse>,
    readNodeConfigFiles: (prjId: string, nodeId: string) => Promise<ConfigFilesApiResponse>,
    runNodeConsole: (prjId: string, nodeId: string, shell: boolean) => Promise<ApiResponse>,
    runNodeStart: (prjId: string, nodeId: string) => Promise<ApiResponse>,
    runNodeStop: (prjId: string, nodeId: string) => Promise<ApiResponse>,
    runNodeRestart: (prjId: string, nodeId: string) => Promise<ApiResponse>,
    runNodeCapture: (prjId: string, nodeId: string, ifIndex: number) => Promise<ApiResponse>,
    runNodeSetIfState: (prjId: string, nodeId: string, ifIndex: number, up: boolean) => Promise<ApiResponse>,
    closeProject: (prjId: string) => Promise<ApiResponse>,
    pullImages: () => Promise<ApiResponse>,
    // Server listeners
    serverPullAddListener: (cb: (msg: PullSrvMsg.AsObject) => void) => void,
    serverPullRemoveAllListeners: () => void,
    // topology listeners
    topologyRunAddListener: (cb: (msg: TopologyRunMsg.AsObject) => void) => void,
    topologyRunRemoveAllListeners: () => void,
    // Project listeners
    projectSaveAddListener: (cb: (msg: ProjectSaveMsg.AsObject) => void) => void,
    projectSaveRemoveAllListeners: () => void,
    projectCloseAddListener: (cb: (msg: ProjectCloseMsg.AsObject) => void) => void,
    projectCloseRemoveAllListeners: () => void,
    // internal console
    consoleRun: (nodeId: string) => Promise<StringApiResponse>,
    consoleWrite: (nodeId: string, data: string) => Promise<ApiResponse>,
    consoleResize: (nodeId: string, width: number, height: number) => Promise<ApiResponse>,
    consoleSaveState: (nodeId: string, state: string) => Promise<ApiResponse>,
    consoleListOpen: () => Promise<StringListApiResponse>,
    consoleAddListener: (nodeId: string, cb: (msgType: string, data: string) => void) => void,
    consoleRemoveListeners: (nodeId: string) => void,
    // i18n commands
    i18nRead: (language: string, namespace: string) => Promise<I18nApiResponse>,
    i18nCreate: (languages: string[], namespace: string, key: string, fallbackValue: string) => Promise<ApiResponse>,
  }

  interface Window {
    api: ContextBridgeApi;
  }
}
