
import { IpcMainInvokeEvent, Rectangle } from "electron";
import Store from "electron-store";

export interface ITLSOptions {
    enabled: boolean;
    ca?: string;
    cert?: string;
    key?: string;
}

export interface IOptions {
    server: string;
    autoconnect: boolean;
    tls: ITLSOptions;
    consoleExternalCmd: string;
}

export interface IAppState {
    winBounds: {
        width: number;
        height: number;
        x?: number;
        y?: number;
    };
}

const store = new Store<IOptions & IAppState>({
    schema: { 
        server: { type: "string" },
        autoconnect: { type: "boolean" },
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
        winBounds: {
            type: "object",
            properties: {
                x: {type: "number"},
                y: {type: "number"},
                width: {type: "number"},
                height: {type: "number"},
            },
            required: ["width", "height"],
        }
    }, 
    defaults: {
        server: "",
        autoconnect: true,
        tls: {
            enabled: false,
        },
        consoleExternalCmd: "xterm -xrm 'XTerm.vt100.allowTitleOps: false' -title '${name}' -e ${cmd}",
        winBounds: {
            height: 800,
            width: 1200,
        }
    }
});

export const getAppState = (): IAppState => {
    return {
        winBounds: store.get("winBounds"),
    };
}

export const setAppWinBounds = (bounds: Rectangle) => {
    store.set("winBounds", bounds);
}

export const getOptions = (): IOptions => {
    return {
        server: store.get("server"),
        autoconnect: store.get("autoconnect"),
        tls: store.get("tls"),
        consoleExternalCmd: store.get("consoleExternalCmd"),
    };
}

const setOptions = (options: IOptions): void => {
    store.set("server", options.server);
    store.set("autoconnect", options.autoconnect);
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
