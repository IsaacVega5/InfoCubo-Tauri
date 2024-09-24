import { createContext, useState } from "react";

export const HiperImgContext = createContext()

export function HiperImgProvider({ children }) {
  const [hiperImgValues, setHiperImgValues] = useState({
    path:"",
    url:"",
    shape:[0, 0, 0],
    channel:0,
    resize:1
  })

  return (
    <HiperImgContext.Provider value={{hiperImgValues, setHiperImgValues}}>
      {children}
    </HiperImgContext.Provider>
  )
}