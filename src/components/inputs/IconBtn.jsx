import "./IconBtn.css"

export default function IconBtn({label,icon="", filled = false, action}) {

  const handleClick = () => {
    action()
  }
  
  return (
    <button className="IconBtn"
      data-filled={filled}
      onClick={handleClick}>
      {icon}
      {label}
    </button>
  )
}
