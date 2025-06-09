import React, { lazy, useEffect, useState  } from "react";
import { useImages } from "../hooks/useImages"
import useToolBar from "../hooks/useToolBar";
import GraphViewGroup from "./ChartViewGroup";
import { useWebSocket } from "../hooks/useWebSocket";
import { wsEvents } from "../constants/wsEvents";
import { useDisplayImage } from "../hooks/useDisplayImage";


const DataGetHandler = lazy(() => import('./DataGetHandler'))
export default function ImageCanvas() {
  const { currentImage, updateImage } = useImages()
  const { displayRef } = useDisplayImage()
  const { isPixelGetActivated} = useToolBar()
  const { sendMessage } = useWebSocket()
  const [imgError, setImgError] = useState(false)
  

  const handleWheel = (event: React.WheelEvent) => {
    if (!event.ctrlKey || !currentImage) return
    const delta = event.deltaY
    let zoomValue = currentImage.zoom * (delta < 0 ? 1.1 : 0.9)
    if (zoomValue < 1){
      zoomValue = 1
    }
    let prevZoom = currentImage.zoom
    let newZoom = zoomValue
    
    const bcr = displayRef.current?.getBoundingClientRect()
    if (!bcr) return
    const mouseX = event.clientX - bcr.left + displayRef.current!.scrollLeft;
    const mouseY = event.clientY - bcr.top + displayRef.current!.scrollTop;
    
    setTimeout(() => {
      if (displayRef.current) {
        displayRef.current.scrollLeft =
        ( mouseX * newZoom) / prevZoom - (event.clientX - bcr.left);
        displayRef.current.scrollTop =
        (mouseY * newZoom) / prevZoom - (event.clientY - bcr.top);
      }
    }, 0);
    updateImage({...currentImage, zoom: zoomValue})
  }

  const handleScroll : React.UIEventHandler<HTMLDivElement> = (event) => {
    if (!currentImage) return
    updateImage( {
        ...currentImage, 
        translation: {
           x: event.currentTarget.scrollLeft, 
           y: event.currentTarget.scrollTop 
          }
      }
    )
  }

  useEffect(() => {
    if (!currentImage) return
    if (displayRef.current) {
      displayRef.current.scrollLeft = currentImage.translation.x
      displayRef.current.scrollTop = currentImage.translation.y
    }
  }, [currentImage?.path])

  const onImageError = () => {
    if (!currentImage) return
    setImgError(true)
    updateImage({...currentImage, url: ''})
    sendMessage(wsEvents.READ_IMAGE, { 'path': currentImage?.path || '', 'band': 'RGB', 'rotation': currentImage.rotation })
  }

  useEffect(()=>{
    if (!currentImage) return
    setImgError(false)
  }, [currentImage?.url])

  return (
    currentImage && <div className="flex-1 flex flex-col overflow-hidden relative">
      <div ref={displayRef} className="flex-1 overflow-x-scroll overflow-y-scroll flex items-center justify-center m-1 relative select-none" onWheel={handleWheel} onScroll={handleScroll}
        style={{
          scrollbarGutter: "stable both-edges"
        }}
      >      
        {
          imgError ? (
            <div className="w-full h-full flex items-center justify-center">
              <img src='loading.svg' alt="Placeholder" className="w-15 object-contain"/>
            </div>
          ) : (
            <img
              src={currentImage?.url || ''} 
              alt="Imagen"
              className="object-contain h-full w-full"
              style={{
                transform: `scale(${currentImage.zoom})`,
                transformOrigin: "top left",
                display: "block",
                imageRendering: 'pixelated',
              }}
              onError={onImageError}
            />
          )
        }
        
        { isPixelGetActivated(currentImage?.path || '') && <DataGetHandler />}
      </div>
      {isPixelGetActivated(currentImage?.path || '') && <GraphViewGroup />}
    </div>
  )
}