import { features, IFeatures } from "./edition";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IpcListener = (...args: any[]) => any;

export interface IpcRegistrar {
  handle(channel: string, listener: IpcListener): void;
}

export type IpcHandlers = Record<string, IpcListener>;

const gatedChannels: { readonly [channel: string]: keyof IFeatures } = {
  "server:writeTopology": "topologyWrite",
  "server:checkTopology": "topologyValidation",
  "server:readNodeConfigFiles": "nodeConfigRead",
  "client:setOptions": "optionsWrite",
};

export const registerIpcHandlers = (
  registrar: IpcRegistrar,
  handlers: IpcHandlers,
): void => {
  for (const [channel, listener] of Object.entries(handlers)) {
    const gate = gatedChannels[channel];
    if (gate && !features[gate]) continue;
    registrar.handle(channel, listener);
  }
};
