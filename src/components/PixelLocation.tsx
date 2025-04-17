import { MdMyLocation } from "react-icons/md";
import useToolBar from "../hooks/useToolBar";

export default function PixelLocation({id, x, y, text, selected}: {id:string,x: number, y: number, text?: string, selected: boolean}) {
  const { moveUpPixelDataFromId } = useToolBar()

  const handleClick = () => {
    moveUpPixelDataFromId(id)
  }

  const styleSelected = selected ? "text-primary" : "text-white"
  return (
    <button className={"flex flex-row gap-1 items-center -translate-1/2 absolute justify-center select-none" + " " + styleSelected}
      style={{left: x, top: y}}
      onClick={handleClick}
      >
      <MdMyLocation />
      {selected && <MdMyLocation className="absolute animate-ping"/>}
      {text && <p className="text-xs absolute flex items-center translate-y-1/1 whitespace-nowrap">{text}</p>}
    </button>
  )
}