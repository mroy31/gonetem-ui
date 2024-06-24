// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var netem_pb = require('./netem_pb.js');
var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js');

function serialize_google_protobuf_Empty(arg) {
  if (!(arg instanceof google_protobuf_empty_pb.Empty)) {
    throw new Error('Expected argument of type google.protobuf.Empty');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_google_protobuf_Empty(buffer_arg) {
  return google_protobuf_empty_pb.Empty.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_netem_AckResponse(arg) {
  if (!(arg instanceof netem_pb.AckResponse)) {
    throw new Error('Expected argument of type netem.AckResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_netem_AckResponse(buffer_arg) {
  return netem_pb.AckResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_netem_CaptureSrvMsg(arg) {
  if (!(arg instanceof netem_pb.CaptureSrvMsg)) {
    throw new Error('Expected argument of type netem.CaptureSrvMsg');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_netem_CaptureSrvMsg(buffer_arg) {
  return netem_pb.CaptureSrvMsg.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_netem_ConfigFilesResponse(arg) {
  if (!(arg instanceof netem_pb.ConfigFilesResponse)) {
    throw new Error('Expected argument of type netem.ConfigFilesResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_netem_ConfigFilesResponse(buffer_arg) {
  return netem_pb.ConfigFilesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_netem_ConsoleCltMsg(arg) {
  if (!(arg instanceof netem_pb.ConsoleCltMsg)) {
    throw new Error('Expected argument of type netem.ConsoleCltMsg');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_netem_ConsoleCltMsg(buffer_arg) {
  return netem_pb.ConsoleCltMsg.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_netem_ConsoleSrvMsg(arg) {
  if (!(arg instanceof netem_pb.ConsoleSrvMsg)) {
    throw new Error('Expected argument of type netem.ConsoleSrvMsg');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_netem_ConsoleSrvMsg(buffer_arg) {
  return netem_pb.ConsoleSrvMsg.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_netem_CopyMsg(arg) {
  if (!(arg instanceof netem_pb.CopyMsg)) {
    throw new Error('Expected argument of type netem.CopyMsg');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_netem_CopyMsg(buffer_arg) {
  return netem_pb.CopyMsg.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_netem_FileResponse(arg) {
  if (!(arg instanceof netem_pb.FileResponse)) {
    throw new Error('Expected argument of type netem.FileResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_netem_FileResponse(buffer_arg) {
  return netem_pb.FileResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_netem_LinkRequest(arg) {
  if (!(arg instanceof netem_pb.LinkRequest)) {
    throw new Error('Expected argument of type netem.LinkRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_netem_LinkRequest(buffer_arg) {
  return netem_pb.LinkRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_netem_NodeIfStateRequest(arg) {
  if (!(arg instanceof netem_pb.NodeIfStateRequest)) {
    throw new Error('Expected argument of type netem.NodeIfStateRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_netem_NodeIfStateRequest(buffer_arg) {
  return netem_pb.NodeIfStateRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_netem_NodeInterfaceRequest(arg) {
  if (!(arg instanceof netem_pb.NodeInterfaceRequest)) {
    throw new Error('Expected argument of type netem.NodeInterfaceRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_netem_NodeInterfaceRequest(buffer_arg) {
  return netem_pb.NodeInterfaceRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_netem_NodeRequest(arg) {
  if (!(arg instanceof netem_pb.NodeRequest)) {
    throw new Error('Expected argument of type netem.NodeRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_netem_NodeRequest(buffer_arg) {
  return netem_pb.NodeRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_netem_OpenRequest(arg) {
  if (!(arg instanceof netem_pb.OpenRequest)) {
    throw new Error('Expected argument of type netem.OpenRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_netem_OpenRequest(buffer_arg) {
  return netem_pb.OpenRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_netem_PrjListResponse(arg) {
  if (!(arg instanceof netem_pb.PrjListResponse)) {
    throw new Error('Expected argument of type netem.PrjListResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_netem_PrjListResponse(buffer_arg) {
  return netem_pb.PrjListResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_netem_PrjOpenResponse(arg) {
  if (!(arg instanceof netem_pb.PrjOpenResponse)) {
    throw new Error('Expected argument of type netem.PrjOpenResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_netem_PrjOpenResponse(buffer_arg) {
  return netem_pb.PrjOpenResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_netem_ProjectCloseMsg(arg) {
  if (!(arg instanceof netem_pb.ProjectCloseMsg)) {
    throw new Error('Expected argument of type netem.ProjectCloseMsg');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_netem_ProjectCloseMsg(buffer_arg) {
  return netem_pb.ProjectCloseMsg.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_netem_ProjectRequest(arg) {
  if (!(arg instanceof netem_pb.ProjectRequest)) {
    throw new Error('Expected argument of type netem.ProjectRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_netem_ProjectRequest(buffer_arg) {
  return netem_pb.ProjectRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_netem_ProjectSaveMsg(arg) {
  if (!(arg instanceof netem_pb.ProjectSaveMsg)) {
    throw new Error('Expected argument of type netem.ProjectSaveMsg');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_netem_ProjectSaveMsg(buffer_arg) {
  return netem_pb.ProjectSaveMsg.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_netem_PullSrvMsg(arg) {
  if (!(arg instanceof netem_pb.PullSrvMsg)) {
    throw new Error('Expected argument of type netem.PullSrvMsg');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_netem_PullSrvMsg(buffer_arg) {
  return netem_pb.PullSrvMsg.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_netem_StatusResponse(arg) {
  if (!(arg instanceof netem_pb.StatusResponse)) {
    throw new Error('Expected argument of type netem.StatusResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_netem_StatusResponse(buffer_arg) {
  return netem_pb.StatusResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_netem_TopologyRunMsg(arg) {
  if (!(arg instanceof netem_pb.TopologyRunMsg)) {
    throw new Error('Expected argument of type netem.TopologyRunMsg');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_netem_TopologyRunMsg(buffer_arg) {
  return netem_pb.TopologyRunMsg.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_netem_VersionResponse(arg) {
  if (!(arg instanceof netem_pb.VersionResponse)) {
    throw new Error('Expected argument of type netem.VersionResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_netem_VersionResponse(buffer_arg) {
  return netem_pb.VersionResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_netem_WNetworkRequest(arg) {
  if (!(arg instanceof netem_pb.WNetworkRequest)) {
    throw new Error('Expected argument of type netem.WNetworkRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_netem_WNetworkRequest(buffer_arg) {
  return netem_pb.WNetworkRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


var NetemService = exports.NetemService = {
  // Server actions
serverGetVersion: {
    path: '/netem.Netem/ServerGetVersion',
    requestStream: false,
    responseStream: false,
    requestType: google_protobuf_empty_pb.Empty,
    responseType: netem_pb.VersionResponse,
    requestSerialize: serialize_google_protobuf_Empty,
    requestDeserialize: deserialize_google_protobuf_Empty,
    responseSerialize: serialize_netem_VersionResponse,
    responseDeserialize: deserialize_netem_VersionResponse,
  },
  serverPullImages: {
    path: '/netem.Netem/ServerPullImages',
    requestStream: false,
    responseStream: true,
    requestType: google_protobuf_empty_pb.Empty,
    responseType: netem_pb.PullSrvMsg,
    requestSerialize: serialize_google_protobuf_Empty,
    requestDeserialize: deserialize_google_protobuf_Empty,
    responseSerialize: serialize_netem_PullSrvMsg,
    responseDeserialize: deserialize_netem_PullSrvMsg,
  },
  serverCleanContainers: {
    path: '/netem.Netem/ServerCleanContainers',
    requestStream: false,
    responseStream: false,
    requestType: google_protobuf_empty_pb.Empty,
    responseType: netem_pb.AckResponse,
    requestSerialize: serialize_google_protobuf_Empty,
    requestDeserialize: deserialize_google_protobuf_Empty,
    responseSerialize: serialize_netem_AckResponse,
    responseDeserialize: deserialize_netem_AckResponse,
  },
  // Project actions
projectGetMany: {
    path: '/netem.Netem/ProjectGetMany',
    requestStream: false,
    responseStream: false,
    requestType: google_protobuf_empty_pb.Empty,
    responseType: netem_pb.PrjListResponse,
    requestSerialize: serialize_google_protobuf_Empty,
    requestDeserialize: deserialize_google_protobuf_Empty,
    responseSerialize: serialize_netem_PrjListResponse,
    responseDeserialize: deserialize_netem_PrjListResponse,
  },
  projectOpen: {
    path: '/netem.Netem/ProjectOpen',
    requestStream: false,
    responseStream: false,
    requestType: netem_pb.OpenRequest,
    responseType: netem_pb.PrjOpenResponse,
    requestSerialize: serialize_netem_OpenRequest,
    requestDeserialize: deserialize_netem_OpenRequest,
    responseSerialize: serialize_netem_PrjOpenResponse,
    responseDeserialize: deserialize_netem_PrjOpenResponse,
  },
  projectClose: {
    path: '/netem.Netem/ProjectClose',
    requestStream: false,
    responseStream: true,
    requestType: netem_pb.ProjectRequest,
    responseType: netem_pb.ProjectCloseMsg,
    requestSerialize: serialize_netem_ProjectRequest,
    requestDeserialize: deserialize_netem_ProjectRequest,
    responseSerialize: serialize_netem_ProjectCloseMsg,
    responseDeserialize: deserialize_netem_ProjectCloseMsg,
  },
  projectSave: {
    path: '/netem.Netem/ProjectSave',
    requestStream: false,
    responseStream: true,
    requestType: netem_pb.ProjectRequest,
    responseType: netem_pb.ProjectSaveMsg,
    requestSerialize: serialize_netem_ProjectRequest,
    requestDeserialize: deserialize_netem_ProjectRequest,
    responseSerialize: serialize_netem_ProjectSaveMsg,
    responseDeserialize: deserialize_netem_ProjectSaveMsg,
  },
  projectGetNodeConfigs: {
    path: '/netem.Netem/ProjectGetNodeConfigs',
    requestStream: false,
    responseStream: false,
    requestType: netem_pb.ProjectRequest,
    responseType: netem_pb.FileResponse,
    requestSerialize: serialize_netem_ProjectRequest,
    requestDeserialize: deserialize_netem_ProjectRequest,
    responseSerialize: serialize_netem_FileResponse,
    responseDeserialize: deserialize_netem_FileResponse,
  },
  projectGetStatus: {
    path: '/netem.Netem/ProjectGetStatus',
    requestStream: false,
    responseStream: false,
    requestType: netem_pb.ProjectRequest,
    responseType: netem_pb.StatusResponse,
    requestSerialize: serialize_netem_ProjectRequest,
    requestDeserialize: deserialize_netem_ProjectRequest,
    responseSerialize: serialize_netem_StatusResponse,
    responseDeserialize: deserialize_netem_StatusResponse,
  },
  // Read/Write network topology
readNetworkFile: {
    path: '/netem.Netem/ReadNetworkFile',
    requestStream: false,
    responseStream: false,
    requestType: netem_pb.ProjectRequest,
    responseType: netem_pb.FileResponse,
    requestSerialize: serialize_netem_ProjectRequest,
    requestDeserialize: deserialize_netem_ProjectRequest,
    responseSerialize: serialize_netem_FileResponse,
    responseDeserialize: deserialize_netem_FileResponse,
  },
  writeNetworkFile: {
    path: '/netem.Netem/WriteNetworkFile',
    requestStream: false,
    responseStream: false,
    requestType: netem_pb.WNetworkRequest,
    responseType: netem_pb.AckResponse,
    requestSerialize: serialize_netem_WNetworkRequest,
    requestDeserialize: deserialize_netem_WNetworkRequest,
    responseSerialize: serialize_netem_AckResponse,
    responseDeserialize: deserialize_netem_AckResponse,
  },
  // topology actions
topologyCheck: {
    path: '/netem.Netem/TopologyCheck',
    requestStream: false,
    responseStream: false,
    requestType: netem_pb.ProjectRequest,
    responseType: netem_pb.AckResponse,
    requestSerialize: serialize_netem_ProjectRequest,
    requestDeserialize: deserialize_netem_ProjectRequest,
    responseSerialize: serialize_netem_AckResponse,
    responseDeserialize: deserialize_netem_AckResponse,
  },
  topologyReload: {
    path: '/netem.Netem/TopologyReload',
    requestStream: false,
    responseStream: true,
    requestType: netem_pb.ProjectRequest,
    responseType: netem_pb.TopologyRunMsg,
    requestSerialize: serialize_netem_ProjectRequest,
    requestDeserialize: deserialize_netem_ProjectRequest,
    responseSerialize: serialize_netem_TopologyRunMsg,
    responseDeserialize: deserialize_netem_TopologyRunMsg,
  },
  topologyRun: {
    path: '/netem.Netem/TopologyRun',
    requestStream: false,
    responseStream: true,
    requestType: netem_pb.ProjectRequest,
    responseType: netem_pb.TopologyRunMsg,
    requestSerialize: serialize_netem_ProjectRequest,
    requestDeserialize: deserialize_netem_ProjectRequest,
    responseSerialize: serialize_netem_TopologyRunMsg,
    responseDeserialize: deserialize_netem_TopologyRunMsg,
  },
  topologyStartAll: {
    path: '/netem.Netem/TopologyStartAll',
    requestStream: false,
    responseStream: false,
    requestType: netem_pb.ProjectRequest,
    responseType: netem_pb.AckResponse,
    requestSerialize: serialize_netem_ProjectRequest,
    requestDeserialize: deserialize_netem_ProjectRequest,
    responseSerialize: serialize_netem_AckResponse,
    responseDeserialize: deserialize_netem_AckResponse,
  },
  topologyStopAll: {
    path: '/netem.Netem/TopologyStopAll',
    requestStream: false,
    responseStream: false,
    requestType: netem_pb.ProjectRequest,
    responseType: netem_pb.AckResponse,
    requestSerialize: serialize_netem_ProjectRequest,
    requestDeserialize: deserialize_netem_ProjectRequest,
    responseSerialize: serialize_netem_AckResponse,
    responseDeserialize: deserialize_netem_AckResponse,
  },
  // Node actions
nodeReadConfigFiles: {
    path: '/netem.Netem/NodeReadConfigFiles',
    requestStream: false,
    responseStream: false,
    requestType: netem_pb.NodeRequest,
    responseType: netem_pb.ConfigFilesResponse,
    requestSerialize: serialize_netem_NodeRequest,
    requestDeserialize: deserialize_netem_NodeRequest,
    responseSerialize: serialize_netem_ConfigFilesResponse,
    responseDeserialize: deserialize_netem_ConfigFilesResponse,
  },
  nodeCanRunConsole: {
    path: '/netem.Netem/NodeCanRunConsole',
    requestStream: false,
    responseStream: false,
    requestType: netem_pb.NodeRequest,
    responseType: netem_pb.AckResponse,
    requestSerialize: serialize_netem_NodeRequest,
    requestDeserialize: deserialize_netem_NodeRequest,
    responseSerialize: serialize_netem_AckResponse,
    responseDeserialize: deserialize_netem_AckResponse,
  },
  nodeConsole: {
    path: '/netem.Netem/NodeConsole',
    requestStream: true,
    responseStream: true,
    requestType: netem_pb.ConsoleCltMsg,
    responseType: netem_pb.ConsoleSrvMsg,
    requestSerialize: serialize_netem_ConsoleCltMsg,
    requestDeserialize: deserialize_netem_ConsoleCltMsg,
    responseSerialize: serialize_netem_ConsoleSrvMsg,
    responseDeserialize: deserialize_netem_ConsoleSrvMsg,
  },
  nodeStart: {
    path: '/netem.Netem/NodeStart',
    requestStream: false,
    responseStream: false,
    requestType: netem_pb.NodeRequest,
    responseType: netem_pb.AckResponse,
    requestSerialize: serialize_netem_NodeRequest,
    requestDeserialize: deserialize_netem_NodeRequest,
    responseSerialize: serialize_netem_AckResponse,
    responseDeserialize: deserialize_netem_AckResponse,
  },
  nodeStop: {
    path: '/netem.Netem/NodeStop',
    requestStream: false,
    responseStream: false,
    requestType: netem_pb.NodeRequest,
    responseType: netem_pb.AckResponse,
    requestSerialize: serialize_netem_NodeRequest,
    requestDeserialize: deserialize_netem_NodeRequest,
    responseSerialize: serialize_netem_AckResponse,
    responseDeserialize: deserialize_netem_AckResponse,
  },
  nodeRestart: {
    path: '/netem.Netem/NodeRestart',
    requestStream: false,
    responseStream: false,
    requestType: netem_pb.NodeRequest,
    responseType: netem_pb.AckResponse,
    requestSerialize: serialize_netem_NodeRequest,
    requestDeserialize: deserialize_netem_NodeRequest,
    responseSerialize: serialize_netem_AckResponse,
    responseDeserialize: deserialize_netem_AckResponse,
  },
  nodeSetIfState: {
    path: '/netem.Netem/NodeSetIfState',
    requestStream: false,
    responseStream: false,
    requestType: netem_pb.NodeIfStateRequest,
    responseType: netem_pb.AckResponse,
    requestSerialize: serialize_netem_NodeIfStateRequest,
    requestDeserialize: deserialize_netem_NodeIfStateRequest,
    responseSerialize: serialize_netem_AckResponse,
    responseDeserialize: deserialize_netem_AckResponse,
  },
  nodeCapture: {
    path: '/netem.Netem/NodeCapture',
    requestStream: false,
    responseStream: true,
    requestType: netem_pb.NodeInterfaceRequest,
    responseType: netem_pb.CaptureSrvMsg,
    requestSerialize: serialize_netem_NodeInterfaceRequest,
    requestDeserialize: deserialize_netem_NodeInterfaceRequest,
    responseSerialize: serialize_netem_CaptureSrvMsg,
    responseDeserialize: deserialize_netem_CaptureSrvMsg,
  },
  nodeCopyFrom: {
    path: '/netem.Netem/NodeCopyFrom',
    requestStream: false,
    responseStream: true,
    requestType: netem_pb.CopyMsg,
    responseType: netem_pb.CopyMsg,
    requestSerialize: serialize_netem_CopyMsg,
    requestDeserialize: deserialize_netem_CopyMsg,
    responseSerialize: serialize_netem_CopyMsg,
    responseDeserialize: deserialize_netem_CopyMsg,
  },
  nodeCopyTo: {
    path: '/netem.Netem/NodeCopyTo',
    requestStream: true,
    responseStream: false,
    requestType: netem_pb.CopyMsg,
    responseType: netem_pb.AckResponse,
    requestSerialize: serialize_netem_CopyMsg,
    requestDeserialize: deserialize_netem_CopyMsg,
    responseSerialize: serialize_netem_AckResponse,
    responseDeserialize: deserialize_netem_AckResponse,
  },
  // Link actions
linkUpdate: {
    path: '/netem.Netem/LinkUpdate',
    requestStream: false,
    responseStream: false,
    requestType: netem_pb.LinkRequest,
    responseType: netem_pb.AckResponse,
    requestSerialize: serialize_netem_LinkRequest,
    requestDeserialize: deserialize_netem_LinkRequest,
    responseSerialize: serialize_netem_AckResponse,
    responseDeserialize: deserialize_netem_AckResponse,
  },
};

exports.NetemClient = grpc.makeGenericClientConstructor(NetemService);
