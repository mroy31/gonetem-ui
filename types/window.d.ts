
import { IProject, IProjectState } from '../src/api/project';
import {IOptions} from '../src/api/options';


export {}; // needed to make TypeScript happy

declare global {
  export interface ApiResponse {
    status: boolean,
    error?: string,
  }

  export interface IsConnectedApiResponse extends ApiResponse {
      result?: {
        connected: boolean;
        version?: string;
        currentPrj?: string;
      }
  }

  export interface StringApiResponse extends ApiResponse {
      result?: string;
  }

  export interface StringListApiResponse extends ApiResponse {
      result?: string[];
  }

  export interface OptionsApiResponse extends ApiResponse {
      result?: IOptions;
  }

  export interface PrjListApiResponse extends ApiResponse {
      result?: IProject[];
  }

  export interface PrjStateApiResponse extends ApiResponse {
      result?: IProjectState;
  }

  export interface FileApiResponse extends ApiResponse {
      result?: string;
  }

  export interface ConfigFilesApiResponse extends ApiResponse {
      result?: {
        running: boolean;
        files: {
          name: string;
          data: string;
        }[];
      }
  }

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
    readNodeConfigFiles: (prjId: string, nodeId: string) => Promise<ConfigFilesApiResponse>,
    runNodeConsole: (prjId: string, nodeId: string, shell: boolean) => Promise<ApiResponse>,
    runNodeStart: (prjId: string, nodeId: string) => Promise<ApiResponse>,
    runNodeStop: (prjId: string, nodeId: string) => Promise<ApiResponse>,
    runNodeRestart: (prjId: string, nodeId: string) => Promise<ApiResponse>,
    runNodeCapture: (prjId: string, nodeId: string, ifIndex: number) => Promise<ApiResponse>,
    runNodeSetIfState: (prjId: string, nodeId: string, ifIndex: number, up: boolean) => Promise<ApiResponse>,
    closeProject: (prjId: string) => Promise<ApiResponse>,
    // internal console
    consoleRun: (nodeId: string) => Promise<ApiResponse>,
    consoleWrite: (nodeId: string, data: string) => Promise<ApiResponse>,
    consoleResize: (nodeId: string, width: number, height: number) => Promise<ApiResponse>,
    consoleOnMsg: (cb: (msgType: string, nodeId: string, data: string) => void) => void,
    consoleListOpen: () => Promise<StringListApiResponse>,
  }

  interface Window {
    api: ContextBridgeApi;
  }
}
