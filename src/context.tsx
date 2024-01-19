import { createContext, useContext } from "react"

export type AppContent = {
  error: string
  setError:(error: string) => void
}

export const AppContext = createContext<AppContent>({
    error: '',
    setError: () => {},
});

export const useAppContext = () => useContext(AppContext);