
export enum IfState {
  UP,
  DOWN,
}

export interface IProject {
  id: string;
  name: string;
  openAt: string;
}

export interface IInterfaceState {
  name: string;
  state: IfState;
}

export interface INodeState {
  name: string;
  running: boolean;
  interfaces: IInterfaceState[];
}

export interface IProjectState extends IProject {
  running: boolean;
  nodes: INodeState[];
}
