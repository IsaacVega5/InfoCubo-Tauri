import React, { lazy, useEffect, useRef, useState  } from "react";
import { useImages } from "../hooks/useImages"
import useToolBar from "../hooks/useToolBar";


const DataGetHandler = lazy(() => import('./DataGetHandler'))

interface MouseStateProps { 
  pos: { x: number, y: number }, 
  Action: 'Release' | 'Press' | 'Move' 
}

interface ImageStateProps {
  zoom : number,
  translation : { x: number, y: number }
}

export default function ImageCanvas() {
  const { currentImage, updateImage } = useImages()
  const { isPixelGetActivated} = useToolBar()
  const selfRef = useRef<HTMLDivElement>(null)
  
  const handleWheel = (event: React.WheelEvent) => {
    
    if (!event.ctrlKey || !currentImage) return
    console.log(event);
    const delta = event.deltaY
    let zoomValue = currentImage.zoom * (delta < 0 ? 1.1 : 0.9)
    if (zoomValue < 1){
      zoomValue = 1
    }
    
    updateImage({...currentImage, zoom: zoomValue})
  }

  const handleScroll : React.UIEventHandler<HTMLDivElement> = (event) => {
    if (!currentImage) return
    updateImage({...currentImage, translation: { x: event.currentTarget.scrollLeft, y: event.currentTarget.scrollTop }})
  }

  return (
    <div ref={selfRef} className="flex-1 overflow-x-scroll overflow-y-scroll flex items-center justify-center m-1 relative select-none" onWheel={handleWheel} onScroll={handleScroll} >      
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
      <div className="absolute bottom-2 right-2 flex flex-row gap-1"> 
        {/* <button className="bg-black h-7 w-7 rounded-md" onClick={() => setZoom(zoom - 0.1)} >-</button>
        <button className="bg-black h-7 w-7 rounded-md" onClick={() => setZoom(zoom + 0.1)}>+</button> */}
      </div>
    </div>
  )
}