import { useContext } from 'react';
import { FaCheck } from "react-icons/fa";
import { OptionsImgContext } from '../context/optionsImg.jsx';
import './OptionBelt.css';

export default function OptionBelt() {
  const {optionsImgValues, setOptionsImgValues} = useContext(OptionsImgContext)

  const handleDrawGridCheck = (e) => {
    setOptionsImgValues({...optionsImgValues, drawGrid: e.target.checked})
  }

  return (
    <div className="OptionBelt">
      <div className="grid_opt opt_check">
        <div className="checkBtn">
          <input id="check_grid" type="checkbox" defaultChecked defaultValue={optionsImgValues.drawGrid} onChange={handleDrawGridCheck}/>
          <label htmlFor="check_grid"><FaCheck className='icon'/></label>
        </div>
        <span>Dibujar celdas</span>
      </div>
    </div>
  )
}
