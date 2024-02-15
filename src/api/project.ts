import * as path from "path";
import * as fs from "fs";
import { createGzip } from "zlib";
import tar from "tar-stream";
import { IpcMainInvokeEvent, dialog } from "electron";
import { CLIENT } from "./client";
import { OpenRequest, ProjectRequest, StatusCode } from "../proto/netem_pb";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";

export let CURRENT_PROJECT_ID = "";
export let CURRENT_PROJECT_FILEPATH = "";

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
    return {
      status: false,
      error: `A project is already open - ${CURRENT_PROJECT_ID}`,
    };

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
    const data = await fs.promises.readFile(filepath);
    const res = await openProject(path.basename(filepath, ".gnet"), data);
    if (res.status) {
      CURRENT_PROJECT_ID = res.result;
      CURRENT_PROJECT_FILEPATH = filepath;
    }

    return res;
  } catch (err) {
    return { status: false, error: `Unable to read ${filepath}: ${err}` };
  }
};

const createEmptyProject = (filePath: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const dest = fs.createWriteStream(filePath, { flags: "w" });
    const pack = tar.pack();
    pack.entry({ name: "network.yml" }, "nodes:\nlinks:\nbridges:\n", (_) =>
      pack.finalize()
    );
    pack
      .pipe(createGzip())
      .pipe(dest);

    dest.on("error", (err) => { reject(err); });
    dest.on("finish", () => { resolve(); });
  });
};

export const handleCreateProject = async (
  _event: IpcMainInvokeEvent
): Promise<StringApiResponse> => {
  if (CLIENT == null)
    return { status: false, error: "Not connected to the server" };

  if (CURRENT_PROJECT_ID != "")
    return {
      status: false,
      error: `A project is already open - ${CURRENT_PROJECT_ID}`,
    };

  const { canceled, filePath } = await dialog.showSaveDialog({
    properties: ["createDirectory"],
    filters: [
      { name: "Projets gonetem", extensions: ["gnet"] },
      { name: "Tous les fichiers", extensions: ["*"] },
    ],
  });

  if (canceled) {
    return { status: false };
  }

  if (path.extname(filePath) != ".gnet") {
    return { status: false, error: "Created file has not a .gnet extension" };
  }

  try {
    await createEmptyProject(filePath);
    // open created project
    const data = await fs.promises.readFile(filePath);
    const res = await openProject(path.basename(filePath, ".gnet"), data);
    if (res.status) {
      CURRENT_PROJECT_ID = res.result;
      CURRENT_PROJECT_FILEPATH = filePath;
    }

    return res;
  } catch (err) {
    return {
      status: false,
      error: "Unable to create empty project: " + err.message,
    };
  }
};

export const handleConnectProject = async (
  _event: IpcMainInvokeEvent,
  prjId: string
): Promise<ApiResponse> => {
  CURRENT_PROJECT_ID = prjId;
  return { status: true };
};

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

function saveProject(prjId: string, filePath: string): Promise<ApiResponse> {
  const errorFmt = (err: string) =>
    `Unable to save project '${prjId}': ${err}`;

  return new Promise<ApiResponse>((resolve) => {
    const request = new ProjectRequest();
    request.setId(prjId);

    CLIENT.saveProject(request, (err, res) => {
      if (err) {
        resolve({ status: false, error: errorFmt(err) });
      } else {
        const code = res.getStatus().getCode();
        if (code == StatusCode.ERROR) {
          resolve({
              status: false,
              error: errorFmt(res.getStatus().getError()),
          });
          return;
        }

        fs.writeFileSync(filePath, res.getData());
        resolve({ status: true });
      }
    });
  });
}

export const handleSaveProject = async (
  _event: IpcMainInvokeEvent,
  prjId: string
): Promise<ApiResponse> => {
  if (CLIENT == null)
    return { status: false, error: "Not connected to the server" };

  if (CURRENT_PROJECT_FILEPATH == "") 
    return { status: false, error: "No filepath known for open project" };

  return await saveProject(prjId, CURRENT_PROJECT_FILEPATH);
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
  CURRENT_PROJECT_FILEPATH = "";
  return await closeProject(prjId);
};
