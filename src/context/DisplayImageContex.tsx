import { createContext, useRef } from "react";


export interface DisplayImageContextType {
  displayRef: React.RefObject<HTMLDivElement>
}

export const DisplayImageContext = createContext<DisplayImageContextType | null>(null)

export function DisplayImagesProvider({children} : any) {
  const displayRef = useRef<HTMLDivElement>(null)
  return (
    <DisplayImageContext.Provider value={{
      displayRef
    }}>
      {children}
    </DisplayImageContext.Provider>
  )
}