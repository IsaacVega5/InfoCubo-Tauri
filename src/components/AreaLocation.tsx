import useToolBar from "../hooks/useToolBar"

interface IAreaLocationProps {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  text?: {min: string, max: string};
  selected: boolean;
}

export default function AreaLocation({id, x1, y1, x2, y2, text, selected}: IAreaLocationProps) {
  const { moveUpDataFromId } = useToolBar()

  const handleClick = () => {
    moveUpDataFromId(id)
  }
  const minX = Math.min(x1, x2)
  const maxX = Math.max(x1, x2)
  const minY = Math.min(y1, y2)
  const maxY = Math.max(y1, y2)

  const x = minX
  const y = minY

  const width = maxX - minX
  const height = maxY - minY

  const styleDots = selected ? "bg-primary" : "bg-white"
  const styleSelected = selected ? "text-primary" : "text-white"
  const styleDivSelected = selected ? "border-primary bg-primary/30" : "border-white bg-white/30"
  return (
    <button className={"flex flex-row gap-1 absolute justify-center select-none font-mono" + " " + styleSelected}
      style={{left: x, top: y, width: width, height: height}}
      onClick={handleClick}
     >
      
      <div className={"w-full h-full border-1" + " " + styleDivSelected} />
      {selected && <div className={"absolute w-full h-full border-1 border-primary animate-ping-light-on-start"}/>}
      

      <div className={`absolute h-1 w-1 top-0 left-0 -translate-0.5 bg-primary ${styleDots}`}/>
      <div className={`absolute h-1 w-1 bottom-0 right-0 translate-0.5 bg-primary ${styleDots}`}/>

      <span className="text-xs flex absolute -translate-x-1/2 -translate-y-full w-full justify-center text-nowrap">{text?.max}</span>
      <span className="text-xs flex absolute left-1/2 top-1/1 justify-center text-nowrap  w-full">{text?.min}</span>
    </button>
  )
}