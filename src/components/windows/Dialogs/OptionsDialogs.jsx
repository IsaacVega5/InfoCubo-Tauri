import { useOptionDialog } from '../../../hooks/useOptionDialogs.jsx';
import MessageIcons from "../../MessageIcons.jsx";
import './OptionsDialogs.css';
import logo from "../../../assets/cube.png"

export default function OptionsDialogs() {
  const {values, show, action, dialog} = useOptionDialog()

  return(
    <>
    {
      show &&

      <div className="OptionsDialogsCont">
        <div className="OptionsDialogs">
          <div className="od-header">
            <img src={logo}></img>
            <span>{values.title}</span>
          </div>
  
          <div className="od-body">
            <div className="od-info">
              <MessageIcons type={values.type}/>
              <span className='od-question'>{values.message}</span>  
            </div>
  
            <div className="od-buttons">
              {
                values.options.map((option, index) => {
                  let style = index == values.options.length - 1 ? "od-btn principal" : "od-btn"
                  return (
                    <button className={style} 
                      key={index} 
                      autoFocus={index == values.options.length -1}
                      onClick={() =>{
                        action(index)
                        dialog.close()
                      }}
                      >{option}</button>
                  )
                })
              }
            </div>          
          </div>  
        </div>
      </div>      
    }
    </>
  )
}
