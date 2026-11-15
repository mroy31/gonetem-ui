export type Edition = "full" | "student";

export const edition: Edition = __APP_EDITION__;

export const studentServerUri: string = __STUDENT_SERVER_URI__;

export interface IFeatures {
  topologyWrite: boolean;
  topologyValidation: boolean;
  nodeConfigRead: boolean;
  optionsWrite: boolean;
}

export const features: IFeatures = {
  topologyWrite: edition === "full",
  topologyValidation: edition === "full",
  nodeConfigRead: edition === "full",
  optionsWrite: edition === "full",
};
