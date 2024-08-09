import { createContext, useContext } from "react"
import { IOptions } from "./api/options";


export enum ProgressOperation {
  None = 1,
  TopologyRun,
  TopologyReload,
  ProjectSave,
  ProjectClose,
  ServerPullImages,
}

export type AppContent = {
  error: string;
  setError: (error: string) => void;
  setInfoMsg: (msg: string) => void;
  currentPrgOperation: ProgressOperation;
  setCurrentPrgOperation: (operation: ProgressOperation) => void;
  options: IOptions | null;
}

export const AppContext = createContext<AppContent>({
    error: '',
    setError: (_: string) => {},
    setInfoMsg: (_: string) => {},
    currentPrgOperation: ProgressOperation.None,
    setCurrentPrgOperation: (_: ProgressOperation) => {},
    options: null,
});

export const useAppContext = () => useContext(AppContext);