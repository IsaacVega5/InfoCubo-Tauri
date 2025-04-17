import { createContext, useState } from "react"

interface LoaderContextType{
  loadingProcess: string[],
  setLoadingProcess: (value: string[]) => void,
  addProcess: (process: string) => void,
  removeProcess: (process: string) => void
}

export const LoaderContext = createContext<LoaderContextType | null>(null)

export function LoaderProvider({ children }: any) {
  const [loadingProcess, setLoadingProcess] = useState<string[]>([])

  const addProcess = (process: string) => {
    setLoadingProcess((prevProcess) => [...prevProcess, process]);
  };

  const removeProcess = (process: string) => {
    setLoadingProcess((prevProcess) => prevProcess.filter((p) => p !== process));
  };

  const value = {
    loadingProcess,
    setLoadingProcess,
    addProcess,
    removeProcess
  };

  return (
    <LoaderContext.Provider value={value}>
      {children}
    </LoaderContext.Provider>
  )
}