import { useRef, useState, useEffect, useContext } from "react"
import { FaArrowRotateLeft } from "react-icons/fa6";
import { FaArrowRotateRight } from "react-icons/fa6";
import "./InputRotation.css"
import { ToolsContext } from "../../context/tools.jsx";
import { HiperImgContext } from "../../context/hiperImg.jsx";
import { getImgUrl } from "../../services/hiper.js";
import { useDebouncedCallback } from 'use-debounce'
import { getElementShape } from "../../services/utils.js";

export default function InputRotation({ setLoader }) {
  let { toolsValues, setToolsValues } = useContext(ToolsContext)
  const { hiperImgValues, setHiperImgValues } = useContext(HiperImgContext)
  let [rotation, setRotation] = useState(0)
  const intervalRef = useRef(null)

  const rotateLeft = () => {
    setRotation(prevRotation => {
      const newRotation = prevRotation - .1

      if (newRotation > 360) {
        return 0.0
      } else if (newRotation < -360) {
        return 360.0
      } else {
        return newRotation
      }
    })
  }
  function rotateRight() {
    setRotation(prevRotation => {
      const newRotation = prevRotation + .1;
  
      if (newRotation > 360) {
        return 0.0;
      } else if (newRotation < -360) {
        return 360.0;
      } else {
        return newRotation; 
      }
    });
  }

  const handleHoldRight = () => {
    rotateRight()
  }
  const startHoldingRight = () => {
    handleHoldRight()
    intervalRef.current = setInterval(handleHoldRight, 100)
  }
  const stopHoldingRight = () => {
    clearInterval(intervalRef.current)
    rotateImage()
  }

  const handleHoldLeft = () => {
    rotateLeft()
  }
  const startHoldingLeft = () => {
    handleHoldLeft()
    intervalRef.current = setInterval(handleHoldLeft, 100)
  }
  const stopHoldingLeft = () => {
    clearInterval(intervalRef.current)
    rotateImage()
  }

  let rotateImage = async () => {
    if (hiperImgValues.path == "") return
    setLoader(true)
    setToolsValues({...toolsValues, rotationValue: rotation})
    const {width, height} = getElementShape("img_cont")
    const {url, shape, resize, error} = await getImgUrl({path: hiperImgValues.path, channel: hiperImgValues.channel, rotation: rotation, reshape:[width,height]})
    if (error) return setLoader(false)
    setHiperImgValues({...hiperImgValues, url: url, shape: shape, resize: resize})
    setLoader(false)
  }

  useEffect(() => {
    return () => clearInterval(intervalRef.current)
  }, [])

  useEffect(() => {
    document.querySelector(".input-rotate").value = rotation.toFixed(1)
  }, [rotation])

  
  const debounceRotateImage = useDebouncedCallback(rotateImage, 500)
  useEffect(() => {
    debounceRotateImage();
  }, [rotation])
  
  useEffect(() =>{
    setRotation(toolsValues.rotationValue)
    setToolsValues({...toolsValues, cutPoints: [null, null]})
  }, [toolsValues.rotationValue])

  useEffect(() =>{
    setRotation(0)
  }, [hiperImgValues.path])

  const handleInputChange = (e) => {
    const value = parseFloat(e.target.value);
    
    if (!isNaN(value)) {
      if (value > 360) {
        setRotation(360)
      } else if (value < -360) {
        setRotation(-360)
      } else {
        setRotation(value)
      }
    }
  };

  return (
    <div className="InputRotation">
      <button id="left" className='btn-rotate'  onMouseDown={startHoldingLeft} onMouseUp={stopHoldingLeft} onMouseLeave={stopHoldingLeft}>
            <FaArrowRotateLeft className='icon-rotate'/>
          </button>
          <input type="text" className="input-rotate" defaultValue={0} onChange={handleInputChange}/>
          <button id="right" className='btn-rotate'
          onMouseDown={startHoldingRight} onMouseUp={stopHoldingRight} onMouseLeave={stopHoldingRight}>
            <FaArrowRotateRight className='icon-rotate'/>
          </button>
    </div>
  )
}
