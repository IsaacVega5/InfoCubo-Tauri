import { createContext, useState } from "react"

export const OptionDialogContext = createContext()

export function OptionDialogProvider({ children }) {
  const [optionDialogValues, setOptionDialogValues] = useState({
    title: "",
    message: "",
    type: "",
    options: [],
    actions: []
  })
  const [show, setShow] = useState(false)

  return (
    <OptionDialogContext.Provider 
      value={{
        optionDialogValues, 
        setOptionDialogValues,
        show, setShow
        }}>
      {children}
    </OptionDialogContext.Provider>
  )
}