import useToolBar from "../hooks/useToolBar"

export default function AreaLocation({id, x1, y1, x2, y2, text, selected}: {id:string,x1: number, y1: number, x2: number, y2: number, text?: string, selected: boolean}) {
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

  const styleSelected = selected ? "text-primary" : "text-white"
  const styleDivSelected = selected ? "border-primary bg-primary/30" : "border-white bg-white/30"
  return (
    <button className={"flex flex-row gap-1 items-center -translate-1/2 absolute justify-center select-none" + " " + styleSelected}
      style={{left: x, top: y, width: width, height: height}}
      onClick={handleClick}
     >
      
      <div className={"w-full h-full border-1" + " " + styleDivSelected} />
      {selected && <div className={"absolute w-full h-full border-1 border-primary animate-ping-light"}/>}
      
      {text && <p className="text-xs absolute flex items-center translate-y-1/1 whitespace-nowrap">{text}</p>}
    </button>
  )
}