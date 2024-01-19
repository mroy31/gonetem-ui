import fs from "fs/promises";
import { IpcMainInvokeEvent } from "electron";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import * as grpc from "@grpc/grpc-js";
import services from "../proto/netem_grpc_pb";
import { getOptions } from "./options";
import { StatusCode } from "../proto/netem_pb";
import { CURRENT_PROJECT_ID } from "./project";

export let CLIENT: services.NetemClient = null;

async function createClientCredentials(
  isSecure: boolean,
  caCert?: string,
  clientCert?: string,
  clientKey?: string
): Promise<grpc.ChannelCredentials> {
  if (!isSecure) return grpc.credentials.createInsecure();

  try {
    const caCertData = await fs.readFile(caCert);
    const clientCertData = await fs.readFile(clientCert);
    const clientKeyData = await fs.readFile(clientKey);

    return grpc.credentials.createSsl(
      caCertData,
      clientKeyData,
      clientCertData
    );
  } catch (err) {
    throw new Error(`Unable to read a certificate or a key: ${err.message}`);
  }
}

function getVersion(): Promise<StringApiResponse> {
  const errorFmt = (err: string) => `Unable to get server version: ${err}`;

  return new Promise<StringApiResponse>((resolve) => {
    CLIENT.getVersion(new Empty(), (err, version) => {
      if (err) {
        resolve({ status: false, error: errorFmt(err) });
      } else {
        const code = version.getStatus().getCode();
        code == StatusCode.ERROR
          ? resolve({
              status: false,
              error: errorFmt(version.getStatus().getError()),
            })
          : resolve({ status: true, result: version.getVersion() });
      }
    });
  });
}

export const handleIsConnected = async (
  _event: IpcMainInvokeEvent
): Promise<IsConnectedApiResponse> => {
  if (CLIENT == null) return { status: true, result: { connected: false } };

  const res = await getVersion();
  return res.status
    ? {
        status: true,
        result: {
          connected: true,
          version: res.result,
          currentPrj: CURRENT_PROJECT_ID,
        },
      }
    : { status: false, error: res.error };
};

export const handleConnect = async (
  _event: IpcMainInvokeEvent
): Promise<StringApiResponse> => {
  if (CLIENT != null) return await getVersion();

  const options = getOptions();
  try {
    const creds = await createClientCredentials(
      options.tls.enabled,
      options.tls.ca,
      options.tls.cert,
      options.tls.key
    );

    CLIENT = new services.NetemClient(options.server, creds);
    return CLIENT.getVersion
      ? await getVersion()
      : { status: false, error: "Unable to connect to server" };
  } catch (err) {
    return { status: false, error: err.message };
  }
};
