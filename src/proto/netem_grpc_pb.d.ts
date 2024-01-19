// package: netem
// file: netem.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "grpc";
import * as netem_pb from "./netem_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

interface INetemService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    getVersion: INetemService_IGetVersion;
    pullImages: INetemService_IPullImages;
    clean: INetemService_IClean;
    getProjects: INetemService_IGetProjects;
    openProject: INetemService_IOpenProject;
    closeProject: INetemService_ICloseProject;
    saveProject: INetemService_ISaveProject;
    getProjectConfigs: INetemService_IGetProjectConfigs;
    getProjectStatus: INetemService_IGetProjectStatus;
    readNetworkFile: INetemService_IReadNetworkFile;
    writeNetworkFile: INetemService_IWriteNetworkFile;
    check: INetemService_ICheck;
    reload: INetemService_IReload;
    run: INetemService_IRun;
    readConfigFiles: INetemService_IReadConfigFiles;
    canRunConsole: INetemService_ICanRunConsole;
    console: INetemService_IConsole;
    start: INetemService_IStart;
    stop: INetemService_IStop;
    restart: INetemService_IRestart;
    setIfState: INetemService_ISetIfState;
    capture: INetemService_ICapture;
    copyFrom: INetemService_ICopyFrom;
    copyTo: INetemService_ICopyTo;
}

