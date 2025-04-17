import { lazy, useRef  } from "react";
import { useImages } from "../hooks/useImages"
import useToolBar from "../hooks/useToolBar";


const DataGetHandler = lazy(() => import('./DataGetHandler'))

export default function ImageCanvas() {
  const { currentImage } = useImages()
  const { isPixelGetActivated} = useToolBar()
  const selfRef = useRef<HTMLDivElement>(null)
  

  return (
    <div ref={selfRef} className="flex-1 overflow-hidden flex items-center justify-center m-1 relative select-none">
      {currentImage && <img src={currentImage?.url || ''} alt="Placeholder" className="w-full h-full object-contain"  />
      }
      { isPixelGetActivated(currentImage?.path || '') && <DataGetHandler />}
    </div>
  )
}