import { createContext, useState } from "react";

export const ToolsContext = createContext()

export function ToolsProvider({ children }) {
  const [toolsValues, setToolsValues] = useState({
    pixelCheck: false,
    rotationValue: 0,
    cutCheck: false,
    cutPoints: [null, null],
    drawGrid: false
  })

  return (
    <ToolsContext.Provider value={{toolsValues, setToolsValues}}>
      {children}
    </ToolsContext.Provider>
  )
}