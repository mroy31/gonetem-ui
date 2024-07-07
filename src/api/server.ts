import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { CLIENT } from "./client";
import { PullSrvMsg } from "../proto/netem_pb";
import { mainWindow } from "..";
import { IpcMainInvokeEvent } from "electron";


function pullImages(): Promise<ApiResponse> {
  const errorFmt = (err: string) =>
    `Unable to pull docker images: ${err}`;

  return new Promise<ApiResponse>((resolve) => {
    const request = new Empty();

    const stub = CLIENT.serverPullImages(request);
    stub.on('status', () => { resolve({ status: true }); });
    stub.on('data', (data: PullSrvMsg) => { 
      mainWindow.webContents.send("server:pull:event", data.toObject()); 
    });
    stub.on('error', (e: Error) => {
      resolve({
        status: false,
        error: errorFmt(e.message)
      })
    });
  });
}

export const handlePullImages = async (
  _event: IpcMainInvokeEvent,
): Promise<ApiResponse> => {
  if (CLIENT == null)
    return { status: false, error: "Not connected to the server" };

  return await pullImages();
};