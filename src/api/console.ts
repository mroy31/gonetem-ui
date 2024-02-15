
import { IpcMainInvokeEvent } from "electron";
import * as grpc from "@grpc/grpc-js";
import {
  ConsoleCltMsg,
  ConsoleSrvMsg,
} from "../proto/netem_pb";
import { mainWindow } from "..";
import { CLIENT } from "./client";

let RUNNING_CONSOLE: grpc.ClientDuplexStream<ConsoleCltMsg, ConsoleSrvMsg> = null;

function runNodeInternalConsole(
  prjId: string,
  nodeId: string
): Promise<ApiResponse> {
  const errorFmt = (err: string) =>
    `Unable to run internal console for node '${prjId}.${nodeId}': ${err}`;

  return new Promise<ApiResponse>((resolve) => {
    const msg = new ConsoleCltMsg();
    msg.setCode(ConsoleCltMsg.Code.INIT);
    msg.setPrjid(prjId);
    msg.setNode(nodeId);
    msg.setShell(false);

    RUNNING_CONSOLE = CLIENT.console();
    RUNNING_CONSOLE.on("data", (data: ConsoleSrvMsg) => {
      switch (data.getCode()) {
        case ConsoleSrvMsg.Code.CLOSE:
          mainWindow.webContents.send("console:close");
          RUNNING_CONSOLE = null;
          break;
        case ConsoleSrvMsg.Code.ERROR:
          mainWindow.webContents.send("console:error", data.getData());
          RUNNING_CONSOLE = null;
          break;
        case ConsoleSrvMsg.Code.STDOUT:
          mainWindow.webContents.send("console:stdout", Buffer.from(data.getData_asB64(), "base64").toString())
          break;
        case ConsoleSrvMsg.Code.STDERR:
          mainWindow.webContents.send("console:stderr", Buffer.from(data.getData_asB64(), "base64").toString())
          break;

      }
    });
    RUNNING_CONSOLE.on('error', function(e) {
      mainWindow.webContents.send("console:error", e)
      RUNNING_CONSOLE.destroy()
      RUNNING_CONSOLE = null;
    });

    RUNNING_CONSOLE.write(msg, (error: Error) => { 
      error
        ? resolve({status: false, error: errorFmt(error.message)})
        : resolve({status: true}) 
    });
  });
}

export const handleRunNodeInternalConsole = async (
  _event: IpcMainInvokeEvent,
  prjId: string,
  nodeId: string
): Promise<ApiResponse> => {
  if (CLIENT == null)
    return { status: false, error: "Not connected to the server" };

  if (RUNNING_CONSOLE != null) {
    RUNNING_CONSOLE.destroy();
    RUNNING_CONSOLE = null;
  }

  return await runNodeInternalConsole(prjId, nodeId);
};

const writeInternalConsole = (
  data: string,
): Promise<ApiResponse> => {
  const errorFmt = (err: string) =>
    `Unable to write data on console : ${err}`;

  return new Promise<ApiResponse>((resolve) => {
    const msg = new ConsoleCltMsg();
    msg.setCode(ConsoleCltMsg.Code.DATA);
    msg.setData(Buffer.from(data).toString('base64'));

    RUNNING_CONSOLE.write(msg, (error: Error) => { 
      error
        ? resolve({status: false, error: errorFmt(error.message)})
        : resolve({status: true}) 
    });
  });
}

export const handleWriteInternalConsole = async (
  _event: IpcMainInvokeEvent,
  data: string,
): Promise<ApiResponse> => {
  if (CLIENT == null)
    return { status: false, error: "Not connected to the server" };

  if (RUNNING_CONSOLE == null)
    return { status: false, error: "Not connected to the server" };

  return await writeInternalConsole(data);
}

const resizeInternalConsole = (
  width: number,
  height: number,
): Promise<ApiResponse> => {
  const errorFmt = (err: string) =>
    `Unable to resize console : ${err}`;

  return new Promise<ApiResponse>((resolve) => {
    const msg = new ConsoleCltMsg();
    msg.setCode(ConsoleCltMsg.Code.RESIZE);
    msg.setTtyheight(height);
    msg.setTtywidth(width);

    RUNNING_CONSOLE.write(msg, (error: Error) => { 
      error
        ? resolve({status: false, error: errorFmt(error.message)})
        : resolve({status: true}) 
    });
  });
}

export const handleResizeInternalConsole = async (
  _event: IpcMainInvokeEvent,
  width: number,
  height: number,
): Promise<ApiResponse> => {
  if (CLIENT == null)
    return { status: false, error: "Not connected to the server" };

  if (RUNNING_CONSOLE == null)
    return { status: false, error: "Not connected to the server" };

  return await resizeInternalConsole(width, height);
}