interface INetemService_IGetVersion extends grpc.MethodDefinition<google_protobuf_empty_pb.Empty, netem_pb.VersionResponse> {
    path: "/netem.Netem/GetVersion";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    requestDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
    responseSerialize: grpc.serialize<netem_pb.VersionResponse>;
    responseDeserialize: grpc.deserialize<netem_pb.VersionResponse>;
}
interface INetemService_IPullImages extends grpc.MethodDefinition<google_protobuf_empty_pb.Empty, netem_pb.PullSrvMsg> {
    path: "/netem.Netem/PullImages";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    requestDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
    responseSerialize: grpc.serialize<netem_pb.PullSrvMsg>;
    responseDeserialize: grpc.deserialize<netem_pb.PullSrvMsg>;
}
interface INetemService_IClean extends grpc.MethodDefinition<google_protobuf_empty_pb.Empty, netem_pb.AckResponse> {
    path: "/netem.Netem/Clean";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    requestDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
    responseSerialize: grpc.serialize<netem_pb.AckResponse>;
    responseDeserialize: grpc.deserialize<netem_pb.AckResponse>;
}
interface INetemService_IGetProjects extends grpc.MethodDefinition<google_protobuf_empty_pb.Empty, netem_pb.PrjListResponse> {
    path: "/netem.Netem/GetProjects";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    requestDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
    responseSerialize: grpc.serialize<netem_pb.PrjListResponse>;
    responseDeserialize: grpc.deserialize<netem_pb.PrjListResponse>;
}
interface INetemService_IOpenProject extends grpc.MethodDefinition<netem_pb.OpenRequest, netem_pb.PrjOpenResponse> {
    path: "/netem.Netem/OpenProject";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<netem_pb.OpenRequest>;
    requestDeserialize: grpc.deserialize<netem_pb.OpenRequest>;
    responseSerialize: grpc.serialize<netem_pb.PrjOpenResponse>;
    responseDeserialize: grpc.deserialize<netem_pb.PrjOpenResponse>;
}
interface INetemService_ICloseProject extends grpc.MethodDefinition<netem_pb.ProjectRequest, netem_pb.AckResponse> {
    path: "/netem.Netem/CloseProject";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<netem_pb.ProjectRequest>;
    requestDeserialize: grpc.deserialize<netem_pb.ProjectRequest>;
    responseSerialize: grpc.serialize<netem_pb.AckResponse>;
    responseDeserialize: grpc.deserialize<netem_pb.AckResponse>;
}
interface INetemService_ISaveProject extends grpc.MethodDefinition<netem_pb.ProjectRequest, netem_pb.FileResponse> {
    path: "/netem.Netem/SaveProject";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<netem_pb.ProjectRequest>;
    requestDeserialize: grpc.deserialize<netem_pb.ProjectRequest>;
    responseSerialize: grpc.serialize<netem_pb.FileResponse>;
    responseDeserialize: grpc.deserialize<netem_pb.FileResponse>;
}
interface INetemService_IGetProjectConfigs extends grpc.MethodDefinition<netem_pb.ProjectRequest, netem_pb.FileResponse> {
    path: "/netem.Netem/GetProjectConfigs";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<netem_pb.ProjectRequest>;
    requestDeserialize: grpc.deserialize<netem_pb.ProjectRequest>;
    responseSerialize: grpc.serialize<netem_pb.FileResponse>;
    responseDeserialize: grpc.deserialize<netem_pb.FileResponse>;
}
interface INetemService_IGetProjectStatus extends grpc.MethodDefinition<netem_pb.ProjectRequest, netem_pb.StatusResponse> {
    path: "/netem.Netem/GetProjectStatus";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<netem_pb.ProjectRequest>;
    requestDeserialize: grpc.deserialize<netem_pb.ProjectRequest>;
    responseSerialize: grpc.serialize<netem_pb.StatusResponse>;
    responseDeserialize: grpc.deserialize<netem_pb.StatusResponse>;
}
interface INetemService_IReadNetworkFile extends grpc.MethodDefinition<netem_pb.ProjectRequest, netem_pb.FileResponse> {
    path: "/netem.Netem/ReadNetworkFile";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<netem_pb.ProjectRequest>;
    requestDeserialize: grpc.deserialize<netem_pb.ProjectRequest>;
    responseSerialize: grpc.serialize<netem_pb.FileResponse>;
    responseDeserialize: grpc.deserialize<netem_pb.FileResponse>;
}
interface INetemService_IWriteNetworkFile extends grpc.MethodDefinition<netem_pb.WNetworkRequest, netem_pb.AckResponse> {
    path: "/netem.Netem/WriteNetworkFile";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<netem_pb.WNetworkRequest>;
    requestDeserialize: grpc.deserialize<netem_pb.WNetworkRequest>;
    responseSerialize: grpc.serialize<netem_pb.AckResponse>;
    responseDeserialize: grpc.deserialize<netem_pb.AckResponse>;
}
interface INetemService_ICheck extends grpc.MethodDefinition<netem_pb.ProjectRequest, netem_pb.AckResponse> {
    path: "/netem.Netem/Check";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<netem_pb.ProjectRequest>;
    requestDeserialize: grpc.deserialize<netem_pb.ProjectRequest>;
    responseSerialize: grpc.serialize<netem_pb.AckResponse>;
    responseDeserialize: grpc.deserialize<netem_pb.AckResponse>;
}
interface INetemService_IReload extends grpc.MethodDefinition<netem_pb.ProjectRequest, netem_pb.RunResponse> {
    path: "/netem.Netem/Reload";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<netem_pb.ProjectRequest>;
    requestDeserialize: grpc.deserialize<netem_pb.ProjectRequest>;
    responseSerialize: grpc.serialize<netem_pb.RunResponse>;
    responseDeserialize: grpc.deserialize<netem_pb.RunResponse>;
}
interface INetemService_IRun extends grpc.MethodDefinition<netem_pb.ProjectRequest, netem_pb.RunResponse> {
    path: "/netem.Netem/Run";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<netem_pb.ProjectRequest>;
    requestDeserialize: grpc.deserialize<netem_pb.ProjectRequest>;
    responseSerialize: grpc.serialize<netem_pb.RunResponse>;
    responseDeserialize: grpc.deserialize<netem_pb.RunResponse>;
}
interface INetemService_IReadConfigFiles extends grpc.MethodDefinition<netem_pb.NodeRequest, netem_pb.ConfigFilesResponse> {
    path: "/netem.Netem/ReadConfigFiles";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<netem_pb.NodeRequest>;
    requestDeserialize: grpc.deserialize<netem_pb.NodeRequest>;
    responseSerialize: grpc.serialize<netem_pb.ConfigFilesResponse>;
    responseDeserialize: grpc.deserialize<netem_pb.ConfigFilesResponse>;
}
interface INetemService_ICanRunConsole extends grpc.MethodDefinition<netem_pb.NodeRequest, netem_pb.AckResponse> {
    path: "/netem.Netem/CanRunConsole";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<netem_pb.NodeRequest>;
    requestDeserialize: grpc.deserialize<netem_pb.NodeRequest>;
    responseSerialize: grpc.serialize<netem_pb.AckResponse>;
    responseDeserialize: grpc.deserialize<netem_pb.AckResponse>;
}
interface INetemService_IConsole extends grpc.MethodDefinition<netem_pb.ConsoleCltMsg, netem_pb.ConsoleSrvMsg> {
    path: "/netem.Netem/Console";
    requestStream: true;
    responseStream: true;
    requestSerialize: grpc.serialize<netem_pb.ConsoleCltMsg>;
    requestDeserialize: grpc.deserialize<netem_pb.ConsoleCltMsg>;
    responseSerialize: grpc.serialize<netem_pb.ConsoleSrvMsg>;
    responseDeserialize: grpc.deserialize<netem_pb.ConsoleSrvMsg>;
}
interface INetemService_IStart extends grpc.MethodDefinition<netem_pb.NodeRequest, netem_pb.AckResponse> {
    path: "/netem.Netem/Start";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<netem_pb.NodeRequest>;
    requestDeserialize: grpc.deserialize<netem_pb.NodeRequest>;
    responseSerialize: grpc.serialize<netem_pb.AckResponse>;
    responseDeserialize: grpc.deserialize<netem_pb.AckResponse>;
}
interface INetemService_IStop extends grpc.MethodDefinition<netem_pb.NodeRequest, netem_pb.AckResponse> {
    path: "/netem.Netem/Stop";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<netem_pb.NodeRequest>;
    requestDeserialize: grpc.deserialize<netem_pb.NodeRequest>;
    responseSerialize: grpc.serialize<netem_pb.AckResponse>;
    responseDeserialize: grpc.deserialize<netem_pb.AckResponse>;
}
interface INetemService_IRestart extends grpc.MethodDefinition<netem_pb.NodeRequest, netem_pb.AckResponse> {
    path: "/netem.Netem/Restart";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<netem_pb.NodeRequest>;
    requestDeserialize: grpc.deserialize<netem_pb.NodeRequest>;
    responseSerialize: grpc.serialize<netem_pb.AckResponse>;
    responseDeserialize: grpc.deserialize<netem_pb.AckResponse>;
}
interface INetemService_ISetIfState extends grpc.MethodDefinition<netem_pb.NodeIfStateRequest, netem_pb.AckResponse> {
    path: "/netem.Netem/SetIfState";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<netem_pb.NodeIfStateRequest>;
    requestDeserialize: grpc.deserialize<netem_pb.NodeIfStateRequest>;
    responseSerialize: grpc.serialize<netem_pb.AckResponse>;
    responseDeserialize: grpc.deserialize<netem_pb.AckResponse>;
}
interface INetemService_ICapture extends grpc.MethodDefinition<netem_pb.NodeInterfaceRequest, netem_pb.CaptureSrvMsg> {
    path: "/netem.Netem/Capture";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<netem_pb.NodeInterfaceRequest>;
    requestDeserialize: grpc.deserialize<netem_pb.NodeInterfaceRequest>;
    responseSerialize: grpc.serialize<netem_pb.CaptureSrvMsg>;
    responseDeserialize: grpc.deserialize<netem_pb.CaptureSrvMsg>;
}
interface INetemService_ICopyFrom extends grpc.MethodDefinition<netem_pb.CopyMsg, netem_pb.CopyMsg> {
    path: "/netem.Netem/CopyFrom";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<netem_pb.CopyMsg>;
    requestDeserialize: grpc.deserialize<netem_pb.CopyMsg>;
    responseSerialize: grpc.serialize<netem_pb.CopyMsg>;
    responseDeserialize: grpc.deserialize<netem_pb.CopyMsg>;
}
interface INetemService_ICopyTo extends grpc.MethodDefinition<netem_pb.CopyMsg, netem_pb.AckResponse> {
    path: "/netem.Netem/CopyTo";
    requestStream: true;
    responseStream: false;
    requestSerialize: grpc.serialize<netem_pb.CopyMsg>;
    requestDeserialize: grpc.deserialize<netem_pb.CopyMsg>;
    responseSerialize: grpc.serialize<netem_pb.AckResponse>;
    responseDeserialize: grpc.deserialize<netem_pb.AckResponse>;
}

