import { IpcMainInvokeEvent } from "electron";
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import {
  CaptureSrvMsg,
  ConfigFilesResponse,
  NodeInterfaceRequest,
  NodeRequest,
  StatusCode,
} from "../proto/netem_pb";
import { CLIENT } from "./client";
import { getOptions } from "./options";
import { decodeB64, findExecutable } from "./utils";


const consoleCmd = (prjId: string, nodeId: string) => {
  const termCmd = getOptions().consoleExternalCmd
  const cmd = `gonetem-console console ${prjId}.${nodeId}`;
  return new Function('name', 'cmd', 'return `' + termCmd + '`;')(nodeId, cmd)
};



function readNodeConfigFiles(
  prjId: string,
  nodeId: string
): Promise<ConfigFilesApiResponse> {
  const errorFmt = (err: string) =>
    `Unable to read config files of node '${prjId}.${nodeId}': ${err}`;

  return new Promise<ConfigFilesApiResponse>((resolve) => {
    const request = new NodeRequest();
    request.setPrjid(prjId);
    request.setNode(nodeId);

    CLIENT.readConfigFiles(request, (err, res) => {
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
                running: res.getSource() == ConfigFilesResponse.Source.RUNNING,
                files: res.getFilesList().map((f) => {
                  return {
                    name: f.getName(),
                    data: decodeB64(f.getData_asB64()),
                  };
                }),
              },
            });
      }
    });
  });
}

export const handleReadNodeConfigFiles = async (
  _event: IpcMainInvokeEvent,
  prjId: string,
  nodeId: string
): Promise<ConfigFilesApiResponse> => {
  if (CLIENT == null)
    return { status: false, error: "Not connected to the server" };

  return await readNodeConfigFiles(prjId, nodeId);
};


function runNodeConsole(
  prjId: string,
  nodeId: string
): Promise<ApiResponse> {
  const errorFmt = (err: string) =>
    `Unable to run console for node '${prjId}.${nodeId}': ${err}`;

  return new Promise<ApiResponse>((resolve) => {
    const cmd = consoleCmd(prjId, nodeId);
    const process = spawn(cmd, {shell: true});
    process.on('error', (err) => {
      resolve({ status: false, error: errorFmt(err.message) });
    });
    process.on('spawn', () => { resolve({ status: true })});
  });
}

export const handleRunNodeConsole = async (
  _event: IpcMainInvokeEvent,
  prjId: string,
  nodeId: string
): Promise<ConfigFilesApiResponse> => {
  if (CLIENT == null)
    return { status: false, error: "Not connected to the server" };

  return await runNodeConsole(prjId, nodeId);
};

function nodeStart(
  prjId: string,
  nodeId: string
): Promise<ApiResponse> {
  const errorFmt = (err: string) =>
    `Unable to start node '${prjId}.${nodeId}': ${err}`;

  return new Promise<ApiResponse>((resolve) => {
    const request = new NodeRequest();
    request.setPrjid(prjId);
    request.setNode(nodeId);

    CLIENT.start(request, (err, res) => {
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

export const handleNodeStart = async (
  _event: IpcMainInvokeEvent,
  prjId: string,
  nodeId: string
): Promise<ConfigFilesApiResponse> => {
  if (CLIENT == null)
    return { status: false, error: "Not connected to the server" };

  return await nodeStart(prjId, nodeId);
};

function nodeStop(
  prjId: string,
  nodeId: string
): Promise<ApiResponse> {
  const errorFmt = (err: string) =>
    `Unable to stop node '${prjId}.${nodeId}': ${err}`;

  return new Promise<ApiResponse>((resolve) => {
    const request = new NodeRequest();
    request.setPrjid(prjId);
    request.setNode(nodeId);

    CLIENT.stop(request, (err, res) => {
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

export const handleNodeStop = async (
  _event: IpcMainInvokeEvent,
  prjId: string,
  nodeId: string
): Promise<ConfigFilesApiResponse> => {
  if (CLIENT == null)
    return { status: false, error: "Not connected to the server" };

  return await nodeStop(prjId, nodeId);
};

function nodeRestart(
  prjId: string,
  nodeId: string
): Promise<ApiResponse> {
  const errorFmt = (err: string) =>
    `Unable to restart node '${prjId}.${nodeId}': ${err}`;

  return new Promise<ApiResponse>((resolve) => {
    const request = new NodeRequest();
    request.setPrjid(prjId);
    request.setNode(nodeId);

    CLIENT.restart(request, (err, res) => {
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

export const handleNodeRestart = async (
  _event: IpcMainInvokeEvent,
  prjId: string,
  nodeId: string
): Promise<ConfigFilesApiResponse> => {
  if (CLIENT == null)
    return { status: false, error: "Not connected to the server" };

  return await nodeRestart(prjId, nodeId);
};

function nodeCapture(
  prjId: string,
  nodeId: string,
  interfaceId: number,
): Promise<ApiResponse> {
  const errorFmt = (err: string) =>
    `Unable to start capture on if '${nodeId}.${interfaceId}': ${err}`;

  return new Promise<ApiResponse>(async (resolve) => {
    const wiresharkPath = await findExecutable("wireshark");
    if (wiresharkPath == null) {
      resolve({status: false, error: errorFmt("Wireshark is not found")});
      return;
    }

    const request = new NodeInterfaceRequest();
    request.setPrjid(prjId);
    request.setNode(nodeId);
    request.setIfindex(interfaceId);

    let captureProcess:ChildProcessWithoutNullStreams | null = null;

    const captureStream = CLIENT.capture(request);
    captureStream.on('data', (msg: CaptureSrvMsg) => {
      if (captureProcess == null) {
        const args = ["-o", `gui.window_title:${nodeId}@${interfaceId}`, "-k", "-i", "-"]
        captureProcess = spawn(wiresharkPath, args);
        captureProcess.on("spawn", () => resolve({status: true}));
        captureProcess.on('error', (err) => {
          resolve({ status: false, error: errorFmt(err.message) });
        });
      } else {
        switch (msg.getCode()) {
          case CaptureSrvMsg.Code.ERROR:
            captureProcess.kill();
            break;
          case CaptureSrvMsg.Code.STDOUT:
            captureProcess.stdin.write(msg.getData());
            break;
        }
      }
    });
    captureStream.on('error', (err: Error) => {
      if (captureProcess != null) captureProcess.kill();
      resolve({status: false, error: errorFmt(err.message)})
    });
  });
}

export const handleNodeCapture = async (
  _event: IpcMainInvokeEvent,
  prjId: string,
  nodeId: string,
  interfaceId: number,
): Promise<ConfigFilesApiResponse> => {
  if (CLIENT == null)
    return { status: false, error: "Not connected to the server" };

  return await nodeCapture(prjId, nodeId, interfaceId);
};
