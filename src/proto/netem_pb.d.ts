// package: netem
// file: netem.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

export class ExecCltMsg extends jspb.Message { 
    getCode(): ExecCltMsg.Code;
    setCode(value: ExecCltMsg.Code): ExecCltMsg;
    getPrjid(): string;
    setPrjid(value: string): ExecCltMsg;
    getNode(): string;
    setNode(value: string): ExecCltMsg;
    clearCmdList(): void;
    getCmdList(): Array<string>;
    setCmdList(value: Array<string>): ExecCltMsg;
    addCmd(value: string, index?: number): string;
    getTty(): boolean;
    setTty(value: boolean): ExecCltMsg;
    getData(): Uint8Array | string;
    getData_asU8(): Uint8Array;
    getData_asB64(): string;
    setData(value: Uint8Array | string): ExecCltMsg;
    getTtywidth(): number;
    setTtywidth(value: number): ExecCltMsg;
    getTtyheight(): number;
    setTtyheight(value: number): ExecCltMsg;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ExecCltMsg.AsObject;
    static toObject(includeInstance: boolean, msg: ExecCltMsg): ExecCltMsg.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ExecCltMsg, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ExecCltMsg;
    static deserializeBinaryFromReader(message: ExecCltMsg, reader: jspb.BinaryReader): ExecCltMsg;
}

export namespace ExecCltMsg {
    export type AsObject = {
        code: ExecCltMsg.Code,
        prjid: string,
        node: string,
        cmdList: Array<string>,
        tty: boolean,
        data: Uint8Array | string,
        ttywidth: number,
        ttyheight: number,
    }

    export enum Code {
    CMD = 0,
    DATA = 1,
    RESIZE = 2,
    ERROR = 3,
    CLOSE = 4,
    }

}

export class ExecSrvMsg extends jspb.Message { 
    getCode(): ExecSrvMsg.Code;
    setCode(value: ExecSrvMsg.Code): ExecSrvMsg;
    getData(): Uint8Array | string;
    getData_asU8(): Uint8Array;
    getData_asB64(): string;
    setData(value: Uint8Array | string): ExecSrvMsg;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ExecSrvMsg.AsObject;
    static toObject(includeInstance: boolean, msg: ExecSrvMsg): ExecSrvMsg.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ExecSrvMsg, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ExecSrvMsg;
    static deserializeBinaryFromReader(message: ExecSrvMsg, reader: jspb.BinaryReader): ExecSrvMsg;
}

export namespace ExecSrvMsg {
    export type AsObject = {
        code: ExecSrvMsg.Code,
        data: Uint8Array | string,
    }

    export enum Code {
    STDOUT = 0,
    STDERR = 1,
    ERROR = 2,
    CLOSE = 3,
    }

}

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

export class TopologyRunMsg extends jspb.Message { 
    getCode(): TopologyRunMsg.Code;
    setCode(value: TopologyRunMsg.Code): TopologyRunMsg;
    getTotal(): number;
    setTotal(value: number): TopologyRunMsg;
    clearNodemessagesList(): void;
    getNodemessagesList(): Array<TopologyRunMsg.NodeMessages>;
    setNodemessagesList(value: Array<TopologyRunMsg.NodeMessages>): TopologyRunMsg;
    addNodemessages(value?: TopologyRunMsg.NodeMessages, index?: number): TopologyRunMsg.NodeMessages;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TopologyRunMsg.AsObject;
    static toObject(includeInstance: boolean, msg: TopologyRunMsg): TopologyRunMsg.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TopologyRunMsg, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TopologyRunMsg;
    static deserializeBinaryFromReader(message: TopologyRunMsg, reader: jspb.BinaryReader): TopologyRunMsg;
}

export namespace TopologyRunMsg {
    export type AsObject = {
        code: TopologyRunMsg.Code,
        total: number,
        nodemessagesList: Array<TopologyRunMsg.NodeMessages.AsObject>,
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


    export enum Code {
    NODE_COUNT = 0,
    BRIDGE_COUNT = 1,
    LINK_COUNT = 2,
    NODE_START = 3,
    LINK_SETUP = 4,
    BRIDGE_START = 5,
    NODE_LOADCONFIG = 6,
    NODE_MESSAGES = 7,
    NODE_STOP = 8,
    NODE_RM = 9,
    }

}

export class ProjectSaveMsg extends jspb.Message { 
    getCode(): ProjectSaveMsg.Code;
    setCode(value: ProjectSaveMsg.Code): ProjectSaveMsg;
    getData(): Uint8Array | string;
    getData_asU8(): Uint8Array;
    getData_asB64(): string;
    setData(value: Uint8Array | string): ProjectSaveMsg;
    getTotal(): number;
    setTotal(value: number): ProjectSaveMsg;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ProjectSaveMsg.AsObject;
    static toObject(includeInstance: boolean, msg: ProjectSaveMsg): ProjectSaveMsg.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ProjectSaveMsg, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ProjectSaveMsg;
    static deserializeBinaryFromReader(message: ProjectSaveMsg, reader: jspb.BinaryReader): ProjectSaveMsg;
}

export namespace ProjectSaveMsg {
    export type AsObject = {
        code: ProjectSaveMsg.Code,
        data: Uint8Array | string,
        total: number,
    }