export const NetemService: INetemService;

export interface INetemServer {
    getVersion: grpc.handleUnaryCall<google_protobuf_empty_pb.Empty, netem_pb.VersionResponse>;
    pullImages: grpc.handleServerStreamingCall<google_protobuf_empty_pb.Empty, netem_pb.PullSrvMsg>;
    clean: grpc.handleUnaryCall<google_protobuf_empty_pb.Empty, netem_pb.AckResponse>;
    getProjects: grpc.handleUnaryCall<google_protobuf_empty_pb.Empty, netem_pb.PrjListResponse>;
    openProject: grpc.handleUnaryCall<netem_pb.OpenRequest, netem_pb.PrjOpenResponse>;
    closeProject: grpc.handleUnaryCall<netem_pb.ProjectRequest, netem_pb.AckResponse>;
    saveProject: grpc.handleUnaryCall<netem_pb.ProjectRequest, netem_pb.FileResponse>;
    getProjectConfigs: grpc.handleUnaryCall<netem_pb.ProjectRequest, netem_pb.FileResponse>;
    getProjectStatus: grpc.handleUnaryCall<netem_pb.ProjectRequest, netem_pb.StatusResponse>;
    readNetworkFile: grpc.handleUnaryCall<netem_pb.ProjectRequest, netem_pb.FileResponse>;
    writeNetworkFile: grpc.handleUnaryCall<netem_pb.WNetworkRequest, netem_pb.AckResponse>;
    check: grpc.handleUnaryCall<netem_pb.ProjectRequest, netem_pb.AckResponse>;
    reload: grpc.handleUnaryCall<netem_pb.ProjectRequest, netem_pb.RunResponse>;
    run: grpc.handleUnaryCall<netem_pb.ProjectRequest, netem_pb.RunResponse>;
    readConfigFiles: grpc.handleUnaryCall<netem_pb.NodeRequest, netem_pb.ConfigFilesResponse>;
    canRunConsole: grpc.handleUnaryCall<netem_pb.NodeRequest, netem_pb.AckResponse>;
    console: grpc.handleBidiStreamingCall<netem_pb.ConsoleCltMsg, netem_pb.ConsoleSrvMsg>;
    start: grpc.handleUnaryCall<netem_pb.NodeRequest, netem_pb.AckResponse>;
    stop: grpc.handleUnaryCall<netem_pb.NodeRequest, netem_pb.AckResponse>;
    restart: grpc.handleUnaryCall<netem_pb.NodeRequest, netem_pb.AckResponse>;
    setIfState: grpc.handleUnaryCall<netem_pb.NodeIfStateRequest, netem_pb.AckResponse>;
    capture: grpc.handleServerStreamingCall<netem_pb.NodeInterfaceRequest, netem_pb.CaptureSrvMsg>;
    copyFrom: grpc.handleServerStreamingCall<netem_pb.CopyMsg, netem_pb.CopyMsg>;
    copyTo: grpc.handleClientStreamingCall<netem_pb.CopyMsg, netem_pb.AckResponse>;
}

