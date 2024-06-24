
import { IpcMainInvokeEvent } from "electron";
import * as grpc from "@grpc/grpc-js";
import {
  ConsoleCltMsg,
  ConsoleSrvMsg,
} from "../proto/netem_pb";
import { mainWindow } from "..";
import { CLIENT } from "./client";
import { CURRENT_PROJECT_ID } from "./project";

let RUNNING_CONSOLES = new Map<string, grpc.ClientDuplexStream<ConsoleCltMsg, ConsoleSrvMsg>>();
let CONSOLE_STATES = new Map<string, string>();

export function closeRunningConsoles() {
  for (const key of RUNNING_CONSOLES.keys()) {
    try {
      RUNNING_CONSOLES.get(key).destroy();
    } catch (err) { } finally {
      RUNNING_CONSOLES.delete(key);
    }
  }
  CONSOLE_STATES.clear();
}

function runNodeInternalConsole(
  nodeId: string
): Promise<StringApiResponse> {
  const errorFmt = (err: string) =>
    `Unable to run internal console for node ${nodeId}: ${err}`;

  return new Promise<StringApiResponse>((resolve) => {
    if (RUNNING_CONSOLES.has(nodeId)) {
      resolve({status: true, result: CONSOLE_STATES.has(nodeId) ? CONSOLE_STATES.get(nodeId) : ""}); 
      return;
    }

    const msg = new ConsoleCltMsg();
    msg.setCode(ConsoleCltMsg.Code.INIT);
    msg.setPrjid(CURRENT_PROJECT_ID);
    msg.setNode(nodeId);
    msg.setShell(false);

    RUNNING_CONSOLES.set(nodeId, CLIENT.nodeConsole());
    RUNNING_CONSOLES.get(nodeId).on("data", (data: ConsoleSrvMsg) => {
      switch (data.getCode()) {
        case ConsoleSrvMsg.Code.CLOSE:
          mainWindow.webContents.send(`console:close:${nodeId}`);
          RUNNING_CONSOLES.delete(nodeId);
          CONSOLE_STATES.delete(nodeId);
          break;
        case ConsoleSrvMsg.Code.ERROR:
          mainWindow.webContents.send(`console:error:${nodeId}`, data.getData());
          RUNNING_CONSOLES.delete(nodeId);
          CONSOLE_STATES.delete(nodeId);
          break;
        case ConsoleSrvMsg.Code.STDOUT:
          mainWindow.webContents.send(`console:stdout:${nodeId}`, Buffer.from(data.getData_asB64(), "base64").toString())
          break;
        case ConsoleSrvMsg.Code.STDERR:
          mainWindow.webContents.send(`console:stderr:${nodeId}`, Buffer.from(data.getData_asB64(), "base64").toString())
          break;

      }
    });
    RUNNING_CONSOLES.get(nodeId).on('error', function(e) {
      mainWindow.webContents.send(`console:error:${nodeId}`, e)
      if (RUNNING_CONSOLES.has(nodeId)) {
        RUNNING_CONSOLES.get(nodeId).destroy()
        RUNNING_CONSOLES.delete(nodeId);
      }
      CONSOLE_STATES.delete(nodeId);
    });

    RUNNING_CONSOLES.get(nodeId).write(msg, (error: Error) => { 
      if (error) {
        RUNNING_CONSOLES.delete(nodeId);
        CONSOLE_STATES.delete(nodeId);
        resolve({status: false, error: errorFmt(error.message)})
        return;
      }

      resolve({status: true, result: ""}) 
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

  return await runNodeInternalConsole(nodeId);
};

const writeInternalConsole = (
  nodeId: string,
  data: string,
): Promise<ApiResponse> => {
  const errorFmt = (err: string) =>
    `Unable to write data on console for node ${nodeId} : ${err}`;

  return new Promise<ApiResponse>((resolve) => {
    const msg = new ConsoleCltMsg();
    msg.setCode(ConsoleCltMsg.Code.DATA);
    msg.setData(Buffer.from(data).toString('base64'));

    RUNNING_CONSOLES.get(nodeId).write(msg, (error: Error) => { 
      error
        ? resolve({status: false, error: errorFmt(error.message)})
        : resolve({status: true}) 
    });
  });
}

export const handleWriteInternalConsole = async (
  _event: IpcMainInvokeEvent,
  nodeId: string,
  data: string,
): Promise<ApiResponse> => {
  if (CLIENT == null)
    return { status: false, error: "Not connected to the server" };

  if (!RUNNING_CONSOLES.has(nodeId))
    return { status: false, error: "Not connected to the server" };

  return await writeInternalConsole(nodeId, data);
}

const resizeInternalConsole = (
  nodeId: string,
  width: number,
  height: number,
): Promise<ApiResponse> => {
  const errorFmt = (err: string) =>
    `Unable to resize console for node ${nodeId}: ${err}`;

  return new Promise<ApiResponse>((resolve) => {
    const msg = new ConsoleCltMsg();
    msg.setCode(ConsoleCltMsg.Code.RESIZE);
    msg.setTtyheight(height);
    msg.setTtywidth(width);

    RUNNING_CONSOLES.get(nodeId).write(msg, (error: Error) => { 
      error
        ? resolve({status: false, error: errorFmt(error.message)})
        : resolve({status: true}) 
    });
  });
}

export const handleResizeInternalConsole = async (
  _event: IpcMainInvokeEvent,
  nodeId: string,
  width: number,
  height: number,
): Promise<ApiResponse> => {
  if (CLIENT == null)
    return { status: false, error: "Not connected to the server" };

  if (!RUNNING_CONSOLES.has(nodeId))
    return { status: false, error: "Not connected to the server" };


  return await resizeInternalConsole(nodeId, width, height);
}

const saveConsoleState = (
  nodeId: string,
  state: string,
): Promise<ApiResponse> => {
  return new Promise<ApiResponse>((resolve) => {
    CONSOLE_STATES.set(nodeId, state);
    resolve({status: true});
  });
}

export const handleSaveConsoleState = async (
  _event: IpcMainInvokeEvent,
  nodeId: string,
  state: string,
): Promise<StringListApiResponse> => {
  if (CLIENT == null)
    return { status: false, error: "Not connected to the server" };

  return await saveConsoleState(nodeId, state);
}

const listOpenConsoles = (
): Promise<StringListApiResponse> => {
  return new Promise<StringListApiResponse>((resolve) => {
    const openConsoles: string[] = [];
    for (let key of RUNNING_CONSOLES.keys())
      openConsoles.push(key)

    resolve({status: true, result: openConsoles});
  });
}

export const handleListOpenConsoles = async (
  _event: IpcMainInvokeEvent,
): Promise<StringListApiResponse> => {
  if (CLIENT == null)
    return { status: false, error: "Not connected to the server" };

  return await listOpenConsoles();
}
