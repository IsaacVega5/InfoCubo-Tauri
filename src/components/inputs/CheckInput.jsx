import { FaCheck } from "react-icons/fa";
import './CheckInput.css'

export default function CheckInput({label, checked, onChange, active = true}) {
  const handleCheck = () => {
    onChange(!checked)
  }
  return (
    <div className="check-input" active={String(active)}>
      <button className={`check-box ${checked ? 'checked' : ''}`} onClick={handleCheck}>
        <FaCheck className='icon'/>
      </button>
      <span>
      {label}
      </span>
    </div>
  )
}
