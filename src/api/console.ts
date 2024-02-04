
import * as grpc from "@grpc/grpc-js";
import {
  ConsoleCltMsg,
  ConsoleSrvMsg,
} from "../proto/netem_pb";
import { mainWindow } from "..";
import { CLIENT } from "./client";

let RUNNING_CONSOLE: grpc.ClientDuplexStream<ConsoleCltMsg, ConsoleSrvMsg> = null;

function runNodeConsole(
  prjId: string,
  nodeId: string
): Promise<ApiResponse> {
  const errorFmt = (err: string) =>
    `Unable to run console for node '${prjId}.${nodeId}': ${err}`;

  return new Promise<ConfigFilesApiResponse>((resolve) => {
    const msg = new ConsoleCltMsg();
    msg.setCode(ConsoleCltMsg.Code.INIT);
    msg.setPrjid(prjId);
    msg.setNode(nodeId);
    msg.setShell(false);

    RUNNING_CONSOLE = CLIENT.console();
    RUNNING_CONSOLE.on("data", (data: ConsoleSrvMsg) => {
      switch (data.getCode()) {
        case ConsoleSrvMsg.Code.STDOUT:
          mainWindow.webContents.send("console:stdout", Buffer.from(data.getData_asB64(), "base64").toString())
          break;
        case ConsoleSrvMsg.Code.STDERR:
          mainWindow.webContents.send("console:stderr", Buffer.from(data.getData_asB64(), "base64").toString())
          break;

      }
    });
    RUNNING_CONSOLE.on('end', function() {
      // The server has finished sending
    });
    RUNNING_CONSOLE.on('error', function(e) {
      // An error has occurred and the stream has been closed.
    });

    RUNNING_CONSOLE.write(msg, () => { RUNNING_CONSOLE = null; });
  });
}