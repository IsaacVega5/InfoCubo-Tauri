import React, { lazy, useEffect, useRef  } from "react";
import { useImages } from "../hooks/useImages"
import useToolBar from "../hooks/useToolBar";
import GraphViewGroup from "./ChartViewGroup";


const DataGetHandler = lazy(() => import('./DataGetHandler'))
export default function ImageCanvas() {
  const { currentImage, updateImage } = useImages()
  const { isPixelGetActivated} = useToolBar()
  const selfRef = useRef<HTMLDivElement>(null)
  
  const handleWheel = (event: React.WheelEvent) => {
    
    if (!event.ctrlKey || !currentImage) return
    const delta = event.deltaY
    let zoomValue = currentImage.zoom * (delta < 0 ? 1.1 : 0.9)
    if (zoomValue < 1){
      zoomValue = 1
    }
    let prevZoom = currentImage.zoom
    let newZoom = zoomValue
    
    const bcr = selfRef.current?.getBoundingClientRect()
    if (!bcr) return
    const mouseX = event.clientX - bcr.left + selfRef.current!.scrollLeft;
    const mouseY = event.clientY - bcr.top + selfRef.current!.scrollTop;
    
    setTimeout(() => {
      if (selfRef.current) {
        selfRef.current.scrollLeft =
        ( mouseX * newZoom) / prevZoom - (event.clientX - bcr.left);
        selfRef.current.scrollTop =
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
    if (selfRef.current) {
      selfRef.current.scrollLeft = currentImage.translation.x
      selfRef.current.scrollTop = currentImage.translation.y
    }
  }, [currentImage?.path])

  return (
    currentImage && <div className="flex-1 flex flex-col overflow-hidden relative">
      <div ref={selfRef} className="flex-1 overflow-x-scroll overflow-y-scroll flex items-center justify-center m-1 relative select-none" onWheel={handleWheel} onScroll={handleScroll}
        style={{
          scrollbarGutter: "stable both-edges"
        }}
      >      
        {currentImage &&
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
          />
        }
        { isPixelGetActivated(currentImage?.path || '') && <DataGetHandler />}
      </div>
      {isPixelGetActivated(currentImage?.path || '') && <GraphViewGroup />}
    </div>
  )
}