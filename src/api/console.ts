import { IpcMainInvokeEvent } from "electron";
import * as grpc from "@grpc/grpc-js";
import { ConsoleCmdRequest, ExecCltMsg, ExecSrvMsg } from "../proto/netem_pb";
import { mainWindow } from "..";
import { CLIENT } from "./client";
import type { NetemClient } from "../proto/netem_grpc_pb";
import { CURRENT_PROJECT_ID } from "./project";

const RUNNING_CONSOLES = new Map<
  string,
  grpc.ClientDuplexStream<ExecCltMsg, ExecSrvMsg>
>();
const CONSOLE_STATES = new Map<string, string>();

export function closeRunningConsoles() {
  for (const [key, stream] of RUNNING_CONSOLES.entries()) {
    try {
      stream.destroy();
    } catch (_err) {
    } finally {
      RUNNING_CONSOLES.delete(key);
    }
  }
  CONSOLE_STATES.clear();
}

function runNodeInternalConsole(
  client: NetemClient,
  nodeId: string
): Promise<StringApiResponse> {
  const errorFmt = (err: string) =>
    `Unable to run internal console for node ${nodeId}: ${err}`;

  return new Promise<StringApiResponse>((resolve) => {
    if (RUNNING_CONSOLES.has(nodeId)) {
      resolve({
        status: true,
        result: CONSOLE_STATES.get(nodeId) ?? "",
      });
      return;
    }

    const cmdMsg = new ConsoleCmdRequest();
    cmdMsg.setPrjid(CURRENT_PROJECT_ID);
    cmdMsg.setNode(nodeId);
    cmdMsg.setShell(false);
    client.nodeGetConsoleCmd(cmdMsg, (err, res) => {
      if (err) {
        resolve({ status: false, error: errorFmt(err) });
      } else {
        const msg = new ExecCltMsg();
        msg.setCode(ExecCltMsg.Code.CMD);
        msg.setCmdList(res.getCmdList());
        msg.setPrjid(CURRENT_PROJECT_ID);
        msg.setNode(nodeId);
        msg.setTty(true);

        const execStream = client.nodeExec();
        RUNNING_CONSOLES.set(nodeId, execStream);
        execStream.on("data", (data: ExecSrvMsg) => {
          switch (data.getCode()) {
            case ExecSrvMsg.Code.CLOSE:
              mainWindow.webContents.send(`console:close:${nodeId}`);
              RUNNING_CONSOLES.delete(nodeId);
              CONSOLE_STATES.delete(nodeId);
              break;
            case ExecSrvMsg.Code.ERROR:
              mainWindow.webContents.send(
                `console:error:${nodeId}`,
                data.getData()
              );
              RUNNING_CONSOLES.delete(nodeId);
              CONSOLE_STATES.delete(nodeId);
              break;
            case ExecSrvMsg.Code.STDOUT:
              mainWindow.webContents.send(
                `console:stdout:${nodeId}`,
                Buffer.from(data.getData_asB64(), "base64").toString()
              );
              break;
            case ExecSrvMsg.Code.STDERR:
              mainWindow.webContents.send(
                `console:stderr:${nodeId}`,
                Buffer.from(data.getData_asB64(), "base64").toString()
              );
              break;
          }
        });
        execStream.on("error", function (e: Error) {
          mainWindow.webContents.send(`console:error:${nodeId}`, e);
          if (RUNNING_CONSOLES.has(nodeId)) {
            execStream.destroy();
            RUNNING_CONSOLES.delete(nodeId);
          }
          CONSOLE_STATES.delete(nodeId);
        });

        execStream.write(msg, (error: Error) => {
          if (error) {
            RUNNING_CONSOLES.delete(nodeId);
            CONSOLE_STATES.delete(nodeId);
            resolve({ status: false, error: errorFmt(error.message) });
            return;
          }

          resolve({ status: true, result: "" });
        });
      }
    });
  });
}

