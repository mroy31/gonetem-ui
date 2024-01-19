// package: netem
// file: netem.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

export class CopyMsg extends jspb.Message { 
    getCode(): CopyMsg.Code;
    setCode(value: CopyMsg.Code): CopyMsg;
    getPrjid(): string;
    setPrjid(value: string): CopyMsg;
    getNode(): string;
    setNode(value: string): CopyMsg;
    getNodepath(): string;
    setNodepath(value: string): CopyMsg;
    getData(): Uint8Array | string;
    getData_asU8(): Uint8Array;
    getData_asB64(): string;
    setData(value: Uint8Array | string): CopyMsg;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CopyMsg.AsObject;
    static toObject(includeInstance: boolean, msg: CopyMsg): CopyMsg.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CopyMsg, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CopyMsg;
    static deserializeBinaryFromReader(message: CopyMsg, reader: jspb.BinaryReader): CopyMsg;
}

export namespace CopyMsg {
    export type AsObject = {
        code: CopyMsg.Code,
        prjid: string,
        node: string,
        nodepath: string,
        data: Uint8Array | string,
    }

    export enum Code {
    INIT = 0,
    DATA = 1,
    ERROR = 3,
    }

}

export class ConsoleCltMsg extends jspb.Message { 
    getCode(): ConsoleCltMsg.Code;
    setCode(value: ConsoleCltMsg.Code): ConsoleCltMsg;
    getPrjid(): string;
    setPrjid(value: string): ConsoleCltMsg;
    getNode(): string;
    setNode(value: string): ConsoleCltMsg;
    getShell(): boolean;
    setShell(value: boolean): ConsoleCltMsg;
    getTtywidth(): number;
    setTtywidth(value: number): ConsoleCltMsg;
    getTtyheight(): number;
    setTtyheight(value: number): ConsoleCltMsg;
    getData(): Uint8Array | string;
    getData_asU8(): Uint8Array;
    getData_asB64(): string;
    setData(value: Uint8Array | string): ConsoleCltMsg;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ConsoleCltMsg.AsObject;
    static toObject(includeInstance: boolean, msg: ConsoleCltMsg): ConsoleCltMsg.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ConsoleCltMsg, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ConsoleCltMsg;
    static deserializeBinaryFromReader(message: ConsoleCltMsg, reader: jspb.BinaryReader): ConsoleCltMsg;
}

export namespace ConsoleCltMsg {
    export type AsObject = {
        code: ConsoleCltMsg.Code,
        prjid: string,
        node: string,
        shell: boolean,
        ttywidth: number,
        ttyheight: number,
        data: Uint8Array | string,
    }

    export enum Code {
    INIT = 0,
    DATA = 1,
    RESIZE = 2,
    CLOSE = 3,
    }

}

export class ConsoleSrvMsg extends jspb.Message { 
    getCode(): ConsoleSrvMsg.Code;
    setCode(value: ConsoleSrvMsg.Code): ConsoleSrvMsg;
    getData(): Uint8Array | string;
    getData_asU8(): Uint8Array;
    getData_asB64(): string;
    setData(value: Uint8Array | string): ConsoleSrvMsg;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ConsoleSrvMsg.AsObject;
    static toObject(includeInstance: boolean, msg: ConsoleSrvMsg): ConsoleSrvMsg.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ConsoleSrvMsg, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ConsoleSrvMsg;
    static deserializeBinaryFromReader(message: ConsoleSrvMsg, reader: jspb.BinaryReader): ConsoleSrvMsg;
}

export namespace ConsoleSrvMsg {
    export type AsObject = {
        code: ConsoleSrvMsg.Code,
        data: Uint8Array | string,
    }

    export enum Code {
    STDOUT = 0,
    STDERR = 1,
    ERROR = 2,
    CLOSE = 3,
    }

}

export class PullSrvMsg extends jspb.Message { 
    getCode(): PullSrvMsg.Code;
    setCode(value: PullSrvMsg.Code): PullSrvMsg;
    getImage(): string;
    setImage(value: string): PullSrvMsg;
    getError(): string;
    setError(value: string): PullSrvMsg;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PullSrvMsg.AsObject;
    static toObject(includeInstance: boolean, msg: PullSrvMsg): PullSrvMsg.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PullSrvMsg, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PullSrvMsg;
    static deserializeBinaryFromReader(message: PullSrvMsg, reader: jspb.BinaryReader): PullSrvMsg;
}

