import { createContext, useContext } from "react"
import { IOptions } from "./api/options";

export type AppContent = {
  error: string;
  setError:(error: string) => void;
  options: IOptions | null;
}

export const AppContext = createContext<AppContent>({
    error: '',
    setError: (_: string) => {},
    options: null,
});

export const useAppContext = () => useContext(AppContext);