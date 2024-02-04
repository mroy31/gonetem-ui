
import { IpcMainInvokeEvent } from "electron";
import Store from "electron-store";

export interface ITLSOptions {
    enabled: boolean;
    ca?: string;
    cert?: string;
    key?: string;
}

export interface IOptions {
    server: string;
    tls: ITLSOptions;
    consoleExternalCmd: string;
}

const store = new Store<IOptions>({
    schema: { 
        server: { type: "string" },
        tls: { 
          type: "object",
          properties: {
            enabled: {type: "boolean"},
            ca: {type: "string"},
            cert: {type: "string"},
            key: {type: "string"},
          }
        },
        consoleExternalCmd: { type: "string" },
    }, 
    defaults: {
        server: "",
        tls: {
            enabled: false,
        },
        consoleExternalCmd: "xterm -xrm 'XTerm.vt100.allowTitleOps: false' -title '${name}' -e ${cmd}",
    }
});

export const getOptions = (): IOptions => {
    return {
        server: store.get("server"),
        tls: store.get("tls"),
        consoleExternalCmd: store.get("consoleExternalCmd"),
    };
}

const setOptions = (options: IOptions): void => {
    store.set("server", options.server);
    store.set("tls", options.tls);
}

export const handleGetOptions = (_event: IpcMainInvokeEvent): Promise<OptionsApiResponse> => {
    return new Promise<OptionsApiResponse>((resolve) => {
        resolve({
            status: true,
            result: getOptions(),
        });
    });
}

export const handleSetOptions = (_event: IpcMainInvokeEvent, options: IOptions): Promise<ApiResponse> => {
    return new Promise<ApiResponse>((resolve) => {
        setOptions(options);
        resolve({status: true});
    });
}
