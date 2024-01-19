import * as path from "path";
import * as fs from "fs/promises";
import { IpcMainInvokeEvent, dialog } from "electron";
import { CLIENT } from "./client";
import { OpenRequest, ProjectRequest, StatusCode } from "../proto/netem_pb";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";

enum IfState {
  UP,
  DOWN,
}

export interface IProject {
  id: string;
  name: string;
  openAt: string;
}

export interface IInterfaceState {
  name: string;
  state: IfState;
}

export interface INodeState {
  name: string;
  running: boolean;
  interfaces: IInterfaceState[];
}

export interface IProjectState extends IProject {
  running: boolean;
  nodes: INodeState[];
}

export let CURRENT_PROJECT_ID = "";

function openProject(
  filename: string,
  data: Buffer
): Promise<StringApiResponse> {
  const errorFmt = (err: string) =>
    `Unable to open project '${filename}.gnet': ${err}`;

  return new Promise<StringApiResponse>((resolve) => {
    const request = new OpenRequest();
    request.setData(data);
    request.setName(filename);

    CLIENT.openProject(request, (err, res) => {
      if (err) {
        resolve({ status: false, error: errorFmt(err) });
      } else {
        const code = res.getStatus().getCode();
        code == StatusCode.ERROR
          ? resolve({
              status: false,
              error: errorFmt(res.getStatus().getError()),
            })
          : resolve({ status: true, result: res.getId() });
      }
    });
  });
}

export const handleOpenProject = async (
  _event: IpcMainInvokeEvent
): Promise<StringApiResponse> => {
  if (CLIENT == null)
    return { status: false, error: "Not connected to the server" };

  if (CURRENT_PROJECT_ID != "")
    return { status: false, error: `A project is already open - ${CURRENT_PROJECT_ID}` };

  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [
      { name: "Projets gonetem", extensions: ["gnet"] },
      { name: "Tous les fichiers", extensions: ["*"] },
    ],
  });

  if (canceled) {
    return { status: false };
  }

  const filepath = filePaths[0];
  if (path.extname(filepath) != ".gnet") {
    return { status: false, error: "Open file has not a .gnet extension" };
  }

  try {
    const data = await fs.readFile(filepath);
    const res = await openProject(path.basename(filepath, ".gnet"), data);
    if (res.status) CURRENT_PROJECT_ID = res.result;

    return res;
  } catch (err) {
    return { status: false, error: `Unable to read ${filepath}: ${err}` };
  }
};

export const handleConnectProject = async (
  _event: IpcMainInvokeEvent,
  prjId: string
): Promise<ApiResponse> => {
  CURRENT_PROJECT_ID = prjId;
  return {status: true};
}

function listProjects(): Promise<PrjListApiResponse> {
  const errorFmt = (err: string) => `Unable to list projects: ${err}`;

  return new Promise<PrjListApiResponse>((resolve) => {
    CLIENT.getProjects(new Empty(), (err, res) => {
      if (err) {
        resolve({ status: false, error: errorFmt(err) });
      } else {
        const code = res.getStatus().getCode();
        code == StatusCode.ERROR
          ? resolve({
              status: false,
              error: errorFmt(res.getStatus().getError()),
            })
          : resolve({
              status: true,
              result: res.getProjectsList().map((info) => {
                return {
                  name: info.getName(),
                  id: info.getId(),
                  openAt: info.getOpenat(),
                };
              }),
            });
      }
    });
  });
}

export const handleListProjects = async (
  _event: IpcMainInvokeEvent
): Promise<PrjListApiResponse> => {
  if (CLIENT == null)
    return { status: false, error: "Not connected to the server" };

  return await listProjects();
};

function getProjectState(prjId: string): Promise<PrjStateApiResponse> {
  const errorFmt = (err: string) =>
    `Unable to get status of project '${prjId}': ${err}`;

  return new Promise<PrjStateApiResponse>((resolve) => {
    const request = new ProjectRequest();
    request.setId(prjId);

    CLIENT.getProjectStatus(request, (err, res) => {
      if (err) {
        resolve({ status: false, error: errorFmt(err) });
      } else {
        const code = res.getStatus().getCode();
        code == StatusCode.ERROR
          ? resolve({
              status: false,
              error: errorFmt(res.getStatus().getError()),
            })
          : resolve({
              status: true,
              result: {
                id: res.getId(),
                name: res.getName(),
                openAt: res.getOpenat(),
                running: res.getRunning(),
                nodes: res.getNodesList().map((node) => {
                  return {
                    name: node.getName(),
                    running: node.getRunning(),
                    interfaces: node.getInterfacesList().map((ifstate) => {
                      return {
                        name: ifstate.getName(),
                        state: ifstate.getState(),
                      };
                    }),
                  };
                }),
              },
            });
      }
    });
  });
}

export const handleGetProjectState = async (
  _event: IpcMainInvokeEvent,
  prjId: string
): Promise<PrjStateApiResponse> => {
  if (CLIENT == null)
    return { status: false, error: "Not connected to the server" };

  return await getProjectState(prjId);
};

function closeProject(prjId: string): Promise<ApiResponse> {
  const errorFmt = (err: string) =>
    `Unable to close project '${prjId}': ${err}`;

  return new Promise<ApiResponse>((resolve) => {
    const request = new ProjectRequest();
    request.setId(prjId);

    CLIENT.closeProject(request, (err, res) => {
      if (err) {
        resolve({ status: false, error: errorFmt(err) });
      } else {
        const code = res.getStatus().getCode();
        code == StatusCode.ERROR
          ? resolve({
              status: false,
              error: errorFmt(res.getStatus().getError()),
            })
          : resolve({ status: true });
      }
    });
  });
}

export const handleCloseProject = async (
  _event: IpcMainInvokeEvent,
  prjId: string
): Promise<ApiResponse> => {
  if (CLIENT == null)
    return { status: false, error: "Not connected to the server" };

  CURRENT_PROJECT_ID = "";
  return await closeProject(prjId);
};
