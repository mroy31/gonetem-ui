import { IpcMainInvokeEvent } from "electron";
import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import {
  CaptureSrvMsg,
  ConfigFilesResponse,
  IfState,
  NodeIfStateRequest,
  NodeInterfaceRequest,
  NodeRequest,
  StatusCode,
} from "../proto/netem_pb";
import { CLIENT } from "./client";
import { getOptions } from "./options";
import { decodeB64, findExecutable } from "./utils";

const consoleCmd = async (
  prjId: string,
  nodeId: string,
  shell: boolean
): Promise<string | null> => {
  const termCmd = getOptions().consoleExternalCmd;
  // find term exe
  const termArgs = termCmd.split(" ");
  const termExe = await findExecutable(termArgs[0]);
  if (termExe == null) return null;

  const fullTermCmd =
    termExe + " " + termArgs.slice(1, termArgs.length).join(" ");
  const cmd = `gonetem-console console ${
    shell ? "--shell " : ""
  }${prjId}.${nodeId}`;
  return new Function("name", "cmd", "return `" + fullTermCmd + "`;")(
    nodeId,
    cmd
  );
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

    CLIENT.nodeReadConfigFiles(request, (err, res) => {
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
  nodeId: string,
  shell: boolean
): Promise<ApiResponse> {
  const errorFmt = (err: string) =>
    `Unable to run console for node '${prjId}.${nodeId}': ${err}`;

  return new Promise<ApiResponse>((resolve) => {
    consoleCmd(prjId, nodeId, shell).then((cmd) => {
      if (cmd == null)
        resolve({
          status: false,
          error: "Term command defined in option not found",
        });

      const process = spawn(cmd, { shell: true });
      process.on("error", (err) => {
        resolve({ status: false, error: errorFmt(err.message) });
      });
      process.on("spawn", () => {
        resolve({ status: true });
      });
    });
  });
}

export const handleRunNodeConsole = async (
  _event: IpcMainInvokeEvent,
  prjId: string,
  nodeId: string,
  shell: boolean
): Promise<ConfigFilesApiResponse> => {
  if (CLIENT == null)
    return { status: false, error: "Not connected to the server" };

  return await runNodeConsole(prjId, nodeId, shell);
};

function nodeStart(prjId: string, nodeId: string): Promise<ApiResponse> {
  const errorFmt = (err: string) =>
    `Unable to start node '${prjId}.${nodeId}': ${err}`;

  return new Promise<ApiResponse>((resolve) => {
    const request = new NodeRequest();
    request.setPrjid(prjId);
    request.setNode(nodeId);

    CLIENT.nodeStart(request, (err, res) => {
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

function nodeStop(prjId: string, nodeId: string): Promise<ApiResponse> {
  const errorFmt = (err: string) =>
    `Unable to stop node '${prjId}.${nodeId}': ${err}`;

  return new Promise<ApiResponse>((resolve) => {
    const request = new NodeRequest();
    request.setPrjid(prjId);
    request.setNode(nodeId);

    CLIENT.nodeStop(request, (err, res) => {
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

function nodeRestart(prjId: string, nodeId: string): Promise<ApiResponse> {
  const errorFmt = (err: string) =>
    `Unable to restart node '${prjId}.${nodeId}': ${err}`;

  return new Promise<ApiResponse>((resolve) => {
    const request = new NodeRequest();
    request.setPrjid(prjId);
    request.setNode(nodeId);

    CLIENT.nodeRestart(request, (err, res) => {
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

function nodeSetIfState(
  prjId: string,
  nodeId: string,
  interfaceId: number,
  up: boolean
): Promise<ApiResponse> {
  const errorFmt = (err: string) =>
    `Unable to change state on if '${nodeId}.${interfaceId}': ${err}`;

  return new Promise<ApiResponse>((resolve) => {
    const request = new NodeIfStateRequest();
    request.setPrjid(prjId);
    request.setNode(nodeId);
    request.setIfindex(interfaceId);
    request.setState(up ? IfState.UP : IfState.DOWN);

    CLIENT.nodeSetIfState(request, (err, res) => {
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

export const handleNodeSetIfState = async (
  _event: IpcMainInvokeEvent,
  prjId: string,
  nodeId: string,
  interfaceId: number,
  up: boolean
): Promise<ApiResponse> => {
  if (CLIENT == null)
    return { status: false, error: "Not connected to the server" };

  return await nodeSetIfState(prjId, nodeId, interfaceId, up);
};

function nodeCapture(
  prjId: string,
  nodeId: string,
  interfaceId: number
): Promise<ApiResponse> {
  const errorFmt = (err: string) =>
    `Unable to start capture on if '${nodeId}.${interfaceId}': ${err}`;

  return new Promise<ApiResponse>((resolve) => {
    findExecutable("wireshark").then((wiresharkPath) => {
      if (wiresharkPath == null) {
        resolve({ status: false, error: errorFmt("Wireshark is not found") });
        return;
      }

      const request = new NodeInterfaceRequest();
      request.setPrjid(prjId);
      request.setNode(nodeId);
      request.setIfindex(interfaceId);

      let captureProcess: ChildProcessWithoutNullStreams | null = null;

      const captureStream = CLIENT.nodeCapture(request);
      captureStream.on("data", (msg: CaptureSrvMsg) => {
        if (captureProcess == null) {
          const args = [
            "-o",
            `gui.window_title:${nodeId}@${interfaceId}`,
            "-k",
            "-i",
            "-",
          ];
          captureProcess = spawn(wiresharkPath, args);
          captureProcess.on("spawn", () => resolve({ status: true }));
          captureProcess.on("error", (err) => {
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
      captureStream.on("error", (err: Error) => {
        if (captureProcess != null) captureProcess.kill();
        resolve({ status: false, error: errorFmt(err.message) });
      });
    });
  });
}

export const handleNodeCapture = async (
  _event: IpcMainInvokeEvent,
  prjId: string,
  nodeId: string,
  interfaceId: number
): Promise<ConfigFilesApiResponse> => {
  if (CLIENT == null)
    return { status: false, error: "Not connected to the server" };

  return await nodeCapture(prjId, nodeId, interfaceId);
};
