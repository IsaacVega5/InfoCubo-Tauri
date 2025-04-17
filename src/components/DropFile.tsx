import { RiDragDropFill } from "react-icons/ri";

export default function DropFile() {
  return (
    <div className="flex flex-col justify-center items-center w-full absolute h-full bg-custom-black/50">
        <div className="flex flex-col gap-2 justify-center items-center p-4 rounded-md border-2 border-dashed border-primary text-white text-center animate-pulse">
          <RiDragDropFill className="text-6xl text-primary" />
          <span>Drop image</span>
        </div>
      </div>
  )
}