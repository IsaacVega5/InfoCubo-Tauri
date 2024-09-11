import { useContext, useEffect, useState } from 'react'
import DropDown from '../../inputs/DropDown.jsx'
import './ExportOptions.css'
import CheckInput from '../../inputs/CheckInput.jsx'
import IconBtn from '../../inputs/IconBtn.jsx'
import { TiExport } from "react-icons/ti";
import { HiperImgContext } from '../../../context/hiperImg.jsx'
import { ToolsContext } from '../../../context/tools.jsx'
import { useExportOptions } from '../../../hooks/useExportOptions.jsx'
import { save } from '@tauri-apps/api/dialog'
import { exportChannels, saveHiper } from '../../../services/hiper.js'
import { useOptionDialog } from '../../../hooks/useOptionDialogs.jsx'
import { dirOpen } from '../../../services/shell.js'
import MultiRangeSlider from '../../inputs/MultiRangeSlider.jsx'
import { exists } from '@tauri-apps/api/fs'
import IndicesList from '../../inputs/IndicesList.jsx'
import { exportIndices } from '../../../services/export.js'
import logo from "../../../assets/cube.png"

export default function ExportOptions({setLoader}) {
  const {hiperImgValues,setHiperImgValues} = useContext(HiperImgContext)
  const {open, close, toggle} = useExportOptions()
  const {toolsValues} = useContext(ToolsContext)
  const dialog = useOptionDialog()
  const [selected, setSelected] = useState(0)
  const [indices, setIndices] = useState([])
  const [keep, setKeep] = useState({
    metadata: true,
    waves: true
  })
  const [channelRange, setChannelRange] = useState({min: 0, max: 0})

  const exportedOptions = [
    "Guardar hiper espectral (.hdr)", 
    "Exportar capas (.tif)", 
    "Exportar indices (.tif)"
  ]

  const HandleExport = async () =>{
    const name_cutPoints = (toolsValues.cutPoints[0] == null) ? 'NONE' : Math.floor(toolsValues.cutPoints[0].x) + '_' + Math.floor(toolsValues.cutPoints[0].y)
    const pathParts = hiperImgValues.path.split('\\');
    const fileName = pathParts.pop().split('.')[0] + '_rotated_'+toolsValues.rotationValue + '_cut_' + name_cutPoints;
    const path = pathParts.join('\\');

    const name = () =>{
      if (selected == 0) return `${fileName}`
      else if (selected == 1) return `Channels_${fileName}`
      else if (selected == 2) return `Indices_${fileName}`
    }
    let fullPath = `${path}\\${name()}`;
    let cont = 0
    while (await exists(fullPath)){
      cont += 1
      fullPath = `${path}/${name()}(${cont})`
    }

    const filter = () =>{
      if (selected == 0) return {
        name: 'Envi HDR',
        extensions: ['hdr']
      }
      else return{
        name: 'Crear nueva carpeta',
        extensions: ['']
      }
    }
  
    const filePath = await save({
      title: 'Exportar',
      defaultPath: fullPath,
      filters: [filter()]
    });
    

    if (!filePath) return
    close()
    setLoader(true)

    const exportAction = [saveHiper, exportChannels, exportIndices][selected]

    const res = await exportAction({
      imagePath: hiperImgValues.path,
      outputPath: filePath, 
      rotation: toolsValues.rotationValue,
      cutPoints: JSON.stringify(toolsValues.cutPoints),
      metadata: keep.metadata,
      waves: keep.waves,
      channelRange: channelRange,
      indices: indices
    })
    setLoader(false)
    
    if (res.error){
      return dialog.setOptionsDialog({
        title: 'Exportar',
        message: res.error,
        type: 'error',
        options: ['Aceptar']
      })
    }

    const message = selected ==  0 ? 'Se ha exportado el archivo: ' : 'Se han exportado los archivos en: '
    const dirPath = selected == 0 ? res.path.split('\\').slice(0, -1).join('\\') :  res.path

    dialog.setOptionsDialog({
      title: 'Exportar',
      message: `${message} ${res.path}`,
      type: 'info',
      options: selected == 0 ? ['Abrir directorio','Abrir imagen', 'Aceptar'] : ['Abrir directorio', 'Aceptar'],
      actions: selected == 0 ? [
        () => dirOpen(dirPath), () =>setHiperImgValues(prev => ({...prev, path: res.path})), () => {}
      ] : [
        () => dirOpen(dirPath), () => {}
      ]
    })

  }

  const closeDialog = () =>{
    close()
    setKeep(true)
    setSelected(0)
  }

  useEffect(() => {
    const inputMin = document.getElementById('expo-slider-input-min')
    const inputMax = document.getElementById('expo-slider-input-max')
    const focus = document.activeElement
    if (inputMin && inputMax && focus != inputMin && focus != inputMax) {
      inputMin.value = channelRange.min
      inputMax.value = channelRange.max
    }
  }, [channelRange])


  return (
    hiperImgValues.path == "" ? null :
    <div className="expo-cont">
      <div className="expo-win">
        <header className="od-header">
          <img src={logo}></img>
          <span>Opciones de exportación</span>
        </header>
        <div className="expo-body">
          <span>Seleccione el formato de exportación</span>
          <DropDown options={exportedOptions} selected={selected} setSelected={setSelected}/>
          { (selected <= 1) && <CheckInput label={"Conservar metadatos"} 
            checked={keep.metadata}
            onChange={() => setKeep({...keep, metadata: !keep.metadata})}/> } 
          { (selected == 1) && <CheckInput label={"Registrar Ondas"} 
            checked={keep.waves}
            onChange={() => setKeep({...keep, waves: !keep.waves})}/>
          }
          { (hiperImgValues.shape[2] > 0 && selected == 1) &&
            <div className='expo-slider'>
              <span id="expo-slider-input-min">{channelRange.min}</span>
                <MultiRangeSlider
                  min={0}
                  max={hiperImgValues.shape[2] -1}
                  onChange={setChannelRange}
                  values={channelRange}
                />

              <span id="expo-slider-input-max">{channelRange.max}</span>
            </div>
          }
          {
            (selected == 2) && <IndicesList setIndices={setIndices}/>
          }
        </div>
        <div className="expo-btn">
          <IconBtn label="Cancelar" action={closeDialog}/>
          <IconBtn label="Exportar" icon={<TiExport />} action={HandleExport} filled/>
        </div>
      </div>
    </div>
  )
}
