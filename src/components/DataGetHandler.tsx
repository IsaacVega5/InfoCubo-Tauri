import { useEffect, useRef, useState } from "react"
import useLongPress from "../hooks/useLongPress"
import { pixelData } from "../context/ToolsBarContext"
import { useImages } from "../hooks/useImages"
import PixelLocation from "./PixelLocation"
import useToolBar from "../hooks/useToolBar"
import { useWebSocket } from "../hooks/useWebSocket"
import { get_new_size } from "../utils/transformation"
import { wsEvents } from "../constants/wsEvents"
import { useLoader } from "../hooks/useLoader"
import { listen } from "@tauri-apps/api/event"
import { event } from "@tauri-apps/api"
import Chart from "./Chart"
import SelectedArea from "./SelectedArea"

interface selectedArea {
  x1: number | null
  y1: number | null
  x2: number | null
  y2: number | null
}

export default function DataGetHandler() {
  const { currentImage } = useImages()
  const { isPixelGetActivated, pixelDataList } = useToolBar()
  const { sendMessage } = useWebSocket()
  const { addProcess } = useLoader()
  const [currentPixelDataList, setCurrentPixelDataLista] = useState<pixelData[]>([])
  const [imgOffSet, setImgOffSet] = useState({ left: 0, top: 0, ratio: 1 })
  const selfRef = useRef<HTMLDivElement>(null)
  const [isMouseHold, setIsMouseHold] = useState(false)
  const [mouseSelectedArea, setMouseSelectedArea] = useState<selectedArea>({ x1: null, y1: null, x2: null, y2: null })


  useEffect(() => {
    if (!currentImage) return
    const list = pixelDataList.filter(pixelData => (pixelData.path === currentImage.path))
    setCurrentPixelDataLista(list)

  }, [currentImage, pixelDataList])

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [isMouseHold, mouseSelectedArea])

  const handleMouseMove = (e: MouseEvent) => {    
    if(!isMouseHold) return
    const bcr = selfRef.current!.getBoundingClientRect()
    const x = e.clientX - bcr.left
    const y = e.clientY - bcr.top
    if (
      x < 0 || x > bcr.width ||
      y < 0 || y > bcr.height
    ) return
    
    if (!mouseSelectedArea.x1) {
      setMouseSelectedArea({ x1: x, y1: y, x2: x, y2: y })
    }else{
      setMouseSelectedArea(prev => ({ ...prev, x2: x, y2: y }))
    }

  }

  const press = (event: React.MouseEvent<HTMLElement>) => {
    if (!currentImage) return
    if (!isPixelGetActivated(currentImage?.path)) return

    const bcr = selfRef.current?.getBoundingClientRect()
    if (!bcr) return
    const size = { width: bcr.width, height: bcr.height }
    const imgSize = { width: currentImage.size[1], height: currentImage.size[0] }
    const new_size = get_new_size({ imageSize: [imgSize.width, imgSize.height], newSize: [size.width, size.height] })

    const imgCoords = {
      x: (event.clientX - bcr.left) - imgOffSet.left,
      y: (event.clientY - bcr.top) - imgOffSet.top
    }
    if (imgCoords.x < 0 || imgCoords.y < 0) return
    if (imgCoords.x > new_size.width || imgCoords.y > new_size.height) return

    sendMessage(wsEvents.READ_IMAGE_PIXEL, {
      'path': currentImage.path,
      'rotation': currentImage.rotation,
      'x': Math.floor(imgCoords.x / new_size.ratio),
      'y': Math.floor(imgCoords.y / new_size.ratio)
    });
    addProcess(wsEvents.READ_IMAGE_PIXEL)
  }
  const longPress = (event: React.MouseEvent<HTMLElement>) => {
    console.log('longpress');
    const bcr = selfRef.current!.getBoundingClientRect()
    const x = event.clientX - bcr.left
    const y = event.clientY - bcr.top
    if (
      x < 0 || x > bcr.width ||
      y < 0 || y > bcr.height
    ) return
    setMouseSelectedArea({ x1: x, y1: y, x2: x, y2: y })
    setIsMouseHold(true)
  }
  const onPressStop = () => {
    setIsMouseHold(false)
    console.log("PRESS STOP");
    if (!mouseSelectedArea.x1 || !mouseSelectedArea.y1 || !mouseSelectedArea.x2 || !mouseSelectedArea.y2) return

    const area = {
      'x1': Math.floor((mouseSelectedArea.x1 - imgOffSet.left) / imgOffSet.ratio),
      'y1': Math.floor((mouseSelectedArea.y1 - imgOffSet.top) / imgOffSet.ratio),
      'x2': Math.floor((mouseSelectedArea.x2 - imgOffSet.left) / imgOffSet.ratio),
      'y2': Math.floor((mouseSelectedArea.y2 - imgOffSet.top) / imgOffSet.ratio)
    }

    sendMessage(wsEvents.READ_IMAGE_AREA, {
      'path': currentImage!.path,
      'rotation': currentImage!.rotation,
      'area': area
    });
    
    addProcess(wsEvents.READ_IMAGE_AREA)
    setMouseSelectedArea({ x1: null, y1: null, x2: null, y2: null })
  }
  const { handlers } = useLongPress({
    click: press,
    longPress : longPress, 
    pressStop: onPressStop,
    wait: 100
  })

  const setImageOffsetForPixels = () => {
    if (!currentImage) return
    const bcr = selfRef.current?.getBoundingClientRect()
    if (!bcr) return
    const size = { width: bcr.width, height: bcr.height }
    const imgSize = { width: currentImage.size[1], height: currentImage.size[0] }
    const new_size = get_new_size({ imageSize: [imgSize.width, imgSize.height], newSize: [size.width, size.height] })

    setImgOffSet({
      left: (size.width - new_size.width) / 2,
      top: (size.height - new_size.height) / 2,
      ratio: new_size.ratio
    }
    )
  }

  useEffect(() => {
    if (!currentImage) return
    setImageOffsetForPixels()
  }, [currentImage])

  listen(event.TauriEvent.WINDOW_RESIZED, () => setImageOffsetForPixels())

  return (

    <div ref={selfRef} className="h-full w-full absolute">
      <div className="h-full w-full absolute" {...handlers}></div>
      <div className="h-full w-full">
        {
          currentPixelDataList.length > 0 && (
            currentPixelDataList.map((pixelData: pixelData, index: number) => {
              if (currentImage?.rotation === pixelData.rotation && currentImage.path === pixelData.path) return (
                <PixelLocation
                  key={`pxl-${pixelData.id}`}
                  id={pixelData.id}
                  x={pixelData.coord.x * imgOffSet.ratio + imgOffSet.left}
                  y={pixelData.coord.y * imgOffSet.ratio + imgOffSet.top}
                  selected={index === currentPixelDataList.length - 1}
                  text={`${pixelData.coord.x}, ${pixelData.coord.y}`} />
              )
            })
          )
        }
        {
          currentPixelDataList.length > 0 && (
            currentPixelDataList.map((pixelData: pixelData) => (
              <Chart
                key={`chart-${pixelData.id}`}
                id={pixelData.id}
                parentRef={selfRef}
                title={`Data for function: ${pixelData.coord.x}, ${pixelData.coord.y} with ${pixelData?.rotation}°`}
                data={pixelData.data} />
            ))
          )
        }
        {
          (isMouseHold) && <SelectedArea position={mouseSelectedArea} />
        }
      </div>
    </div>
  )
}
