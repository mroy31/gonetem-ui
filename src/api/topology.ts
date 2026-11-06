import { dialog, IpcMainInvokeEvent } from "electron";
import { writeFile } from 'fs/promises';
import { ProjectRequest, TopologyRunMsg, WNetworkRequest } from "../proto/netem_pb";
import { CLIENT } from "./client";
import type { NetemClient } from "../proto/netem_grpc_pb";
import { readStatusError } from "./utils";
import { mainWindow } from "..";

function readTopologyFile(client: NetemClient, prjId: string): Promise<FileApiResponse> {
  const errorFmt = (err: string) =>
    `Unable to read topology of project '${prjId}': ${err}`;

  return new Promise<FileApiResponse>((resolve) => {
    const request = new ProjectRequest();
    request.setId(prjId);

    client.readNetworkFile(request, (err, res) => {
      if (err) {
        resolve({ status: false, error: errorFmt(err) });
      } else {
        const statusErr = readStatusError(res);
        statusErr != null
          ? resolve({ status: false, error: errorFmt(statusErr) })
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

  return await readTopologyFile(CLIENT, prjId);
};

function writeTopologyFile(client: NetemClient, prjId: string, data: string): Promise<ApiResponse> {
  const errorFmt = (err: string) =>
    `Unable to write topology of project '${prjId}': ${err}`;

  return new Promise<ApiResponse>((resolve) => {
    const request = new WNetworkRequest();
    request.setId(prjId);
    request.setData(Buffer.from(data).toString('base64'));

    client.writeNetworkFile(request, (err, res) => {
      if (err) {
        resolve({ status: false, error: errorFmt(err) });
      } else {
        const statusErr = readStatusError(res);
        statusErr != null
          ? resolve({ status: false, error: errorFmt(statusErr) })
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
): Promise<ApiResponse> => {
  if (CLIENT == null)
    return { status: false, error: "Not connected to the server" };

  return await writeTopologyFile(CLIENT, prjId, data);
};

function checkTopologyFile(client: NetemClient, prjId: string): Promise<ApiResponse> {
  const errorFmt = (err: string) =>
    `Unable to check topology of project '${prjId}': ${err}`;

  return new Promise<ApiResponse>((resolve) => {
    const request = new ProjectRequest();
    request.setId(prjId);

    client.topologyCheck(request, (err, res) => {
      if (err) {
        resolve({ status: false, error: errorFmt(err) });
      } else {
        const statusErr = readStatusError(res);
        statusErr != null
          ? resolve({
              status: false,
              error: statusErr,
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

  return await checkTopologyFile(CLIENT, prjId);
};

function runTopology(client: NetemClient, prjId: string): Promise<ApiResponse> {
  const errorFmt = (err: string) =>
    `Unable to run topology of project '${prjId}': ${err}`;

  return new Promise<ApiResponse>((resolve) => {
    const request = new ProjectRequest();
    request.setId(prjId);

    const stub = client.topologyRun(request)
    stub.on('status', () => { resolve({ status: true }); });
    stub.on('data', (data: TopologyRunMsg) => { mainWindow.webContents.send("topology:run:event", data.toObject()); });
    stub.on('error', (e: Error) => {
      resolve({
        status: false,
        error: errorFmt(e.message)
      })
    });
  });
}

export const handleRunTopology = async (
  _event: IpcMainInvokeEvent,
  prjId: string,
): Promise<ApiResponse> => {
  if (CLIENT == null)
    return { status: false, error: "Not connected to the server" };

  return await runTopology(CLIENT, prjId);
};

function reloadTopology(client: NetemClient, prjId: string): Promise<ApiResponse> {
  const errorFmt = (err: string) =>
    `Unable to reload topology of project '${prjId}': ${err}`;

  return new Promise<ApiResponse>((resolve) => {
    const request = new ProjectRequest();
    request.setId(prjId);

    const stub = client.topologyReload(request);
    stub.on('status', () => { resolve({ status: true }); });
    stub.on('data', (data: TopologyRunMsg) => { mainWindow.webContents.send("topology:run:event", data.toObject()); });
    stub.on('error', (e: Error) => {
      resolve({
        status: false,
        error: errorFmt(e.message)
      })
    });
  });
}

export const handleReloadTopology = async (
  _event: IpcMainInvokeEvent,
  prjId: string,
): Promise<ApiResponse> => {
  if (CLIENT == null)
    return { status: false, error: "Not connected to the server" };

  return await reloadTopology(CLIENT, prjId);
};

export const handleRecordTopologyImg = async (_event: IpcMainInvokeEvent, data: Buffer): Promise<ApiResponse> => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: "Record topology image",
    message: "Set folder/name to save image",
    defaultPath: "topology.png",
    properties: ['createDirectory'], 
    filters: [
      { name: "PNG files", extensions: ["png"] },
      { name: "All files", extensions: ["*"] }
    ]
  });

  if (canceled) {
    return { status: false, error: "Save dialog canceled" };
  }

  try {
    await writeFile(filePath, data, 'binary');
    return {status: true};
  } catch (err) {
    return {status: false, error: err.message};
  }
}