export const handleRunNodeInternalConsole = async (
  _event: IpcMainInvokeEvent,
  nodeId: string
): Promise<StringApiResponse> => {
  if (CLIENT == null)
    return { status: false, error: "Not connected to the server" };

  if (CURRENT_PROJECT_ID == "")
    return { status: false, error: "No open project" };

  return await runNodeInternalConsole(CLIENT, nodeId);
};

const writeInternalConsole = (
  execStream: grpc.ClientDuplexStream<ExecCltMsg, ExecSrvMsg>,
  nodeId: string,
  data: string
): Promise<ApiResponse> => {
  const errorFmt = (err: string) =>
    `Unable to write data on console for node ${nodeId} : ${err}`;

  return new Promise<ApiResponse>((resolve) => {
    const msg = new ExecCltMsg();
    msg.setCode(ExecCltMsg.Code.DATA);
    msg.setData(Buffer.from(data).toString("base64"));

    execStream.write(msg, (error: Error) => {
      error
        ? resolve({ status: false, error: errorFmt(error.message) })
        : resolve({ status: true });
    });
  });
};

export const handleWriteInternalConsole = async (
  _event: IpcMainInvokeEvent,
  nodeId: string,
  data: string
): Promise<ApiResponse> => {
  if (CLIENT == null)
    return { status: false, error: "Not connected to the server" };

  const execStream = RUNNING_CONSOLES.get(nodeId);
  if (execStream == null)
    return { status: false, error: "Not connected to the server" };

  return await writeInternalConsole(execStream, nodeId, data);
};

const resizeInternalConsole = (
  execStream: grpc.ClientDuplexStream<ExecCltMsg, ExecSrvMsg>,
  nodeId: string,
  width: number,
  height: number
): Promise<ApiResponse> => {
  const errorFmt = (err: string) =>
    `Unable to resize console for node ${nodeId}: ${err}`;

  return new Promise<ApiResponse>((resolve) => {
    const msg = new ExecCltMsg();
    msg.setCode(ExecCltMsg.Code.RESIZE);
    msg.setTtyheight(height);
    msg.setTtywidth(width);

    execStream.write(msg, (error: Error) => {
      error
        ? resolve({ status: false, error: errorFmt(error.message) })
        : resolve({ status: true });
    });
  });
};

export const handleResizeInternalConsole = async (
  _event: IpcMainInvokeEvent,
  nodeId: string,
  width: number,
  height: number
): Promise<ApiResponse> => {
  if (CLIENT == null)
    return { status: false, error: "Not connected to the server" };

  const execStream = RUNNING_CONSOLES.get(nodeId);
  if (execStream == null)
    return { status: false, error: "Not connected to the server" };

  return await resizeInternalConsole(execStream, nodeId, width, height);
};

const saveConsoleState = (
  nodeId: string,
  state: string
): Promise<ApiResponse> => {
  return new Promise<ApiResponse>((resolve) => {
    CONSOLE_STATES.set(nodeId, state);
    resolve({ status: true });
  });
};

export const handleSaveConsoleState = async (
  _event: IpcMainInvokeEvent,
  nodeId: string,
  state: string
): Promise<ApiResponse> => {
  if (CLIENT == null)
    return { status: false, error: "Not connected to the server" };

  return await saveConsoleState(nodeId, state);
};

const listOpenConsoles = (): Promise<StringListApiResponse> => {
  return new Promise<StringListApiResponse>((resolve) => {
    const openConsoles: string[] = [];
    for (const key of RUNNING_CONSOLES.keys()) openConsoles.push(key);

    resolve({ status: true, result: openConsoles });
  });
};

export const handleListOpenConsoles = async (
  _event: IpcMainInvokeEvent
): Promise<StringListApiResponse> => {
  if (CLIENT == null)
    return { status: false, error: "Not connected to the server" };

  return await listOpenConsoles();
};