export namespace PullSrvMsg {
    export type AsObject = {
        code: PullSrvMsg.Code,
        image: string,
        error: string,
    }

    export enum Code {
    START = 0,
    OK = 1,
    ERROR = 2,
    }

}

export class CaptureSrvMsg extends jspb.Message { 
    getCode(): CaptureSrvMsg.Code;
    setCode(value: CaptureSrvMsg.Code): CaptureSrvMsg;
    getData(): Uint8Array | string;
    getData_asU8(): Uint8Array;
    getData_asB64(): string;
    setData(value: Uint8Array | string): CaptureSrvMsg;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CaptureSrvMsg.AsObject;
    static toObject(includeInstance: boolean, msg: CaptureSrvMsg): CaptureSrvMsg.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CaptureSrvMsg, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CaptureSrvMsg;
    static deserializeBinaryFromReader(message: CaptureSrvMsg, reader: jspb.BinaryReader): CaptureSrvMsg;
}

export namespace CaptureSrvMsg {
    export type AsObject = {
        code: CaptureSrvMsg.Code,
        data: Uint8Array | string,
    }

    export enum Code {
    STDOUT = 0,
    STDERR = 1,
    OK = 2,
    ERROR = 3,
    }

}

export class NodeIfStateRequest extends jspb.Message { 
    getPrjid(): string;
    setPrjid(value: string): NodeIfStateRequest;
    getNode(): string;
    setNode(value: string): NodeIfStateRequest;
    getIfindex(): number;
    setIfindex(value: number): NodeIfStateRequest;
    getState(): IfState;
    setState(value: IfState): NodeIfStateRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): NodeIfStateRequest.AsObject;
    static toObject(includeInstance: boolean, msg: NodeIfStateRequest): NodeIfStateRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: NodeIfStateRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): NodeIfStateRequest;
    static deserializeBinaryFromReader(message: NodeIfStateRequest, reader: jspb.BinaryReader): NodeIfStateRequest;
}

export namespace NodeIfStateRequest {
    export type AsObject = {
        prjid: string,
        node: string,
        ifindex: number,
        state: IfState,
    }
}

export class NodeInterfaceRequest extends jspb.Message { 
    getPrjid(): string;
    setPrjid(value: string): NodeInterfaceRequest;
    getNode(): string;
    setNode(value: string): NodeInterfaceRequest;
    getIfindex(): number;
    setIfindex(value: number): NodeInterfaceRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): NodeInterfaceRequest.AsObject;
    static toObject(includeInstance: boolean, msg: NodeInterfaceRequest): NodeInterfaceRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: NodeInterfaceRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): NodeInterfaceRequest;
    static deserializeBinaryFromReader(message: NodeInterfaceRequest, reader: jspb.BinaryReader): NodeInterfaceRequest;
}

export namespace NodeInterfaceRequest {
    export type AsObject = {
        prjid: string,
        node: string,
        ifindex: number,
    }
}

export class NodeRequest extends jspb.Message { 
    getPrjid(): string;
    setPrjid(value: string): NodeRequest;
    getNode(): string;
    setNode(value: string): NodeRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): NodeRequest.AsObject;
    static toObject(includeInstance: boolean, msg: NodeRequest): NodeRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: NodeRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): NodeRequest;
    static deserializeBinaryFromReader(message: NodeRequest, reader: jspb.BinaryReader): NodeRequest;
}

export namespace NodeRequest {
    export type AsObject = {
        prjid: string,
        node: string,
    }
}

export class ProjectRequest extends jspb.Message { 
    getId(): string;
    setId(value: string): ProjectRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ProjectRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ProjectRequest): ProjectRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ProjectRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ProjectRequest;
    static deserializeBinaryFromReader(message: ProjectRequest, reader: jspb.BinaryReader): ProjectRequest;
}

export namespace ProjectRequest {
    export type AsObject = {
        id: string,
    }
}