    export enum Code {
    NODE_COUNT = 0,
    NODE_SAVE = 1,
    DATA = 2,
    }

}

export class ProjectCloseMsg extends jspb.Message { 
    getCode(): ProjectCloseMsg.Code;
    setCode(value: ProjectCloseMsg.Code): ProjectCloseMsg;
    getTotal(): number;
    setTotal(value: number): ProjectCloseMsg;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ProjectCloseMsg.AsObject;
    static toObject(includeInstance: boolean, msg: ProjectCloseMsg): ProjectCloseMsg.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ProjectCloseMsg, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ProjectCloseMsg;
    static deserializeBinaryFromReader(message: ProjectCloseMsg, reader: jspb.BinaryReader): ProjectCloseMsg;
}

export namespace ProjectCloseMsg {
    export type AsObject = {
        code: ProjectCloseMsg.Code,
        total: number,
    }

    export enum Code {
    NODE_COUNT = 0,
    BRIDGE_COUNT = 1,
    NODE_CLOSE = 2,
    BRIDGE_CLOSE = 3,
    }

}

export class LinkConfig extends jspb.Message { 
    getPeer1(): string;
    setPeer1(value: string): LinkConfig;
    getPeer2(): string;
    setPeer2(value: string): LinkConfig;
    getLoss(): number;
    setLoss(value: number): LinkConfig;
    getDelay(): number;
    setDelay(value: number): LinkConfig;
    getJitter(): number;
    setJitter(value: number): LinkConfig;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): LinkConfig.AsObject;
    static toObject(includeInstance: boolean, msg: LinkConfig): LinkConfig.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: LinkConfig, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): LinkConfig;
    static deserializeBinaryFromReader(message: LinkConfig, reader: jspb.BinaryReader): LinkConfig;
}

export namespace LinkConfig {
    export type AsObject = {
        peer1: string,
        peer2: string,
        loss: number,
        delay: number,
        jitter: number,
    }
}

export class LinkRequest extends jspb.Message { 
    getPrjid(): string;
    setPrjid(value: string): LinkRequest;

    hasLink(): boolean;
    clearLink(): void;
    getLink(): LinkConfig | undefined;
    setLink(value?: LinkConfig): LinkRequest;
    getSync(): boolean;
    setSync(value: boolean): LinkRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): LinkRequest.AsObject;
    static toObject(includeInstance: boolean, msg: LinkRequest): LinkRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: LinkRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): LinkRequest;
    static deserializeBinaryFromReader(message: LinkRequest, reader: jspb.BinaryReader): LinkRequest;
}

export namespace LinkRequest {
    export type AsObject = {
        prjid: string,
        link?: LinkConfig.AsObject,
        sync: boolean,
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

export class ConsoleCmdRequest extends jspb.Message { 
    getPrjid(): string;
    setPrjid(value: string): ConsoleCmdRequest;
    getNode(): string;
    setNode(value: string): ConsoleCmdRequest;
    getShell(): boolean;
    setShell(value: boolean): ConsoleCmdRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ConsoleCmdRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ConsoleCmdRequest): ConsoleCmdRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ConsoleCmdRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ConsoleCmdRequest;
    static deserializeBinaryFromReader(message: ConsoleCmdRequest, reader: jspb.BinaryReader): ConsoleCmdRequest;
}

export namespace ConsoleCmdRequest {
    export type AsObject = {
        prjid: string,
        node: string,
        shell: boolean,
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

export class ConsoleCmdResponse extends jspb.Message { 

    hasStatus(): boolean;
    clearStatus(): void;
    getStatus(): Status | undefined;
    setStatus(value?: Status): ConsoleCmdResponse;
    clearCmdList(): void;
    getCmdList(): Array<string>;
    setCmdList(value: Array<string>): ConsoleCmdResponse;
    addCmd(value: string, index?: number): string;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ConsoleCmdResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ConsoleCmdResponse): ConsoleCmdResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ConsoleCmdResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ConsoleCmdResponse;
    static deserializeBinaryFromReader(message: ConsoleCmdResponse, reader: jspb.BinaryReader): ConsoleCmdResponse;
}

export namespace ConsoleCmdResponse {
    export type AsObject = {
        status?: Status.AsObject,
        cmdList: Array<string>,
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
