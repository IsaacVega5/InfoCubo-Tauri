import { useEffect, useRef, useState } from "react"
import useLongPress from "../hooks/useLongPress"
import { dataListElement, multiDataData } from "../context/ToolsBarContext"
import { useImages } from "../hooks/useImages"
import PixelLocation from "./PixelLocation"
import useToolBar from "../hooks/useToolBar"
import { useWebSocket } from "../hooks/useWebSocket"
import { get_new_size } from "../utils/transformation"
import { wsEvents } from "../constants/wsEvents"
import { useLoader } from "../hooks/useLoader"
import { listen } from "@tauri-apps/api/event"
import { event } from "@tauri-apps/api"
import SelectedArea from "./SelectedArea"
import ChartView from "./ChartView"
import AreaLocation from "./AreaLocation"

interface selectedArea {
  x1: number | null
  y1: number | null
  x2: number | null
  y2: number | null
}

export default function DataGetHandler() {
  const { currentImage } = useImages()
  const { isPixelGetActivated, dataList } = useToolBar()
  const { sendMessage } = useWebSocket()
  const { addProcess } = useLoader()
  const [currentDataList, setCurrentDataList] = useState<dataListElement[]>([])
  const [imgOffSet, setImgOffSet] = useState({ left: 0, top: 0, ratio: 1 })
  const selfRef = useRef<HTMLDivElement>(null)
  const [isMouseHold, setIsMouseHold] = useState(false)
  const [mouseSelectedArea, setMouseSelectedArea] = useState<selectedArea>({ x1: null, y1: null, x2: null, y2: null })


  useEffect(() => {
    if (!currentImage) return
    const list = dataList.filter(data => (data.path === currentImage.path))
    setCurrentDataList(list)

  }, [currentImage, dataList])

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

  const getContainerAndImageSizes = () => {
    if (!currentImage) return { container: null, image: null }

    const bcr = selfRef.current?.getBoundingClientRect()
    if (!bcr) return { container: null, image: null }

    const imgSize = { width: currentImage.size.width, height: currentImage.size.height}
    const newSize = get_new_size({ imageSize: [imgSize.width, imgSize.height], newSize: [bcr.width, bcr.height] })
    
    const container = { left: bcr.left, top: bcr.top, width: bcr.width, height: bcr.height }
    const image = { width: newSize.width, height: newSize.height }
    return { container: container, image : image, ratio: newSize.ratio }
  }

  const press = (event: React.MouseEvent<HTMLElement>) => {
    if (!currentImage) return
    if (!isPixelGetActivated(currentImage?.path)) return

    // const bcr = selfRef.current?.getBoundingClientRect()
    // if (!bcr) return
    // const size = { width: bcr.width, height: bcr.height }
    // const imgSize = { width: currentImage.size[1], height: currentImage.size[0] }
    // const new_size = get_new_size({ imageSize: [imgSize.width, imgSize.height], newSize: [size.width, size.height] })

    const { container, image } = getContainerAndImageSizes()
    if (!container || !image) return

    const imgCoords = {
      x: (event.clientX - container.left) - imgOffSet.left,
      y: (event.clientY - container.top) - imgOffSet.top
    }
    if (imgCoords.x < 0 || imgCoords.y < 0) return
    if (imgCoords.x > image.width || imgCoords.y > image.height) return

    sendMessage(wsEvents.READ_IMAGE_PIXEL, {
      'path': currentImage.path,
      'rotation': currentImage.rotation,
      'x': Math.floor(imgCoords.x / imgOffSet.ratio),
      'y': Math.floor(imgCoords.y / imgOffSet.ratio)
    });
    addProcess(wsEvents.READ_IMAGE_PIXEL)
  }
  const longPress = (event: React.MouseEvent<HTMLElement>) => {
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
    const { container, image, ratio } = getContainerAndImageSizes()
    if (!container || !image) return
    setImgOffSet({
      left: (container.width - image.width) / 2,
      top: (container.height - image.height) / 2,
      ratio: ratio
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
          currentDataList.length > 0 && (
            currentDataList.map((data: dataListElement, index: number) => {
              if (currentImage?.rotation === data.rotation && currentImage.path === data.path){
                if ( data.type === 'pixel') {
                  const { x, y } = data.coords as { x: number, y: number };
                    return (
                      <PixelLocation
                        key={`pxl-${data.id}`}
                        id={data.id}
                        x={x * imgOffSet.ratio + imgOffSet.left}
                        y={y * imgOffSet.ratio + imgOffSet.top}
                        selected={index === currentDataList.length - 1}
                        text={`${x}, ${y}`} 
                      />
                    )
                }
                else { 
                  const { x1, y1, x2, y2 } = data.coords as { x1: number, y1: number, x2: number, y2: number };
                  return (
                    <AreaLocation
                      key= {`area-${data.id}`}
                      id = {data.id}
                      text="Area"
                      selected={index === currentDataList.length - 1}
                      x1 = {x1 * imgOffSet.ratio + imgOffSet.left}
                      y1 = {y1 * imgOffSet.ratio + imgOffSet.top}
                      x2 = {x2 * imgOffSet.ratio + imgOffSet.left}
                      y2 = {y2 * imgOffSet.ratio + imgOffSet.top}
                    />
                  )
                }
              } 
            })
          )
        }
        {
          currentDataList.length > 0 && (
            currentDataList.map((data: dataListElement) => (
              <ChartView
                key={`chart-${data.id}`}
                id={data.id}
                parentRef={selfRef}
                title={data.type === 'area' ? "Area" : "Pixel"}
                dataList={data.type === 'area' ? [{
                  title: "min",
                  data: (data.data as multiDataData).min,
                  style: { color: '#339AF0', lineStyle: 1 }
                }, {
                  title: "max",
                  data: (data.data as multiDataData).max,
                  style: { color: '#FA5252', lineStyle: 1 }
                }, {
                  title: "mean",
                  data: (data.data as multiDataData).mean,
                }] : 
                [{ data: data.data as number[] }]}
              />
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