export class WNetworkRequest extends jspb.Message { 
    getId(): string;
    setId(value: string): WNetworkRequest;
    getData(): Uint8Array | string;
    getData_asU8(): Uint8Array;
    getData_asB64(): string;
    setData(value: Uint8Array | string): WNetworkRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): WNetworkRequest.AsObject;
    static toObject(includeInstance: boolean, msg: WNetworkRequest): WNetworkRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: WNetworkRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): WNetworkRequest;
    static deserializeBinaryFromReader(message: WNetworkRequest, reader: jspb.BinaryReader): WNetworkRequest;
}

export namespace WNetworkRequest {
    export type AsObject = {
        id: string,
        data: Uint8Array | string,
    }
}

export class OpenRequest extends jspb.Message { 
    getName(): string;
    setName(value: string): OpenRequest;
    getData(): Uint8Array | string;
    getData_asU8(): Uint8Array;
    getData_asB64(): string;
    setData(value: Uint8Array | string): OpenRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): OpenRequest.AsObject;
    static toObject(includeInstance: boolean, msg: OpenRequest): OpenRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: OpenRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): OpenRequest;
    static deserializeBinaryFromReader(message: OpenRequest, reader: jspb.BinaryReader): OpenRequest;
}

export namespace OpenRequest {
    export type AsObject = {
        name: string,
        data: Uint8Array | string,
    }
}

export class Status extends jspb.Message { 
    getCode(): StatusCode;
    setCode(value: StatusCode): Status;
    getError(): string;
    setError(value: string): Status;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Status.AsObject;
    static toObject(includeInstance: boolean, msg: Status): Status.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Status, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Status;
    static deserializeBinaryFromReader(message: Status, reader: jspb.BinaryReader): Status;
}

export namespace Status {
    export type AsObject = {
        code: StatusCode,
        error: string,
    }
}

export class AckResponse extends jspb.Message { 

    hasStatus(): boolean;
    clearStatus(): void;
    getStatus(): Status | undefined;
    setStatus(value?: Status): AckResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): AckResponse.AsObject;
    static toObject(includeInstance: boolean, msg: AckResponse): AckResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: AckResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): AckResponse;
    static deserializeBinaryFromReader(message: AckResponse, reader: jspb.BinaryReader): AckResponse;
}

export namespace AckResponse {
    export type AsObject = {
        status?: Status.AsObject,
    }
}

export class RunResponse extends jspb.Message { 

    hasStatus(): boolean;
    clearStatus(): void;
    getStatus(): Status | undefined;
    setStatus(value?: Status): RunResponse;
    clearNodemessagesList(): void;
    getNodemessagesList(): Array<RunResponse.NodeMessages>;
    setNodemessagesList(value: Array<RunResponse.NodeMessages>): RunResponse;
    addNodemessages(value?: RunResponse.NodeMessages, index?: number): RunResponse.NodeMessages;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RunResponse.AsObject;
    static toObject(includeInstance: boolean, msg: RunResponse): RunResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RunResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RunResponse;
    static deserializeBinaryFromReader(message: RunResponse, reader: jspb.BinaryReader): RunResponse;
}

export namespace RunResponse {
    export type AsObject = {
        status?: Status.AsObject,
        nodemessagesList: Array<RunResponse.NodeMessages.AsObject>,
    }


    export class NodeMessages extends jspb.Message { 
        getName(): string;
        setName(value: string): NodeMessages;
        clearMessagesList(): void;
        getMessagesList(): Array<string>;
        setMessagesList(value: Array<string>): NodeMessages;
        addMessages(value: string, index?: number): string;

        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): NodeMessages.AsObject;
        static toObject(includeInstance: boolean, msg: NodeMessages): NodeMessages.AsObject;
        static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
        static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
        static serializeBinaryToWriter(message: NodeMessages, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): NodeMessages;
        static deserializeBinaryFromReader(message: NodeMessages, reader: jspb.BinaryReader): NodeMessages;
    }

    export namespace NodeMessages {
        export type AsObject = {
            name: string,
            messagesList: Array<string>,
        }
    }

}

export class FileResponse extends jspb.Message { 

    hasStatus(): boolean;
    clearStatus(): void;
    getStatus(): Status | undefined;
    setStatus(value?: Status): FileResponse;
    getData(): Uint8Array | string;
    getData_asU8(): Uint8Array;
    getData_asB64(): string;
    setData(value: Uint8Array | string): FileResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): FileResponse.AsObject;
    static toObject(includeInstance: boolean, msg: FileResponse): FileResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: FileResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): FileResponse;
    static deserializeBinaryFromReader(message: FileResponse, reader: jspb.BinaryReader): FileResponse;
}

