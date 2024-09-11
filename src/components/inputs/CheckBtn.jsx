import { useEffect, useState } from "react";
import "./CheckBtn.css";

export default function CheckBtn({value, onChange, title, children}) {
  let [btnClass, setBtnClass] = useState("")

  useEffect(() => {
    if (value) {
      setBtnClass("CheckBtn active")
    }else{
      setBtnClass("CheckBtn")
    }
  }, [value])

  let handleClick = () =>{
    onChange(!value)
  }

  return (
    <button 
      className={btnClass} 
      title={title}
      onClick={handleClick}
      >
      {children}
    </button>
  )
}
