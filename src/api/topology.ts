import { IpcMainInvokeEvent } from "electron";
import { ProjectRequest, StatusCode, WNetworkRequest } from "../proto/netem_pb";
import { CLIENT } from "./client";

function readTopologyFile(prjId: string): Promise<FileApiResponse> {
  const errorFmt = (err: string) =>
    `Unable to read topology of project '${prjId}': ${err}`;

  return new Promise<FileApiResponse>((resolve) => {
    const request = new ProjectRequest();
    request.setId(prjId);

    CLIENT.readNetworkFile(request, (err, res) => {
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
            result: Buffer.from(res.getData_asB64(), 'base64').toString('utf8') 
          });
      }
    });
  });
}

export const handleReadTopologyFile = async (
  _event: IpcMainInvokeEvent,
  prjId: string
): Promise<FileApiResponse> => {
  if (CLIENT == null)
    return { status: false, error: "Not connected to the server" };

  return await readTopologyFile(prjId);
};

function writeTopologyFile(prjId: string, data: string): Promise<ApiResponse> {
  const errorFmt = (err: string) =>
    `Unable to write topology of project '${prjId}': ${err}`;

  return new Promise<ApiResponse>((resolve) => {
    const request = new WNetworkRequest();
    request.setId(prjId);
    request.setData(data);

    CLIENT.writeNetworkFile(request, (err, res) => {
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
          });
      }
    });
  });
}

export const handleWriteTopologyFile = async (
  _event: IpcMainInvokeEvent,
  prjId: string,
  data: string,
): Promise<FileApiResponse> => {
  if (CLIENT == null)
    return { status: false, error: "Not connected to the server" };

  return await writeTopologyFile(prjId, data);
};

function checkTopologyFile(prjId: string): Promise<ApiResponse> {
  const errorFmt = (err: string) =>
    `Unable to check topology of project '${prjId}': ${err}`;

  return new Promise<ApiResponse>((resolve) => {
    const request = new ProjectRequest();
    request.setId(prjId);

    CLIENT.check(request, (err, res) => {
      if (err) {
        resolve({ status: false, error: errorFmt(err) });
      } else {
        const code = res.getStatus().getCode();
        code == StatusCode.ERROR
          ? resolve({
              status: false,
              error: res.getStatus().getError(),
            })
          : resolve({ 
            status: true,
          });
      }
    });
  });
}

export const handleCheckTopologyFile = async (
  _event: IpcMainInvokeEvent,
  prjId: string,
): Promise<ApiResponse> => {
  if (CLIENT == null)
    return { status: false, error: "Not connected to the server" };

  return await checkTopologyFile(prjId);
};

function runTopology(prjId: string): Promise<ApiResponse> {
  const errorFmt = (err: string) =>
    `Unable to run topology of project '${prjId}': ${err}`;

  return new Promise<ApiResponse>((resolve) => {
    const request = new ProjectRequest();
    request.setId(prjId);

    CLIENT.run(request, (err, res) => {
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
          });
      }
    });
  });
}

export const handleRunTopology = async (
  _event: IpcMainInvokeEvent,
  prjId: string,
): Promise<ApiResponse> => {
  if (CLIENT == null)
    return { status: false, error: "Not connected to the server" };

  return await runTopology(prjId);
};

function reloadTopology(prjId: string): Promise<ApiResponse> {
  const errorFmt = (err: string) =>
    `Unable to reload topology of project '${prjId}': ${err}`;

  return new Promise<ApiResponse>((resolve) => {
    const request = new ProjectRequest();
    request.setId(prjId);

    CLIENT.reload(request, (err, res) => {
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
          });
      }
    });
  });
}

export const handleReloadTopology = async (
  _event: IpcMainInvokeEvent,
  prjId: string,
): Promise<ApiResponse> => {
  if (CLIENT == null)
    return { status: false, error: "Not connected to the server" };

  return await reloadTopology(prjId);
};
