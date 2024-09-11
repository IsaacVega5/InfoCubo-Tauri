import { useEffect, useState } from "react"
import './IndicesList.css'
import * as indices from "../../services/indices.js" 
import ToggleBtn from "./ToggleBtn.jsx"
import { BiListCheck } from "react-icons/bi";
import { BiListMinus } from "react-icons/bi";
import { TbCheckbox } from "react-icons/tb";
import CheckBtn from "./CheckBtn.jsx";

export default function IndicesList({setIndices}) {
  const [inputValues, setInputValues] = useState({})

  const getIndices = async () => {
    const json = await indices.getList()

    json.forEach((key) => {
      setInputValues(prevState => ({
        ...prevState,
        [key]: true
      }))
    })
  }

  const onSelectAllClick = () => {
    Object.keys(inputValues).forEach(key => {
      setInputValues(prevState => ({
        ...prevState,
        [key]: true
      }))
    })
  }
  const onDeselectAllClick = () => {
    Object.keys(inputValues).forEach(key => {
      setInputValues(prevState => ({
        ...prevState,
        [key]: false
      }))
    })
  }

  const onToggle = (key) => {
    setInputValues(prevState => ({
      ...prevState,
      [key]: !prevState[key]
    }))
  }
  
  useEffect(() => {
    const indices = Object.keys(inputValues).filter(key => inputValues[key])
    setIndices(indices)
  }, [inputValues])

  useEffect(() => {
    getIndices()
  }, [])

  return (
    <>
      <div className="IndicesList-btn">
        <button onClick={onSelectAllClick} title="Seleccionar todos">
          <BiListCheck className="icon"/>
        </button>
        <button onClick={onDeselectAllClick} title="Deseleccionar todos">
          <BiListMinus className="icon"/>
        </button>
      </div>
      <ul className="IndicesList">
        {
          Object.keys(inputValues).map((key) => (
            <ToggleBtn key={key} 
            label={key} 
            onToggle={() => onToggle(key)} 
            value={inputValues[key]}
            />
          )) 
        }
      </ul>
    </>
  )
}
