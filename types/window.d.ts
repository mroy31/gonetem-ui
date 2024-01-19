
import { IProject } from 'src/api/project';
import {IOptions} from '../src/api/options';
import { IProjectState } from 'src/api/project';


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
      result?: string
  }

  export interface OptionsApiResponse extends ApiResponse {
      result?: IOptions
  }

  export interface PrjListApiResponse extends ApiResponse {
      result?: IProject[]
  }

  export interface PrjStateApiResponse extends ApiResponse {
      result?: IProjectState
  }

  export interface FileApiResponse extends ApiResponse {
      result?: string
  }

  export interface ConfigFilesApiResponse extends ApiResponse {
      result?: {
        running: boolean;
        files: {
          name: string;
          data: string;
        }[]
      }
  }

  export type ContextBridgeApi = {
    isConnected: () => Promise<IsConnectedApiResponse>,
    connect: () => Promise<StringApiResponse>,
    setOptions: (options: IOptions) => Promise<ApiResponse>,
    getOptions: () => Promise<OptionsApiResponse>,
    openProject: () => Promise<StringApiResponse>,
    connectProject: (prjId: string) => Promise<ApiResponse>,
    listProjects: () => Promise<PrjListApiResponse>,
    getProjectState: (prjId: string) => Promise<PrjStateApiResponse>,
    readTopologyFile: (prjId: string) => Promise<FileApiResponse>,
    writeTopologyFile: (prjId: string, data: string) => Promise<ApiResponse>,
    checkTopologyFile: (prjId: string) => Promise<ApiResponse>,
    runTopology: (prjId: string) => Promise<ApiResponse>,
    reloadTopology: (prjId: string) => Promise<ApiResponse>,
    readNodeConfigFiles: (prjId: string, nodeId: string) => Promise<ConfigFilesApiResponse>,
    closeProject: (prjId: string) => Promise<ApiResponse>,
  }

  interface Window {
    api: ContextBridgeApi;
  }
}
