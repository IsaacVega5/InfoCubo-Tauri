import './ToolBar.css'
import { save} from '@tauri-apps/api/dialog';
import { TiExport } from "react-icons/ti";

import InputRotation from './tools/InputRotation.jsx';
import CheckBtn from './inputs/CheckBtn.jsx';
import { FaChartLine, FaScissors } from "react-icons/fa6";
import { MdGridOn } from "react-icons/md";
import { useContext } from 'react';
import { ToolsContext } from '../context/tools.jsx';
import { HiperImgContext } from '../context/hiperImg.jsx';
import { exportChannels, saveHiper } from '../services/hiper.js';
import { useOptionDialog } from '../hooks/useOptionDialogs.jsx';
import { useExportOptions } from '../hooks/useExportOptions.jsx';

export default function ToolBar({setLoader}) {
  const {hiperImgValues, setHiperImgValues} = useContext(HiperImgContext)
  const {toolsValues, setToolsValues} = useContext(ToolsContext)
  const expOptions = useExportOptions()
  const dialog = useOptionDialog()

  const export_btn = async () => {
    
    if (hiperImgValues.path == "") return
    expOptions.open()
    return 

    const name_cutPoints = (toolsValues.cutPoints[0] == null) ? 'NONE' : Math.floor(toolsValues.cutPoints[0].x) + '_' + Math.floor(toolsValues.cutPoints[0].y)
    const pathParts = hiperImgValues.path.split('\\');
    const fileName = pathParts.pop().split('.')[0] + '_rotated_'+toolsValues.rotationValue + '_cut_' + name_cutPoints;
    const path = pathParts.join('\\');

    const filePath = await save({
      title: 'Exportar',
      defaultPath: `${path}\\${fileName}`,
      filters: [{
        name: 'Envi HDR',
        extensions: ['hdr']
      },
      {
        name: 'Multiples imágenes',
        extensions: ['tif']
      }]
    });

    if (!filePath) return
    setLoader(true)

    const extension = filePath.split('.').pop()
    
    const exportAction = extension == 'hdr' ? saveHiper : exportChannels
    
    const res = await exportAction({
      imagePath: hiperImgValues.path,
      outputPath: filePath, 
      rotation: toolsValues.rotationValue,
      cutPoints: JSON.stringify(toolsValues.cutPoints)
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
    
    const message = extension == 'hdr' ? 'Se ha exportado el archivo: ' : 'Se han exportado los archivos en: '
    const dirPath = extension == 'hdr' ? res.path.split('\\').slice(0, -1).join('\\') :  res.path

    dialog.setOptionsDialog({
      title: 'Exportar',
      message: `${message} ${res.path}`,
      type: 'info',
      options:   extension == 'hdr' ? ['Abrir directorio','Abrir imagen', 'Aceptar'] : ['Abrir directorio', 'Aceptar'],
      actions: extension == 'hdr' ? [
        () => dirOpen(dirPath), () =>setHiperImgValues(prev => ({...prev, path: res.path})), () => {}
      ] : [
        () => dirOpen(dirPath), () => {}
      ]
    })
  }

  return (
    <div className='ToolBar'>
      <div className="tools">
        <InputRotation setLoader={setLoader}/>
        <CheckBtn value={toolsValues.pixelCheck} 
          title="Obtener información de un pixel"
          onChange={(value) => setToolsValues(prev => ({...prev, pixelCheck: value}))}>
          <FaChartLine className="icon"/>
        </CheckBtn>

        <CheckBtn value={toolsValues.cutCheck} 
          title="Seleccionar area de corte"
          onChange={(value) => setToolsValues(prev => ({...prev, cutCheck: value}))}>
          <FaScissors className="icon"/>
        </CheckBtn>

        <CheckBtn value={toolsValues.drawGrid} 
          title="Mostrar cuadricula de ayuda"
          onChange={(value) => setToolsValues(prev => ({...prev, drawGrid: value}))}>
          <MdGridOn className="icon"/>
        </CheckBtn>
        
      </div>
      <button className="btnExport" onClick={export_btn}>
        <TiExport/>
        Exportar
      </button>
    </div>
  )
}