export interface INetemClient {
    getVersion(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: netem_pb.VersionResponse) => void): grpc.ClientUnaryCall;
    getVersion(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.VersionResponse) => void): grpc.ClientUnaryCall;
    getVersion(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.VersionResponse) => void): grpc.ClientUnaryCall;
    pullImages(request: google_protobuf_empty_pb.Empty, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<netem_pb.PullSrvMsg>;
    pullImages(request: google_protobuf_empty_pb.Empty, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<netem_pb.PullSrvMsg>;
    clean(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    clean(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    clean(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    getProjects(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: netem_pb.PrjListResponse) => void): grpc.ClientUnaryCall;
    getProjects(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.PrjListResponse) => void): grpc.ClientUnaryCall;
    getProjects(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.PrjListResponse) => void): grpc.ClientUnaryCall;
    openProject(request: netem_pb.OpenRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.PrjOpenResponse) => void): grpc.ClientUnaryCall;
    openProject(request: netem_pb.OpenRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.PrjOpenResponse) => void): grpc.ClientUnaryCall;
    openProject(request: netem_pb.OpenRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.PrjOpenResponse) => void): grpc.ClientUnaryCall;
    closeProject(request: netem_pb.ProjectRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    closeProject(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    closeProject(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    saveProject(request: netem_pb.ProjectRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.FileResponse) => void): grpc.ClientUnaryCall;
    saveProject(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.FileResponse) => void): grpc.ClientUnaryCall;
    saveProject(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.FileResponse) => void): grpc.ClientUnaryCall;
    getProjectConfigs(request: netem_pb.ProjectRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.FileResponse) => void): grpc.ClientUnaryCall;
    getProjectConfigs(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.FileResponse) => void): grpc.ClientUnaryCall;
    getProjectConfigs(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.FileResponse) => void): grpc.ClientUnaryCall;
    getProjectStatus(request: netem_pb.ProjectRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.StatusResponse) => void): grpc.ClientUnaryCall;
    getProjectStatus(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.StatusResponse) => void): grpc.ClientUnaryCall;
    getProjectStatus(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.StatusResponse) => void): grpc.ClientUnaryCall;
    readNetworkFile(request: netem_pb.ProjectRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.FileResponse) => void): grpc.ClientUnaryCall;
    readNetworkFile(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.FileResponse) => void): grpc.ClientUnaryCall;
    readNetworkFile(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.FileResponse) => void): grpc.ClientUnaryCall;
    writeNetworkFile(request: netem_pb.WNetworkRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    writeNetworkFile(request: netem_pb.WNetworkRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    writeNetworkFile(request: netem_pb.WNetworkRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    check(request: netem_pb.ProjectRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    check(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    check(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    reload(request: netem_pb.ProjectRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.RunResponse) => void): grpc.ClientUnaryCall;
    reload(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.RunResponse) => void): grpc.ClientUnaryCall;
    reload(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.RunResponse) => void): grpc.ClientUnaryCall;
    run(request: netem_pb.ProjectRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.RunResponse) => void): grpc.ClientUnaryCall;
    run(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.RunResponse) => void): grpc.ClientUnaryCall;
    run(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.RunResponse) => void): grpc.ClientUnaryCall;
    readConfigFiles(request: netem_pb.NodeRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.ConfigFilesResponse) => void): grpc.ClientUnaryCall;
    readConfigFiles(request: netem_pb.NodeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.ConfigFilesResponse) => void): grpc.ClientUnaryCall;
    readConfigFiles(request: netem_pb.NodeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.ConfigFilesResponse) => void): grpc.ClientUnaryCall;
    canRunConsole(request: netem_pb.NodeRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    canRunConsole(request: netem_pb.NodeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    canRunConsole(request: netem_pb.NodeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    console(): grpc.ClientDuplexStream<netem_pb.ConsoleCltMsg, netem_pb.ConsoleSrvMsg>;
    console(options: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<netem_pb.ConsoleCltMsg, netem_pb.ConsoleSrvMsg>;
    console(metadata: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<netem_pb.ConsoleCltMsg, netem_pb.ConsoleSrvMsg>;
    start(request: netem_pb.NodeRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    start(request: netem_pb.NodeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    start(request: netem_pb.NodeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    stop(request: netem_pb.NodeRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    stop(request: netem_pb.NodeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    stop(request: netem_pb.NodeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    restart(request: netem_pb.NodeRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    restart(request: netem_pb.NodeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    restart(request: netem_pb.NodeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    setIfState(request: netem_pb.NodeIfStateRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    setIfState(request: netem_pb.NodeIfStateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    setIfState(request: netem_pb.NodeIfStateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    capture(request: netem_pb.NodeInterfaceRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<netem_pb.CaptureSrvMsg>;
    capture(request: netem_pb.NodeInterfaceRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<netem_pb.CaptureSrvMsg>;
    copyFrom(request: netem_pb.CopyMsg, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<netem_pb.CopyMsg>;
    copyFrom(request: netem_pb.CopyMsg, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<netem_pb.CopyMsg>;
    copyTo(callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientWritableStream<netem_pb.CopyMsg>;
    copyTo(metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientWritableStream<netem_pb.CopyMsg>;
    copyTo(options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientWritableStream<netem_pb.CopyMsg>;
    copyTo(metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientWritableStream<netem_pb.CopyMsg>;
}

export class NetemClient extends grpc.Client implements INetemClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public getVersion(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: netem_pb.VersionResponse) => void): grpc.ClientUnaryCall;
    public getVersion(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.VersionResponse) => void): grpc.ClientUnaryCall;
    public getVersion(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.VersionResponse) => void): grpc.ClientUnaryCall;
    public pullImages(request: google_protobuf_empty_pb.Empty, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<netem_pb.PullSrvMsg>;
    public pullImages(request: google_protobuf_empty_pb.Empty, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<netem_pb.PullSrvMsg>;
    public clean(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public clean(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public clean(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public getProjects(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: netem_pb.PrjListResponse) => void): grpc.ClientUnaryCall;
    public getProjects(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.PrjListResponse) => void): grpc.ClientUnaryCall;
    public getProjects(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.PrjListResponse) => void): grpc.ClientUnaryCall;
    public openProject(request: netem_pb.OpenRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.PrjOpenResponse) => void): grpc.ClientUnaryCall;
    public openProject(request: netem_pb.OpenRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.PrjOpenResponse) => void): grpc.ClientUnaryCall;
    public openProject(request: netem_pb.OpenRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.PrjOpenResponse) => void): grpc.ClientUnaryCall;
    public closeProject(request: netem_pb.ProjectRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public closeProject(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public closeProject(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public saveProject(request: netem_pb.ProjectRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.FileResponse) => void): grpc.ClientUnaryCall;
    public saveProject(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.FileResponse) => void): grpc.ClientUnaryCall;
    public saveProject(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.FileResponse) => void): grpc.ClientUnaryCall;
    public getProjectConfigs(request: netem_pb.ProjectRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.FileResponse) => void): grpc.ClientUnaryCall;
    public getProjectConfigs(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.FileResponse) => void): grpc.ClientUnaryCall;
    public getProjectConfigs(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.FileResponse) => void): grpc.ClientUnaryCall;
    public getProjectStatus(request: netem_pb.ProjectRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.StatusResponse) => void): grpc.ClientUnaryCall;
    public getProjectStatus(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.StatusResponse) => void): grpc.ClientUnaryCall;
    public getProjectStatus(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.StatusResponse) => void): grpc.ClientUnaryCall;
    public readNetworkFile(request: netem_pb.ProjectRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.FileResponse) => void): grpc.ClientUnaryCall;
    public readNetworkFile(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.FileResponse) => void): grpc.ClientUnaryCall;
    public readNetworkFile(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.FileResponse) => void): grpc.ClientUnaryCall;
    public writeNetworkFile(request: netem_pb.WNetworkRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public writeNetworkFile(request: netem_pb.WNetworkRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public writeNetworkFile(request: netem_pb.WNetworkRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public check(request: netem_pb.ProjectRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public check(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public check(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public reload(request: netem_pb.ProjectRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.RunResponse) => void): grpc.ClientUnaryCall;
    public reload(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.RunResponse) => void): grpc.ClientUnaryCall;
    public reload(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.RunResponse) => void): grpc.ClientUnaryCall;
    public run(request: netem_pb.ProjectRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.RunResponse) => void): grpc.ClientUnaryCall;
    public run(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.RunResponse) => void): grpc.ClientUnaryCall;
    public run(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.RunResponse) => void): grpc.ClientUnaryCall;
    public readConfigFiles(request: netem_pb.NodeRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.ConfigFilesResponse) => void): grpc.ClientUnaryCall;
    public readConfigFiles(request: netem_pb.NodeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.ConfigFilesResponse) => void): grpc.ClientUnaryCall;
    public readConfigFiles(request: netem_pb.NodeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.ConfigFilesResponse) => void): grpc.ClientUnaryCall;
    public canRunConsole(request: netem_pb.NodeRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public canRunConsole(request: netem_pb.NodeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public canRunConsole(request: netem_pb.NodeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public console(options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<netem_pb.ConsoleCltMsg, netem_pb.ConsoleSrvMsg>;
    public console(metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<netem_pb.ConsoleCltMsg, netem_pb.ConsoleSrvMsg>;
    public start(request: netem_pb.NodeRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public start(request: netem_pb.NodeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public start(request: netem_pb.NodeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public stop(request: netem_pb.NodeRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public stop(request: netem_pb.NodeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public stop(request: netem_pb.NodeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public restart(request: netem_pb.NodeRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public restart(request: netem_pb.NodeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public restart(request: netem_pb.NodeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public setIfState(request: netem_pb.NodeIfStateRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public setIfState(request: netem_pb.NodeIfStateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public setIfState(request: netem_pb.NodeIfStateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public capture(request: netem_pb.NodeInterfaceRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<netem_pb.CaptureSrvMsg>;
    public capture(request: netem_pb.NodeInterfaceRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<netem_pb.CaptureSrvMsg>;
    public copyFrom(request: netem_pb.CopyMsg, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<netem_pb.CopyMsg>;
    public copyFrom(request: netem_pb.CopyMsg, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<netem_pb.CopyMsg>;
    public copyTo(callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientWritableStream<netem_pb.CopyMsg>;
    public copyTo(metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientWritableStream<netem_pb.CopyMsg>;
    public copyTo(options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientWritableStream<netem_pb.CopyMsg>;
    public copyTo(metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientWritableStream<netem_pb.CopyMsg>;
}
