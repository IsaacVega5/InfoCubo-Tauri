import { useContext, useEffect, useState } from 'react';
import { BsLayersHalf } from "react-icons/bs";
import { HiperImgContext } from '../context/hiperImg.jsx';
import { ToolsContext } from '../context/tools.jsx';
import { getImgUrl, getInfo, getPixelInfo } from '../services/hiper.js';
import CutPoints from './CutPoints.jsx';
import './ImageViewer.css';
import Loader from './Loader.jsx';
import Points from './Points.jsx';
import HistogramGroup from './windows/HistogramGroup.jsx';
import toast from 'react-hot-toast';
import { getElementShape } from '../services/utils.js';

export default function ImageViewer({loader, setLoader}) {
  const {toolsValues, setToolsValues} = useContext(ToolsContext)
  const {hiperImgValues, setHiperImgValues} = useContext(HiperImgContext)

  let [sliderValue, setSliderValue] = useState(0)
  let [histograms, setHistograms] = useState([])

  let sliderChange = async (e) => {
    setSliderValue(e.target.value)
  }
  const onReleaseSlider = async () => {
    try{
      if (hiperImgValues.channel == sliderValue) return
      setLoader(true)
      const {width, height} = getElementShape("img_cont")
      const {url} = await getImgUrl({path: hiperImgValues.path, channel: sliderValue, rotation: toolsValues.rotationValue, reshape:[width,height]})
      setHiperImgValues({...hiperImgValues, url: url, channel: sliderValue})
    }catch(err){
      console.error(err)
    }
  }

  let onImageChange = async () =>{
    if (hiperImgValues.path == "") return
    setLoader(true)
    try{
      
      const {width, height} = getElementShape("img_cont")
      const {url, shape} = await getImgUrl({path: hiperImgValues.path, rotation: toolsValues.rotationValue, reshape:[width,height]})
      
      setHiperImgValues({...hiperImgValues, url: url, shape: shape})
      
      let slider = document.getElementById("band_slider")
      slider.value = 0
      setSliderValue(0)
    }
    catch(err){
      console.log(err)
    }
    finally{
      setLoader(false)
    }
  }
  
  let setCanvasImage = () =>{
    try{
      let canvas = document.getElementById("img_canvas")
      const ctx = canvas.getContext("2d")
      
      const img = new Image();
      img.src = hiperImgValues.url
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
      }

    }finally{
      setLoader(false)
    }
  }
  
  useEffect(() => {
    onImageChange()
    setHistograms([])
  }, [hiperImgValues.path])
  useEffect(() => {
    setHistograms([])
  },[toolsValues.pixelCheck])

  useEffect(() => {
    setCanvasImage()
  }, [hiperImgValues.url])

  
  let handleCanvasClick = async (e) =>{
    if (!toolsValues.pixelCheck && !toolsValues.cutCheck) return
    setLoader(true)
    const canvas = e.target;
    const rect = canvas.getBoundingClientRect();
    const resize_factor = rect.height / hiperImgValues.shape[0]
    
    const x = (e.clientX - rect.left) / resize_factor;
    const y = (e.clientY - rect.top) / resize_factor;

    if (toolsValues.pixelCheck && toolsValues.rotationValue == 0){
      let {value, coords, error} = await getPixelInfo({path: hiperImgValues.path, x: x, y: y})
      
      if (!error){
        setHistograms([...histograms, {
          id: crypto.randomUUID(),
          coords: [x, y],
          imgCoords: coords,
          pos: {
            x: false,
            y: false
          },
          value: value
        }])
      }
      else{
        console.error(`Error: ${error} at x: ${x}, y: ${y}`);
      }
    }else if(toolsValues.pixelCheck && toolsValues.rotationValue !=0 ){
      toast.error(`Rotación debe ser igual a 0 para realizar esta operación`,{
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        }
      })

    }

    if (toolsValues.cutCheck){
      if (toolsValues.cutPoints[0] == null || toolsValues.cutPoints[1] != null){
        setToolsValues({...toolsValues, cutPoints: [ {x: x, y: y}, null]})
      }else{
        setToolsValues({...toolsValues, cutPoints: [toolsValues.cutPoints[0], {x: x, y: y}]})
      }
    }

    setLoader(false)
  }

  return (
    <div id="ImageViewer" className="ImageViewer">
      {loader && <Loader /> }
      <div id="img_cont" className="img-cont">
        <CutPoints />
        <Points histograms={histograms} />
        <canvas id="img_canvas" width={500} height={500} onClick={handleCanvasClick} /> 
        {toolsValues.drawGrid && <div className="grid"/>}
      </div>
      <HistogramGroup histograms={histograms} setHistograms={setHistograms} />

      <div className="slider-cont">
        <span>{sliderValue}</span>
        <input id="band_slider" type='range' 
          min='0' max={hiperImgValues.shape[2] - 1} 
          onChange={sliderChange} defaultValue={sliderValue} 
          aria-orientation='vertical' step="1" 
          onMouseUp={onReleaseSlider}/>
        <BsLayersHalf className='layer-icon'/>
      </div>
    </div>
  )
}
