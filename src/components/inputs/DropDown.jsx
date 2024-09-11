import { useState } from "react"
import "./DropDown.css"
import { TiArrowSortedDown } from "react-icons/ti";

  export default function DropDown({options, selected, setSelected}) {
    const [deploy, setDeploy] = useState(false)
    const [metadata, setMetadata] = useState(true)
    
    const handleChoose = (index) => {
      setDeploy(!deploy)
      setSelected(index)
    }

    return (
      <div className="DropDown-cont">
        <button className="DropDown-btn"
          onClick={() => setDeploy(!deploy)}>{options[selected]}
          <TiArrowSortedDown className="DropDown-arrow" style={{transform: deploy ? 'rotate(0deg)' : 'rotate(-90deg)'}} />
        </button>
        <ul className={deploy ? "DropDown-list active" : "DropDown-list"}>
          {
            options.map((option, index) => <button key={index} 
              onClick={() => handleChoose(index)}>{option}</button>)
          }
        </ul>
        
      </div>
    )
  }
