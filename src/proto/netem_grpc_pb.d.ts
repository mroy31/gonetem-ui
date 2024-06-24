// package: netem
// file: netem.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "grpc";
import * as netem_pb from "./netem_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

interface INetemService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    serverGetVersion: INetemService_IServerGetVersion;
    serverPullImages: INetemService_IServerPullImages;
    serverCleanContainers: INetemService_IServerCleanContainers;
    projectGetMany: INetemService_IProjectGetMany;
    projectOpen: INetemService_IProjectOpen;
    projectClose: INetemService_IProjectClose;
    projectSave: INetemService_IProjectSave;
    projectGetNodeConfigs: INetemService_IProjectGetNodeConfigs;
    projectGetStatus: INetemService_IProjectGetStatus;
    readNetworkFile: INetemService_IReadNetworkFile;
    writeNetworkFile: INetemService_IWriteNetworkFile;
    topologyCheck: INetemService_ITopologyCheck;
    topologyReload: INetemService_ITopologyReload;
    topologyRun: INetemService_ITopologyRun;
    topologyStartAll: INetemService_ITopologyStartAll;
    topologyStopAll: INetemService_ITopologyStopAll;
    nodeReadConfigFiles: INetemService_INodeReadConfigFiles;
    nodeCanRunConsole: INetemService_INodeCanRunConsole;
    nodeConsole: INetemService_INodeConsole;
    nodeStart: INetemService_INodeStart;
    nodeStop: INetemService_INodeStop;
    nodeRestart: INetemService_INodeRestart;
    nodeSetIfState: INetemService_INodeSetIfState;
    nodeCapture: INetemService_INodeCapture;
    nodeCopyFrom: INetemService_INodeCopyFrom;
    nodeCopyTo: INetemService_INodeCopyTo;
    linkUpdate: INetemService_ILinkUpdate;
}

