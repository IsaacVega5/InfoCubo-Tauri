import { BiStats } from "react-icons/bi";
import { HiColorSwatch } from "react-icons/hi";
import { IoIosCut } from "react-icons/io";
import { useImages } from "../hooks/useImages";
import { useWebSocket } from "../hooks/useWebSocket";
import CheckBtn from "./inputs/CheckBtn";
import RotateInput from "./inputs/rotateInput";
import useToolBar from "../hooks/useToolBar";
import { startTransition } from "react";
export default function ToolsBar() {
  const { currentImage } = useImages()
  const { sendMessage } = useWebSocket()
  const { activatePixelGet,deactivatePixelGet, removeDataFromPath, isPixelGetActivated } = useToolBar()

  const handleRGBChange = (value: boolean) => {
    if (!currentImage) return
    sendMessage('read_image', {
      'path': currentImage.path,
      'band': value ? 'RGB' : 0,
      'rotation': currentImage.rotation
    });
  }

  const handleRotationChange = (value: number) => {
    const sendMessageRotation = setTimeout(() => {
      if (!currentImage) return
      sendMessage('read_image', {
        'path': currentImage.path,
        'band': currentImage.band,
        'rotation': value,
      });
    }, 500)
    return () => clearTimeout(sendMessageRotation)
  }

  const handlePixelGetActivateClick = (value: boolean) => {
    if (!currentImage) return
    if (value) {
      startTransition(() => {
        activatePixelGet(currentImage.path)
        })
      }
    else {
      deactivatePixelGet(currentImage.path)
      removeDataFromPath(currentImage.path)
    }
  }

  return (
    <div className="flex bg-custom-black flex-row rounded-md p-1 m-1 mb-0 gap-1">
      <RotateInput 
        disabled={currentImage === null || currentImage=== undefined}
        onChange={handleRotationChange}
      />
      <CheckBtn label="RGB" disabled={currentImage === null || currentImage=== undefined} checked={currentImage?.band === 'RGB'} onChange={handleRGBChange}>
        <HiColorSwatch/>
      </CheckBtn>
      <CheckBtn label="Pixel stats" disabled={currentImage === null || currentImage=== undefined} checked={isPixelGetActivated(currentImage?.path || "")} onChange={handlePixelGetActivateClick}>
        <BiStats />
      </CheckBtn>
      <CheckBtn label="Cut" disabled={currentImage === null || currentImage=== undefined} checked={false} onChange={() => {}}>
        <IoIosCut />
      </CheckBtn>
    </div>
  )
}