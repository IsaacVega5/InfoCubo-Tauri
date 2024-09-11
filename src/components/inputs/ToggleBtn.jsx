import { useState } from 'react'
import './ToggleBtn.css'

export default function ToggleBtn({label = null, onToggle = null, value = false}) {
  const handleBtnClick = () => {
    if (onToggle) onToggle(!value)
  }

  return (
    <div className="ToggleBtn-cont">
      <button className="ToggleBtn" 
        onClick={handleBtnClick}
        active={String(value)}>
        <div className="tg-switch"></div>
      </button>
      {label && <span className="tg-label">{label}</span>}
    </div>
  )
}
