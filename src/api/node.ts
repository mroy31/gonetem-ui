import { IpcMainInvokeEvent } from "electron";
import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import {
  CaptureSrvMsg,
  ConfigFilesResponse,
  IfState,
  NodeIfStateRequest,
  NodeInterfaceRequest,
  NodeRequest,
  ProjectRequest,
} from "../proto/netem_pb";
import { CLIENT } from "./client";
import type { NetemClient } from "../proto/netem_grpc_pb";
import { getOptions } from "./options";
import { decodeB64, findExecutable, readStatusError } from "./utils";

const consoleCmd = async (
  prjId: string,
  nodeId: string,
  shell: boolean
): Promise<string | null> => {
  const termCmd = getOptions().consoleExternalCmd;
  // find term exe
  const termArgs = termCmd.split(" ");
  const termExe = termCmd.startsWith("/")
    ? termArgs[0]
    : await findExecutable(termArgs[0]);
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
  client: NetemClient,
  prjId: string,
  nodeId: string
): Promise<ConfigFilesApiResponse> {
  const errorFmt = (err: string) =>
    `Unable to read config files of node '${prjId}.${nodeId}': ${err}`;

  return new Promise<ConfigFilesApiResponse>((resolve) => {
    const request = new NodeRequest();
    request.setPrjid(prjId);
    request.setNode(nodeId);

    client.nodeReadConfigFiles(request, (err, res) => {
      if (err) {
        resolve({ status: false, error: errorFmt(err) });
      } else {
        const statusErr = readStatusError(res);
        statusErr != null
          ? resolve({ status: false, error: errorFmt(statusErr) })
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

  return await readNodeConfigFiles(CLIENT, prjId, nodeId);
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
      if (cmd == null) {
        resolve({
          status: false,
          error: "Term command defined in option not found",
        });
        return;
      }

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
): Promise<ApiResponse> => {
  if (CLIENT == null)
    return { status: false, error: "Not connected to the server" };

  return await runNodeConsole(prjId, nodeId, shell);
};

function runAllConsoles(client: NetemClient, prjId: string, shell: boolean): Promise<ApiResponse> {
  const errorFmt = (err: string) => `Unable to run console: ${err}`;
  return new Promise<ApiResponse>((resolve) => {
    const request = new ProjectRequest();
    request.setId(prjId);

    client.projectGetStatus(request, (err, res) => {
      if (err) {
        resolve({ status: false, error: err });
        return;
      }

      const statusErr = readStatusError(res);
      if (statusErr != null) {
        resolve({ status: false, error: errorFmt(statusErr) });
        return;
      }

      const promiseList: Promise<{ error: string; nodeId: string }>[] = [];
      for (const node of res.getNodesList()) {
        if (!node.getRunning()) continue;

        promiseList.push(
          new Promise<{ error: string; nodeId: string }>((nResolve) => {
            consoleCmd(prjId, node.getName(), shell).then((cmd) => {
              if (cmd == null) {
                nResolve({
                  nodeId: node.getName(),
                  error: "Term command defined in option not found",
                });
                return;
              }

              const process = spawn(cmd, { shell: true });
              process.on("error", (err) => {
                nResolve({
                  nodeId: node.getName(),
                  error: errorFmt(err.message),
                });
              });
              process.on("spawn", () => {
                nResolve({ nodeId: node.getName(), error: "" });
              });
            });
          })
        );
      }

      Promise.all(promiseList).then((values) => {
        for (const v of values) {
          if (v.error != "") {
            resolve({ status: false, error: err });
            return;
          }
        }
        resolve({ status: true });
      });
    });
  });
}

export const handleRunAllConsoles = async (
  _event: IpcMainInvokeEvent,
  prjId: string,
  shell: boolean
): Promise<ApiResponse> => {
  if (CLIENT == null)
    return { status: false, error: "Not connected to the server" };

  return await runAllConsoles(CLIENT, prjId, shell);
};

function nodeStart(client: NetemClient, prjId: string, nodeId: string): Promise<ApiResponse> {
  const errorFmt = (err: string) =>
    `Unable to start node '${prjId}.${nodeId}': ${err}`;

  return new Promise<ApiResponse>((resolve) => {
    const request = new NodeRequest();
    request.setPrjid(prjId);
    request.setNode(nodeId);

    client.nodeStart(request, (err, res) => {
      if (err) {
        resolve({ status: false, error: errorFmt(err) });
      } else {
        const statusErr = readStatusError(res);
        statusErr != null
          ? resolve({ status: false, error: errorFmt(statusErr) })
          : resolve({ status: true });
      }
    });
  });
}

export const handleNodeStart = async (
  _event: IpcMainInvokeEvent,
  prjId: string,
  nodeId: string
): Promise<ApiResponse> => {
  if (CLIENT == null)
    return { status: false, error: "Not connected to the server" };

  return await nodeStart(CLIENT, prjId, nodeId);
};

function nodeStop(client: NetemClient, prjId: string, nodeId: string): Promise<ApiResponse> {
  const errorFmt = (err: string) =>
    `Unable to stop node '${prjId}.${nodeId}': ${err}`;

  return new Promise<ApiResponse>((resolve) => {
    const request = new NodeRequest();
    request.setPrjid(prjId);
    request.setNode(nodeId);

    client.nodeStop(request, (err, res) => {
      if (err) {
        resolve({ status: false, error: errorFmt(err) });
      } else {
        const statusErr = readStatusError(res);
        statusErr != null
          ? resolve({ status: false, error: errorFmt(statusErr) })
          : resolve({ status: true });
      }
    });
  });
}

export const handleNodeStop = async (
  _event: IpcMainInvokeEvent,
  prjId: string,
  nodeId: string
): Promise<ApiResponse> => {
  if (CLIENT == null)
    return { status: false, error: "Not connected to the server" };

  return await nodeStop(CLIENT, prjId, nodeId);
};

function nodeRestart(client: NetemClient, prjId: string, nodeId: string): Promise<ApiResponse> {
  const errorFmt = (err: string) =>
    `Unable to restart node '${prjId}.${nodeId}': ${err}`;

  return new Promise<ApiResponse>((resolve) => {
    const request = new NodeRequest();
    request.setPrjid(prjId);
    request.setNode(nodeId);

    client.nodeRestart(request, (err, res) => {
      if (err) {
        resolve({ status: false, error: errorFmt(err) });
      } else {
        const statusErr = readStatusError(res);
        statusErr != null
          ? resolve({ status: false, error: errorFmt(statusErr) })
          : resolve({ status: true });
      }
    });
  });
}

export const handleNodeRestart = async (
  _event: IpcMainInvokeEvent,
  prjId: string,
  nodeId: string
): Promise<ApiResponse> => {
  if (CLIENT == null)
    return { status: false, error: "Not connected to the server" };

  return await nodeRestart(CLIENT, prjId, nodeId);
};

function nodeSetIfState(
  client: NetemClient,
  
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

    client.nodeSetIfState(request, (err, res) => {
      if (err) {
        resolve({ status: false, error: errorFmt(err) });
      } else {
        const statusErr = readStatusError(res);
        statusErr != null
          ? resolve({ status: false, error: errorFmt(statusErr) })
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

  return await nodeSetIfState(CLIENT, prjId, nodeId, interfaceId, up);
};

function nodeCapture(
  client: NetemClient,
  
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

      const captureStream = client.nodeCapture(request);
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
): Promise<ApiResponse> => {
  if (CLIENT == null)
    return { status: false, error: "Not connected to the server" };

  return await nodeCapture(CLIENT, prjId, nodeId, interfaceId);
};
