import { IpcMainInvokeEvent } from "electron";
import {
  ConfigFilesResponse,
  NodeRequest,
  StatusCode,
} from "../proto/netem_pb";
import { CLIENT } from "./client";

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
                    data: Buffer.from(f.getData_asB64(), "base64").toString(
                      "utf8"
                    ),
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