export namespace FileResponse {
    export type AsObject = {
        status?: Status.AsObject,
        data: Uint8Array | string,
    }
}

export class VersionResponse extends jspb.Message { 

    hasStatus(): boolean;
    clearStatus(): void;
    getStatus(): Status | undefined;
    setStatus(value?: Status): VersionResponse;
    getVersion(): string;
    setVersion(value: string): VersionResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): VersionResponse.AsObject;
    static toObject(includeInstance: boolean, msg: VersionResponse): VersionResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: VersionResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): VersionResponse;
    static deserializeBinaryFromReader(message: VersionResponse, reader: jspb.BinaryReader): VersionResponse;
}

export namespace VersionResponse {
    export type AsObject = {
        status?: Status.AsObject,
        version: string,
    }
}

export class StatusResponse extends jspb.Message { 

    hasStatus(): boolean;
    clearStatus(): void;
    getStatus(): Status | undefined;
    setStatus(value?: Status): StatusResponse;
    getName(): string;
    setName(value: string): StatusResponse;
    getId(): string;
    setId(value: string): StatusResponse;
    getOpenat(): string;
    setOpenat(value: string): StatusResponse;
    getRunning(): boolean;
    setRunning(value: boolean): StatusResponse;
    clearNodesList(): void;
    getNodesList(): Array<StatusResponse.NodeStatus>;
    setNodesList(value: Array<StatusResponse.NodeStatus>): StatusResponse;
    addNodes(value?: StatusResponse.NodeStatus, index?: number): StatusResponse.NodeStatus;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): StatusResponse.AsObject;
    static toObject(includeInstance: boolean, msg: StatusResponse): StatusResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: StatusResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): StatusResponse;
    static deserializeBinaryFromReader(message: StatusResponse, reader: jspb.BinaryReader): StatusResponse;
}

export namespace StatusResponse {
    export type AsObject = {
        status?: Status.AsObject,
        name: string,
        id: string,
        openat: string,
        running: boolean,
        nodesList: Array<StatusResponse.NodeStatus.AsObject>,
    }


    export class IfStatus extends jspb.Message { 
        getName(): string;
        setName(value: string): IfStatus;
        getState(): IfState;
        setState(value: IfState): IfStatus;

        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): IfStatus.AsObject;
        static toObject(includeInstance: boolean, msg: IfStatus): IfStatus.AsObject;
        static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
        static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
        static serializeBinaryToWriter(message: IfStatus, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): IfStatus;
        static deserializeBinaryFromReader(message: IfStatus, reader: jspb.BinaryReader): IfStatus;
    }

    export namespace IfStatus {
        export type AsObject = {
            name: string,
            state: IfState,
        }
    }

    export class NodeStatus extends jspb.Message { 
        getName(): string;
        setName(value: string): NodeStatus;
        getRunning(): boolean;
        setRunning(value: boolean): NodeStatus;
        clearInterfacesList(): void;
        getInterfacesList(): Array<StatusResponse.IfStatus>;
        setInterfacesList(value: Array<StatusResponse.IfStatus>): NodeStatus;
        addInterfaces(value?: StatusResponse.IfStatus, index?: number): StatusResponse.IfStatus;

        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): NodeStatus.AsObject;
        static toObject(includeInstance: boolean, msg: NodeStatus): NodeStatus.AsObject;
        static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
        static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
        static serializeBinaryToWriter(message: NodeStatus, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): NodeStatus;
        static deserializeBinaryFromReader(message: NodeStatus, reader: jspb.BinaryReader): NodeStatus;
    }

    export namespace NodeStatus {
        export type AsObject = {
            name: string,
            running: boolean,
            interfacesList: Array<StatusResponse.IfStatus.AsObject>,
        }
    }

}

export class ConfigFilesResponse extends jspb.Message { 

