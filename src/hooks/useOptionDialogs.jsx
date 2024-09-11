import { useContext, useEffect } from "react"
import { OptionDialogContext } from "../context/OptionDialog.jsx"

export const useOptionDialog = () => {

  const {optionDialogValues, 
  setOptionDialogValues,
  show, setShow
  } = useContext(OptionDialogContext)

  const setOptionsDialog = ({title = "", message = "", type = "", options = [], actions = []}) => {
    setOptionDialogValues({title, message, type, options, actions})
  }

  const setTitle = (title) => {
    setOptionDialogValues({...optionDialogValues, title: title})
  }
  const setMessage = (message) => {
    setOptionDialogValues({...optionDialogValues, message: message})
  }
  const setType = (type) => {
    setOptionDialogValues({...optionDialogValues, type: type})
  }
  const setOptions = (options) => {
    setOptionDialogValues({...optionDialogValues, options: options})
  }

  const action = (index) => {
    if (optionDialogValues.actions.length < index + 1 ) return
    return optionDialogValues.actions[index]()
  }

  useEffect(() => {
    if (optionDialogValues.title == "") return
    open()
  }, [optionDialogValues])
      

  const open = () => {
    setShow(true)
  }

  const close = () => {
    setShow(false)
    setOptionDialogValues({title: "", message: "", type: "", options: [], actions: []})
  }

  return {
    setOptionsDialog,
    values : optionDialogValues,
    setTitle,
    setMessage,
    setType,
    setOptions,
    action,
    dialog : {open, close},
    show
  }
}