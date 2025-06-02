import { useEffect, useRef, useState } from "react"
import { dataListElement, multiDataData } from "../context/ToolsBarContext"
import useToolBar from "../hooks/useToolBar"
import { useImages } from "../hooks/useImages"
import ChartView from "./ChartView"

export default function GraphViewGroup() {
  const [currentDataList, setCurrentDataList] = useState<dataListElement[]>([])
  const selfRef = useRef<HTMLDivElement>(null)
  const { dataList } = useToolBar()
  const { currentImage } = useImages()

  useEffect(() => {
    if (!currentImage) return
    const list = dataList.filter(data => (data.path === currentImage.path))
    setCurrentDataList(list)

  }, [currentImage, dataList])

  useEffect(() => {
    setCurrentDataList(dataList.filter((data: dataListElement) => data.path === currentImage?.path))
  }, [dataList])

  const coordsToText = (coords: { x: number, y: number } | { x1: number, y1: number, x2: number, y2: number }) => {
    if ('x' in coords) {
      return `${coords.x}, ${coords.y}`
    }
    return `${Math.min(coords.x1, coords.x2)}, ${Math.min(coords.y1, coords.y2)} - ${Math.max(coords.x1, coords.x2)}, ${Math.max(coords.y1, coords.y2)}`
  }

  return(
    <div ref={selfRef} className="flex-row gap-1 absolute pointer-events-none h-full w-full"
    >
      {
          currentDataList.length > 0 && (
            currentDataList.map((data: dataListElement) => (
              <ChartView
                key={`chart-${data.id}`}
                id={data.id}
                parentRef={selfRef}
                title={ `${data.type[0].toUpperCase() + data.type.slice(1)} | ${coordsToText(data.coords)}`}
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
    </div>
  )
}