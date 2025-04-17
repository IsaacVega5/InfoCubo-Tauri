import { AreaData, ColorType, createChart, IChartApi, LineSeries, Time } from 'lightweight-charts';
import { MouseEvent, useEffect, useRef, useState } from "react";
import { IoMdClose } from 'react-icons/io';
import useToolBar from '../hooks/useToolBar';

interface Props {
  id: string,
  parentRef: React.RefObject<HTMLDivElement> ,
  title : string,
  data : number[]
}

export default function Chart({ id, parentRef, title, data }: Props) {
  const [holding, setHolding] = useState(false);
  const [windowPos, setWindowPos] = useState<{ x: number | null, y: number | null }>({ x: null, y: null});
  const [mousePos, setMousePos] = useState<{ x: number | null, y: number | null }>({ x: null, y: null});
  const selfRef = useRef<HTMLDivElement | null>(null)
  const contChartRef = useRef<HTMLDivElement | null>(null)
  const selfChart = useRef<HTMLDivElement | null>(null)
  const chart = useRef<IChartApi | null>(null)
  const { removePixelDataFromId, moveUpPixelDataFromId, updatePixelDataFromId, getPixelDataFromId } = useToolBar();

  const handleMouseMove = (e: globalThis.MouseEvent) => {
    if (!parentRef.current || !holding) return
    const bcr = parentRef.current!.getBoundingClientRect()
    const x = e.clientX - bcr.left
    const y = e.clientY - bcr.top

    const new_x = x - (mousePos.x || 0)
    const new_y = y - (mousePos.y || 0)

    setWindowPos({
      x: new_x < 0 ? 0 : new_x,
      y: new_y < 0 ? 0 : new_y
    })
    updatePixelDataFromId(id, data, {x: new_x, y: new_y})
  }


  useEffect(() => {
    if (!selfRef.current) return
    const dataPos = getPixelDataFromId(id)?.pos
    if (!dataPos) return
    setWindowPos({x: dataPos?.x, y: dataPos?.y})
  }, [])


  const handleMouseDown = (e : MouseEvent<HTMLElement>) => {
    setHolding(true)
    const bcr = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - bcr.left
    const y = e.clientY - bcr.top
    setMousePos({ x, y })

    moveUpPixelDataFromId(id)
  }

  useEffect(() => {
    if (!parentRef.current || !holding) return
    parentRef.current.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', () => setHolding(false))

    return () => {
      parentRef.current!.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', () => setHolding(false))
    }
  }, [holding])

  useEffect(() => {
    if (!selfChart.current || !contChartRef.current) return

    if (chart.current) return
    const handleResize = () =>{
      if (!chart.current) return
      chart.current.applyOptions({ width: contChartRef.current!.clientWidth});
    }
    chart.current = createChart(selfChart.current, {
        layout: { 
          attributionLogo: false,
          background: { type: ColorType.Solid, color: "#222222" },
          textColor: "#d1d4dc",
          fontSize: 12,},
        width: contChartRef.current.clientWidth - 4,
        leftPriceScale:{
          visible: true
        },
        rightPriceScale: {
          visible: false
        },
        localization: {
          timeFormatter: (time : any) => {
            return time.toString();
          }
        },
        timeScale: {
          tickMarkFormatter: (time : any) => {
            return time.toString();
          }
        },
        grid: {
          vertLines: { color: '#444' },
          horzLines: { color: '#444' },
        },
    });
    chart.current.timeScale().fitContent();
    chart.current.timeScale().applyOptions({
      borderColor: '#444'
    })
    chart.current.priceScale("left").applyOptions({
      borderColor: '#444'
    })
    if (!chart.current) return
    const newSeries = chart.current.addSeries(LineSeries,{
      lineStyle: 0,
      lineWidth: 2,
      lastValueVisible: false,
      color: "#4ebf71",
      priceLineVisible: false,
      priceFormat:{
        
      },
    });
    const listValues = data
    const list_data : AreaData[] = []
    listValues.forEach((value, index) => {
      list_data.push({ time: index as Time, value })
    })
    newSeries.setData(list_data);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, [contChartRef, selfChart])

  const handleClose = () => {
    removePixelDataFromId(id)
  }

  return (
    <div 
    ref={selfRef}
      className="flex flex-col  h-64 w-96 absolute drop-shadow-md bg-custom-black"
      style={{
        left : windowPos.x === null ? '50%' : `${windowPos.x}px`,
        top : windowPos.y === null ? '50%' : `${windowPos.y}px`,
        transform: windowPos.x === null || windowPos.y === null ? 'translate(-50%, -50%)' : ''
      }}
    >
      <header className="flex flex-row justify-between text-white p-2 cursor-pointer hover:brightness-125 bg-custom-black select-none "
        onMouseDown={handleMouseDown}
      >
        <span>
          {title}
        </span>
         <button className="hover:text-custom-red" onClick={handleClose}>
          <IoMdClose />
        </button>
      </header>
      <div className="flex flex-col flex-1 overflow-hidden pr-2"
        onClick={(e) =>{
          e.stopPropagation()
          moveUpPixelDataFromId(id)
        }}
      >
        <div ref={contChartRef} className="flex flex-1 bg-custom-black">
          <div ref={selfChart} />
        </div>
      </div>
    </div>
  )
}