    hasStatus(): boolean;
    clearStatus(): void;
    getStatus(): Status | undefined;
    setStatus(value?: Status): ConfigFilesResponse;
    getSource(): ConfigFilesResponse.Source;
    setSource(value: ConfigFilesResponse.Source): ConfigFilesResponse;
    clearFilesList(): void;
    getFilesList(): Array<ConfigFilesResponse.ConfigFile>;
    setFilesList(value: Array<ConfigFilesResponse.ConfigFile>): ConfigFilesResponse;
    addFiles(value?: ConfigFilesResponse.ConfigFile, index?: number): ConfigFilesResponse.ConfigFile;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ConfigFilesResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ConfigFilesResponse): ConfigFilesResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ConfigFilesResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ConfigFilesResponse;
    static deserializeBinaryFromReader(message: ConfigFilesResponse, reader: jspb.BinaryReader): ConfigFilesResponse;
}

export namespace ConfigFilesResponse {
    export type AsObject = {
        status?: Status.AsObject,
        source: ConfigFilesResponse.Source,
        filesList: Array<ConfigFilesResponse.ConfigFile.AsObject>,
    }


    export class ConfigFile extends jspb.Message { 
        getName(): string;
        setName(value: string): ConfigFile;
        getData(): Uint8Array | string;
        getData_asU8(): Uint8Array;
        getData_asB64(): string;
        setData(value: Uint8Array | string): ConfigFile;

        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): ConfigFile.AsObject;
        static toObject(includeInstance: boolean, msg: ConfigFile): ConfigFile.AsObject;
        static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
        static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
        static serializeBinaryToWriter(message: ConfigFile, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): ConfigFile;
        static deserializeBinaryFromReader(message: ConfigFile, reader: jspb.BinaryReader): ConfigFile;
    }

    export namespace ConfigFile {
        export type AsObject = {
            name: string,
            data: Uint8Array | string,
        }
    }


    export enum Source {
    ARCHIVE = 0,
    RUNNING = 1,
    }

}

export class PrjListResponse extends jspb.Message { 

    hasStatus(): boolean;
    clearStatus(): void;
    getStatus(): Status | undefined;
    setStatus(value?: Status): PrjListResponse;
    clearProjectsList(): void;
    getProjectsList(): Array<PrjListResponse.Info>;
    setProjectsList(value: Array<PrjListResponse.Info>): PrjListResponse;
    addProjects(value?: PrjListResponse.Info, index?: number): PrjListResponse.Info;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PrjListResponse.AsObject;
    static toObject(includeInstance: boolean, msg: PrjListResponse): PrjListResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PrjListResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PrjListResponse;
    static deserializeBinaryFromReader(message: PrjListResponse, reader: jspb.BinaryReader): PrjListResponse;
}

export namespace PrjListResponse {
    export type AsObject = {
        status?: Status.AsObject,
        projectsList: Array<PrjListResponse.Info.AsObject>,
    }


    export class Info extends jspb.Message { 
        getId(): string;
        setId(value: string): Info;
        getName(): string;
        setName(value: string): Info;
        getOpenat(): string;
        setOpenat(value: string): Info;

        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): Info.AsObject;
        static toObject(includeInstance: boolean, msg: Info): Info.AsObject;
        static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
        static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
        static serializeBinaryToWriter(message: Info, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): Info;
        static deserializeBinaryFromReader(message: Info, reader: jspb.BinaryReader): Info;
    }

    export namespace Info {
        export type AsObject = {
            id: string,
            name: string,
            openat: string,
        }
    }

}

export class PrjOpenResponse extends jspb.Message { 

    hasStatus(): boolean;
    clearStatus(): void;
    getStatus(): Status | undefined;
    setStatus(value?: Status): PrjOpenResponse;
    getId(): string;
    setId(value: string): PrjOpenResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PrjOpenResponse.AsObject;
    static toObject(includeInstance: boolean, msg: PrjOpenResponse): PrjOpenResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PrjOpenResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PrjOpenResponse;
    static deserializeBinaryFromReader(message: PrjOpenResponse, reader: jspb.BinaryReader): PrjOpenResponse;
}

export namespace PrjOpenResponse {
    export type AsObject = {
        status?: Status.AsObject,
        id: string,
    }
}

export enum StatusCode {
    OK = 0,
    ERROR = 1,
}

export enum IfState {
    UP = 0,
    DOWN = 1,
}