interface INetemService_IServerGetVersion extends grpc.MethodDefinition<google_protobuf_empty_pb.Empty, netem_pb.VersionResponse> {
    path: "/netem.Netem/ServerGetVersion";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    requestDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
    responseSerialize: grpc.serialize<netem_pb.VersionResponse>;
    responseDeserialize: grpc.deserialize<netem_pb.VersionResponse>;
}
interface INetemService_IServerPullImages extends grpc.MethodDefinition<google_protobuf_empty_pb.Empty, netem_pb.PullSrvMsg> {
    path: "/netem.Netem/ServerPullImages";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    requestDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
    responseSerialize: grpc.serialize<netem_pb.PullSrvMsg>;
    responseDeserialize: grpc.deserialize<netem_pb.PullSrvMsg>;
}
interface INetemService_IServerCleanContainers extends grpc.MethodDefinition<google_protobuf_empty_pb.Empty, netem_pb.AckResponse> {
    path: "/netem.Netem/ServerCleanContainers";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    requestDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
    responseSerialize: grpc.serialize<netem_pb.AckResponse>;
    responseDeserialize: grpc.deserialize<netem_pb.AckResponse>;
}
interface INetemService_IProjectGetMany extends grpc.MethodDefinition<google_protobuf_empty_pb.Empty, netem_pb.PrjListResponse> {
    path: "/netem.Netem/ProjectGetMany";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    requestDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
    responseSerialize: grpc.serialize<netem_pb.PrjListResponse>;
    responseDeserialize: grpc.deserialize<netem_pb.PrjListResponse>;
}
interface INetemService_IProjectOpen extends grpc.MethodDefinition<netem_pb.OpenRequest, netem_pb.PrjOpenResponse> {
    path: "/netem.Netem/ProjectOpen";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<netem_pb.OpenRequest>;
    requestDeserialize: grpc.deserialize<netem_pb.OpenRequest>;
    responseSerialize: grpc.serialize<netem_pb.PrjOpenResponse>;
    responseDeserialize: grpc.deserialize<netem_pb.PrjOpenResponse>;
}
interface INetemService_IProjectClose extends grpc.MethodDefinition<netem_pb.ProjectRequest, netem_pb.ProjectCloseMsg> {
    path: "/netem.Netem/ProjectClose";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<netem_pb.ProjectRequest>;
    requestDeserialize: grpc.deserialize<netem_pb.ProjectRequest>;
    responseSerialize: grpc.serialize<netem_pb.ProjectCloseMsg>;
    responseDeserialize: grpc.deserialize<netem_pb.ProjectCloseMsg>;
}
interface INetemService_IProjectSave extends grpc.MethodDefinition<netem_pb.ProjectRequest, netem_pb.ProjectSaveMsg> {
    path: "/netem.Netem/ProjectSave";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<netem_pb.ProjectRequest>;
    requestDeserialize: grpc.deserialize<netem_pb.ProjectRequest>;
    responseSerialize: grpc.serialize<netem_pb.ProjectSaveMsg>;
    responseDeserialize: grpc.deserialize<netem_pb.ProjectSaveMsg>;
}
interface INetemService_IProjectGetNodeConfigs extends grpc.MethodDefinition<netem_pb.ProjectRequest, netem_pb.FileResponse> {
    path: "/netem.Netem/ProjectGetNodeConfigs";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<netem_pb.ProjectRequest>;
    requestDeserialize: grpc.deserialize<netem_pb.ProjectRequest>;
    responseSerialize: grpc.serialize<netem_pb.FileResponse>;
    responseDeserialize: grpc.deserialize<netem_pb.FileResponse>;
}
interface INetemService_IProjectGetStatus extends grpc.MethodDefinition<netem_pb.ProjectRequest, netem_pb.StatusResponse> {
    path: "/netem.Netem/ProjectGetStatus";
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
interface INetemService_ITopologyCheck extends grpc.MethodDefinition<netem_pb.ProjectRequest, netem_pb.AckResponse> {
    path: "/netem.Netem/TopologyCheck";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<netem_pb.ProjectRequest>;
    requestDeserialize: grpc.deserialize<netem_pb.ProjectRequest>;
    responseSerialize: grpc.serialize<netem_pb.AckResponse>;
    responseDeserialize: grpc.deserialize<netem_pb.AckResponse>;
}
interface INetemService_ITopologyReload extends grpc.MethodDefinition<netem_pb.ProjectRequest, netem_pb.TopologyRunMsg> {
    path: "/netem.Netem/TopologyReload";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<netem_pb.ProjectRequest>;
    requestDeserialize: grpc.deserialize<netem_pb.ProjectRequest>;
    responseSerialize: grpc.serialize<netem_pb.TopologyRunMsg>;
    responseDeserialize: grpc.deserialize<netem_pb.TopologyRunMsg>;
}
interface INetemService_ITopologyRun extends grpc.MethodDefinition<netem_pb.ProjectRequest, netem_pb.TopologyRunMsg> {
    path: "/netem.Netem/TopologyRun";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<netem_pb.ProjectRequest>;
    requestDeserialize: grpc.deserialize<netem_pb.ProjectRequest>;
    responseSerialize: grpc.serialize<netem_pb.TopologyRunMsg>;
    responseDeserialize: grpc.deserialize<netem_pb.TopologyRunMsg>;
}
interface INetemService_ITopologyStartAll extends grpc.MethodDefinition<netem_pb.ProjectRequest, netem_pb.AckResponse> {
    path: "/netem.Netem/TopologyStartAll";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<netem_pb.ProjectRequest>;
    requestDeserialize: grpc.deserialize<netem_pb.ProjectRequest>;
    responseSerialize: grpc.serialize<netem_pb.AckResponse>;
    responseDeserialize: grpc.deserialize<netem_pb.AckResponse>;
}
interface INetemService_ITopologyStopAll extends grpc.MethodDefinition<netem_pb.ProjectRequest, netem_pb.AckResponse> {
    path: "/netem.Netem/TopologyStopAll";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<netem_pb.ProjectRequest>;
    requestDeserialize: grpc.deserialize<netem_pb.ProjectRequest>;
    responseSerialize: grpc.serialize<netem_pb.AckResponse>;
    responseDeserialize: grpc.deserialize<netem_pb.AckResponse>;
}
interface INetemService_INodeReadConfigFiles extends grpc.MethodDefinition<netem_pb.NodeRequest, netem_pb.ConfigFilesResponse> {
    path: "/netem.Netem/NodeReadConfigFiles";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<netem_pb.NodeRequest>;
    requestDeserialize: grpc.deserialize<netem_pb.NodeRequest>;
    responseSerialize: grpc.serialize<netem_pb.ConfigFilesResponse>;
    responseDeserialize: grpc.deserialize<netem_pb.ConfigFilesResponse>;
}
interface INetemService_INodeCanRunConsole extends grpc.MethodDefinition<netem_pb.NodeRequest, netem_pb.AckResponse> {
    path: "/netem.Netem/NodeCanRunConsole";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<netem_pb.NodeRequest>;
    requestDeserialize: grpc.deserialize<netem_pb.NodeRequest>;
    responseSerialize: grpc.serialize<netem_pb.AckResponse>;
    responseDeserialize: grpc.deserialize<netem_pb.AckResponse>;
}
interface INetemService_INodeConsole extends grpc.MethodDefinition<netem_pb.ConsoleCltMsg, netem_pb.ConsoleSrvMsg> {
    path: "/netem.Netem/NodeConsole";
    requestStream: true;
    responseStream: true;
    requestSerialize: grpc.serialize<netem_pb.ConsoleCltMsg>;
    requestDeserialize: grpc.deserialize<netem_pb.ConsoleCltMsg>;
    responseSerialize: grpc.serialize<netem_pb.ConsoleSrvMsg>;
    responseDeserialize: grpc.deserialize<netem_pb.ConsoleSrvMsg>;
}
interface INetemService_INodeStart extends grpc.MethodDefinition<netem_pb.NodeRequest, netem_pb.AckResponse> {
    path: "/netem.Netem/NodeStart";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<netem_pb.NodeRequest>;
    requestDeserialize: grpc.deserialize<netem_pb.NodeRequest>;
    responseSerialize: grpc.serialize<netem_pb.AckResponse>;
    responseDeserialize: grpc.deserialize<netem_pb.AckResponse>;
}
interface INetemService_INodeStop extends grpc.MethodDefinition<netem_pb.NodeRequest, netem_pb.AckResponse> {
    path: "/netem.Netem/NodeStop";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<netem_pb.NodeRequest>;
    requestDeserialize: grpc.deserialize<netem_pb.NodeRequest>;
    responseSerialize: grpc.serialize<netem_pb.AckResponse>;
    responseDeserialize: grpc.deserialize<netem_pb.AckResponse>;
}
interface INetemService_INodeRestart extends grpc.MethodDefinition<netem_pb.NodeRequest, netem_pb.AckResponse> {
    path: "/netem.Netem/NodeRestart";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<netem_pb.NodeRequest>;
    requestDeserialize: grpc.deserialize<netem_pb.NodeRequest>;
    responseSerialize: grpc.serialize<netem_pb.AckResponse>;
    responseDeserialize: grpc.deserialize<netem_pb.AckResponse>;
}
interface INetemService_INodeSetIfState extends grpc.MethodDefinition<netem_pb.NodeIfStateRequest, netem_pb.AckResponse> {
    path: "/netem.Netem/NodeSetIfState";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<netem_pb.NodeIfStateRequest>;
    requestDeserialize: grpc.deserialize<netem_pb.NodeIfStateRequest>;
    responseSerialize: grpc.serialize<netem_pb.AckResponse>;
    responseDeserialize: grpc.deserialize<netem_pb.AckResponse>;
}
interface INetemService_INodeCapture extends grpc.MethodDefinition<netem_pb.NodeInterfaceRequest, netem_pb.CaptureSrvMsg> {
    path: "/netem.Netem/NodeCapture";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<netem_pb.NodeInterfaceRequest>;
    requestDeserialize: grpc.deserialize<netem_pb.NodeInterfaceRequest>;
    responseSerialize: grpc.serialize<netem_pb.CaptureSrvMsg>;
    responseDeserialize: grpc.deserialize<netem_pb.CaptureSrvMsg>;
}
interface INetemService_INodeCopyFrom extends grpc.MethodDefinition<netem_pb.CopyMsg, netem_pb.CopyMsg> {
    path: "/netem.Netem/NodeCopyFrom";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<netem_pb.CopyMsg>;
    requestDeserialize: grpc.deserialize<netem_pb.CopyMsg>;
    responseSerialize: grpc.serialize<netem_pb.CopyMsg>;
    responseDeserialize: grpc.deserialize<netem_pb.CopyMsg>;
}
interface INetemService_INodeCopyTo extends grpc.MethodDefinition<netem_pb.CopyMsg, netem_pb.AckResponse> {
    path: "/netem.Netem/NodeCopyTo";
    requestStream: true;
    responseStream: false;
    requestSerialize: grpc.serialize<netem_pb.CopyMsg>;
    requestDeserialize: grpc.deserialize<netem_pb.CopyMsg>;
    responseSerialize: grpc.serialize<netem_pb.AckResponse>;
    responseDeserialize: grpc.deserialize<netem_pb.AckResponse>;
}
interface INetemService_ILinkUpdate extends grpc.MethodDefinition<netem_pb.LinkRequest, netem_pb.AckResponse> {
    path: "/netem.Netem/LinkUpdate";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<netem_pb.LinkRequest>;
    requestDeserialize: grpc.deserialize<netem_pb.LinkRequest>;
    responseSerialize: grpc.serialize<netem_pb.AckResponse>;
    responseDeserialize: grpc.deserialize<netem_pb.AckResponse>;
}

export const NetemService: INetemService;

export interface INetemServer {
    serverGetVersion: grpc.handleUnaryCall<google_protobuf_empty_pb.Empty, netem_pb.VersionResponse>;
    serverPullImages: grpc.handleServerStreamingCall<google_protobuf_empty_pb.Empty, netem_pb.PullSrvMsg>;
    serverCleanContainers: grpc.handleUnaryCall<google_protobuf_empty_pb.Empty, netem_pb.AckResponse>;
    projectGetMany: grpc.handleUnaryCall<google_protobuf_empty_pb.Empty, netem_pb.PrjListResponse>;
    projectOpen: grpc.handleUnaryCall<netem_pb.OpenRequest, netem_pb.PrjOpenResponse>;
    projectClose: grpc.handleServerStreamingCall<netem_pb.ProjectRequest, netem_pb.ProjectCloseMsg>;
    projectSave: grpc.handleServerStreamingCall<netem_pb.ProjectRequest, netem_pb.ProjectSaveMsg>;
    projectGetNodeConfigs: grpc.handleUnaryCall<netem_pb.ProjectRequest, netem_pb.FileResponse>;
    projectGetStatus: grpc.handleUnaryCall<netem_pb.ProjectRequest, netem_pb.StatusResponse>;
    readNetworkFile: grpc.handleUnaryCall<netem_pb.ProjectRequest, netem_pb.FileResponse>;
    writeNetworkFile: grpc.handleUnaryCall<netem_pb.WNetworkRequest, netem_pb.AckResponse>;
    topologyCheck: grpc.handleUnaryCall<netem_pb.ProjectRequest, netem_pb.AckResponse>;
    topologyReload: grpc.handleServerStreamingCall<netem_pb.ProjectRequest, netem_pb.TopologyRunMsg>;
    topologyRun: grpc.handleServerStreamingCall<netem_pb.ProjectRequest, netem_pb.TopologyRunMsg>;
    topologyStartAll: grpc.handleUnaryCall<netem_pb.ProjectRequest, netem_pb.AckResponse>;
    topologyStopAll: grpc.handleUnaryCall<netem_pb.ProjectRequest, netem_pb.AckResponse>;
    nodeReadConfigFiles: grpc.handleUnaryCall<netem_pb.NodeRequest, netem_pb.ConfigFilesResponse>;
    nodeCanRunConsole: grpc.handleUnaryCall<netem_pb.NodeRequest, netem_pb.AckResponse>;
    nodeConsole: grpc.handleBidiStreamingCall<netem_pb.ConsoleCltMsg, netem_pb.ConsoleSrvMsg>;
    nodeStart: grpc.handleUnaryCall<netem_pb.NodeRequest, netem_pb.AckResponse>;
    nodeStop: grpc.handleUnaryCall<netem_pb.NodeRequest, netem_pb.AckResponse>;
    nodeRestart: grpc.handleUnaryCall<netem_pb.NodeRequest, netem_pb.AckResponse>;
    nodeSetIfState: grpc.handleUnaryCall<netem_pb.NodeIfStateRequest, netem_pb.AckResponse>;
    nodeCapture: grpc.handleServerStreamingCall<netem_pb.NodeInterfaceRequest, netem_pb.CaptureSrvMsg>;
    nodeCopyFrom: grpc.handleServerStreamingCall<netem_pb.CopyMsg, netem_pb.CopyMsg>;
    nodeCopyTo: grpc.handleClientStreamingCall<netem_pb.CopyMsg, netem_pb.AckResponse>;
    linkUpdate: grpc.handleUnaryCall<netem_pb.LinkRequest, netem_pb.AckResponse>;
}

export interface INetemClient {
    serverGetVersion(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: netem_pb.VersionResponse) => void): grpc.ClientUnaryCall;
    serverGetVersion(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.VersionResponse) => void): grpc.ClientUnaryCall;
    serverGetVersion(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.VersionResponse) => void): grpc.ClientUnaryCall;
    serverPullImages(request: google_protobuf_empty_pb.Empty, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<netem_pb.PullSrvMsg>;
    serverPullImages(request: google_protobuf_empty_pb.Empty, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<netem_pb.PullSrvMsg>;
    serverCleanContainers(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    serverCleanContainers(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    serverCleanContainers(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    projectGetMany(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: netem_pb.PrjListResponse) => void): grpc.ClientUnaryCall;
    projectGetMany(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.PrjListResponse) => void): grpc.ClientUnaryCall;
    projectGetMany(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.PrjListResponse) => void): grpc.ClientUnaryCall;
    projectOpen(request: netem_pb.OpenRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.PrjOpenResponse) => void): grpc.ClientUnaryCall;
    projectOpen(request: netem_pb.OpenRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.PrjOpenResponse) => void): grpc.ClientUnaryCall;
    projectOpen(request: netem_pb.OpenRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.PrjOpenResponse) => void): grpc.ClientUnaryCall;
    projectClose(request: netem_pb.ProjectRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<netem_pb.ProjectCloseMsg>;
    projectClose(request: netem_pb.ProjectRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<netem_pb.ProjectCloseMsg>;
    projectSave(request: netem_pb.ProjectRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<netem_pb.ProjectSaveMsg>;
    projectSave(request: netem_pb.ProjectRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<netem_pb.ProjectSaveMsg>;
    projectGetNodeConfigs(request: netem_pb.ProjectRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.FileResponse) => void): grpc.ClientUnaryCall;
    projectGetNodeConfigs(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.FileResponse) => void): grpc.ClientUnaryCall;
    projectGetNodeConfigs(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.FileResponse) => void): grpc.ClientUnaryCall;
    projectGetStatus(request: netem_pb.ProjectRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.StatusResponse) => void): grpc.ClientUnaryCall;
    projectGetStatus(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.StatusResponse) => void): grpc.ClientUnaryCall;
    projectGetStatus(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.StatusResponse) => void): grpc.ClientUnaryCall;
    readNetworkFile(request: netem_pb.ProjectRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.FileResponse) => void): grpc.ClientUnaryCall;
    readNetworkFile(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.FileResponse) => void): grpc.ClientUnaryCall;
    readNetworkFile(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.FileResponse) => void): grpc.ClientUnaryCall;
    writeNetworkFile(request: netem_pb.WNetworkRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    writeNetworkFile(request: netem_pb.WNetworkRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    writeNetworkFile(request: netem_pb.WNetworkRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    topologyCheck(request: netem_pb.ProjectRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    topologyCheck(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    topologyCheck(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    topologyReload(request: netem_pb.ProjectRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<netem_pb.TopologyRunMsg>;
    topologyReload(request: netem_pb.ProjectRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<netem_pb.TopologyRunMsg>;
    topologyRun(request: netem_pb.ProjectRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<netem_pb.TopologyRunMsg>;
    topologyRun(request: netem_pb.ProjectRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<netem_pb.TopologyRunMsg>;
    topologyStartAll(request: netem_pb.ProjectRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    topologyStartAll(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    topologyStartAll(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    topologyStopAll(request: netem_pb.ProjectRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    topologyStopAll(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    topologyStopAll(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    nodeReadConfigFiles(request: netem_pb.NodeRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.ConfigFilesResponse) => void): grpc.ClientUnaryCall;
    nodeReadConfigFiles(request: netem_pb.NodeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.ConfigFilesResponse) => void): grpc.ClientUnaryCall;
    nodeReadConfigFiles(request: netem_pb.NodeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.ConfigFilesResponse) => void): grpc.ClientUnaryCall;
    nodeCanRunConsole(request: netem_pb.NodeRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    nodeCanRunConsole(request: netem_pb.NodeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    nodeCanRunConsole(request: netem_pb.NodeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    nodeConsole(): grpc.ClientDuplexStream<netem_pb.ConsoleCltMsg, netem_pb.ConsoleSrvMsg>;
    nodeConsole(options: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<netem_pb.ConsoleCltMsg, netem_pb.ConsoleSrvMsg>;
    nodeConsole(metadata: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<netem_pb.ConsoleCltMsg, netem_pb.ConsoleSrvMsg>;
    nodeStart(request: netem_pb.NodeRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    nodeStart(request: netem_pb.NodeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    nodeStart(request: netem_pb.NodeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    nodeStop(request: netem_pb.NodeRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    nodeStop(request: netem_pb.NodeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    nodeStop(request: netem_pb.NodeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    nodeRestart(request: netem_pb.NodeRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    nodeRestart(request: netem_pb.NodeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    nodeRestart(request: netem_pb.NodeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    nodeSetIfState(request: netem_pb.NodeIfStateRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    nodeSetIfState(request: netem_pb.NodeIfStateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    nodeSetIfState(request: netem_pb.NodeIfStateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    nodeCapture(request: netem_pb.NodeInterfaceRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<netem_pb.CaptureSrvMsg>;
    nodeCapture(request: netem_pb.NodeInterfaceRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<netem_pb.CaptureSrvMsg>;
    nodeCopyFrom(request: netem_pb.CopyMsg, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<netem_pb.CopyMsg>;
    nodeCopyFrom(request: netem_pb.CopyMsg, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<netem_pb.CopyMsg>;
    nodeCopyTo(callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientWritableStream<netem_pb.CopyMsg>;
    nodeCopyTo(metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientWritableStream<netem_pb.CopyMsg>;
    nodeCopyTo(options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientWritableStream<netem_pb.CopyMsg>;
    nodeCopyTo(metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientWritableStream<netem_pb.CopyMsg>;
    linkUpdate(request: netem_pb.LinkRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    linkUpdate(request: netem_pb.LinkRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    linkUpdate(request: netem_pb.LinkRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
}

export class NetemClient extends grpc.Client implements INetemClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public serverGetVersion(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: netem_pb.VersionResponse) => void): grpc.ClientUnaryCall;
    public serverGetVersion(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.VersionResponse) => void): grpc.ClientUnaryCall;
    public serverGetVersion(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.VersionResponse) => void): grpc.ClientUnaryCall;
    public serverPullImages(request: google_protobuf_empty_pb.Empty, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<netem_pb.PullSrvMsg>;
    public serverPullImages(request: google_protobuf_empty_pb.Empty, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<netem_pb.PullSrvMsg>;
    public serverCleanContainers(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public serverCleanContainers(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public serverCleanContainers(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public projectGetMany(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: netem_pb.PrjListResponse) => void): grpc.ClientUnaryCall;
    public projectGetMany(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.PrjListResponse) => void): grpc.ClientUnaryCall;
    public projectGetMany(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.PrjListResponse) => void): grpc.ClientUnaryCall;
    public projectOpen(request: netem_pb.OpenRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.PrjOpenResponse) => void): grpc.ClientUnaryCall;
    public projectOpen(request: netem_pb.OpenRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.PrjOpenResponse) => void): grpc.ClientUnaryCall;
    public projectOpen(request: netem_pb.OpenRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.PrjOpenResponse) => void): grpc.ClientUnaryCall;
    public projectClose(request: netem_pb.ProjectRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<netem_pb.ProjectCloseMsg>;
    public projectClose(request: netem_pb.ProjectRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<netem_pb.ProjectCloseMsg>;
    public projectSave(request: netem_pb.ProjectRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<netem_pb.ProjectSaveMsg>;
    public projectSave(request: netem_pb.ProjectRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<netem_pb.ProjectSaveMsg>;
    public projectGetNodeConfigs(request: netem_pb.ProjectRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.FileResponse) => void): grpc.ClientUnaryCall;
    public projectGetNodeConfigs(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.FileResponse) => void): grpc.ClientUnaryCall;
    public projectGetNodeConfigs(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.FileResponse) => void): grpc.ClientUnaryCall;
    public projectGetStatus(request: netem_pb.ProjectRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.StatusResponse) => void): grpc.ClientUnaryCall;
    public projectGetStatus(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.StatusResponse) => void): grpc.ClientUnaryCall;
    public projectGetStatus(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.StatusResponse) => void): grpc.ClientUnaryCall;
    public readNetworkFile(request: netem_pb.ProjectRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.FileResponse) => void): grpc.ClientUnaryCall;
    public readNetworkFile(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.FileResponse) => void): grpc.ClientUnaryCall;
    public readNetworkFile(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.FileResponse) => void): grpc.ClientUnaryCall;
    public writeNetworkFile(request: netem_pb.WNetworkRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public writeNetworkFile(request: netem_pb.WNetworkRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public writeNetworkFile(request: netem_pb.WNetworkRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public topologyCheck(request: netem_pb.ProjectRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public topologyCheck(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public topologyCheck(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public topologyReload(request: netem_pb.ProjectRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<netem_pb.TopologyRunMsg>;
    public topologyReload(request: netem_pb.ProjectRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<netem_pb.TopologyRunMsg>;
    public topologyRun(request: netem_pb.ProjectRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<netem_pb.TopologyRunMsg>;
    public topologyRun(request: netem_pb.ProjectRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<netem_pb.TopologyRunMsg>;
    public topologyStartAll(request: netem_pb.ProjectRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public topologyStartAll(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public topologyStartAll(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public topologyStopAll(request: netem_pb.ProjectRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public topologyStopAll(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public topologyStopAll(request: netem_pb.ProjectRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public nodeReadConfigFiles(request: netem_pb.NodeRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.ConfigFilesResponse) => void): grpc.ClientUnaryCall;
    public nodeReadConfigFiles(request: netem_pb.NodeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.ConfigFilesResponse) => void): grpc.ClientUnaryCall;
    public nodeReadConfigFiles(request: netem_pb.NodeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.ConfigFilesResponse) => void): grpc.ClientUnaryCall;
    public nodeCanRunConsole(request: netem_pb.NodeRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public nodeCanRunConsole(request: netem_pb.NodeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public nodeCanRunConsole(request: netem_pb.NodeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public nodeConsole(options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<netem_pb.ConsoleCltMsg, netem_pb.ConsoleSrvMsg>;
    public nodeConsole(metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<netem_pb.ConsoleCltMsg, netem_pb.ConsoleSrvMsg>;
    public nodeStart(request: netem_pb.NodeRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public nodeStart(request: netem_pb.NodeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public nodeStart(request: netem_pb.NodeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public nodeStop(request: netem_pb.NodeRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public nodeStop(request: netem_pb.NodeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public nodeStop(request: netem_pb.NodeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public nodeRestart(request: netem_pb.NodeRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public nodeRestart(request: netem_pb.NodeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public nodeRestart(request: netem_pb.NodeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public nodeSetIfState(request: netem_pb.NodeIfStateRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public nodeSetIfState(request: netem_pb.NodeIfStateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public nodeSetIfState(request: netem_pb.NodeIfStateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public nodeCapture(request: netem_pb.NodeInterfaceRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<netem_pb.CaptureSrvMsg>;
    public nodeCapture(request: netem_pb.NodeInterfaceRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<netem_pb.CaptureSrvMsg>;
    public nodeCopyFrom(request: netem_pb.CopyMsg, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<netem_pb.CopyMsg>;
    public nodeCopyFrom(request: netem_pb.CopyMsg, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<netem_pb.CopyMsg>;
    public nodeCopyTo(callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientWritableStream<netem_pb.CopyMsg>;
    public nodeCopyTo(metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientWritableStream<netem_pb.CopyMsg>;
    public nodeCopyTo(options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientWritableStream<netem_pb.CopyMsg>;
    public nodeCopyTo(metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientWritableStream<netem_pb.CopyMsg>;
    public linkUpdate(request: netem_pb.LinkRequest, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public linkUpdate(request: netem_pb.LinkRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
    public linkUpdate(request: netem_pb.LinkRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: netem_pb.AckResponse) => void): grpc.ClientUnaryCall;
}
