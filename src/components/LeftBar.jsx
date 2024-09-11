import React, { useContext } from 'react'
import "./LeftBar.css"
import logo from "../assets/cube.png"
import { RiImageAddFill } from "react-icons/ri";
import { open } from "@tauri-apps/api/dialog";
import { HiperImgContext } from '../context/hiperImg.jsx';
import { ToolsContext } from '../context/tools.jsx';

export default function LeftBar() {
  const {hiperImgValues, setHiperImgValues} = useContext(HiperImgContext)
  const {toolsValues, setToolsValues} = useContext(ToolsContext)

  let handleClick = async () => {
    const selected = await open({
      multiple: false,
      filters: [
        {
          name: 'HDR',
          extensions: ['hdr'],
        },
      ],
    })
    if (!selected) return

    setHiperImgValues(prev => ({...prev, path: selected}))
    setToolsValues({...toolsValues, rotationValue:0})
  }

  return (
    <div className='LeftBar'>
      <div className="logo">
        <img src={logo} />

        <div className="logo-name">
          <span className='first'>Info</span>
          <span className='second'>Cubo</span>
        </div>
      </div>

      <button className='btn-Input' onClick={handleClick}>
        <RiImageAddFill className='icon'/>
        Nueva imagen
      </button>


      <span className="leyenda">
        InfoCubo v4.0
      </span>
    </div>
  )
}
