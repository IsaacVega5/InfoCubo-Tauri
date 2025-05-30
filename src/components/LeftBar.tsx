import { open } from '@tauri-apps/plugin-dialog';
import { useEffect, useRef } from "react";
import { RiImageAddFill } from "react-icons/ri";
import { useImages } from "../hooks/useImages";
import { useWebSocket } from "../hooks/useWebSocket";
import MetadataViewer from "./MetadataViewer";
import toast from 'react-hot-toast';
import { wsEvents } from '../constants/wsEvents';
import { useLoader } from '../hooks/useLoader';

export default function LeftBar() {
  const { sendMessage, subscribe, unsubscribe } = useWebSocket();
  const { setCurrentImage, addImage, getImageByPath, updateImage } = useImages();
  const leftBar =useRef<HTMLDivElement>(null);
  const rightBorder = useRef<HTMLDivElement>(null);
  const { addProcess, removeProcess} = useLoader()
  
  useEffect(() => {
    const handleImageResponse = (data : any) => {
      if (!data) return
      if (data.error){
        toast.error(data.error)
        return
      }
      const saved_image = getImageByPath(data.path)
      if (saved_image) {
        updateImage({...saved_image, band: data.band, url: data.url, metadata: data.metadata, rotation: data.rotation, })
      }else{
        addImage({
          path: data.path,
          band: data.band,
          url: data.url,
          metadata: data.metadata,
          rotation: 0,
          size: data.size,
          zoom: 1,
          translation: { x: 0, y: 0 }
        });
      }
      setCurrentImage({...data, zoom: 1, translation: { x: 0, y: 0 }})
      removeProcess(wsEvents.READ_IMAGE)
    }

    subscribe(wsEvents.READ_IMAGE, handleImageResponse)

    return () => {
      unsubscribe(wsEvents.READ_IMAGE, handleImageResponse)
    }
  }, [subscribe, unsubscribe]);

  const handleNewImage = async () => {
    const paths = await open({
      directory: false,
      multiple: true,
      filters: [{ name: 'ENVI', extensions: ['hdr'] }]
    });
    paths?.forEach((path: string) => {
      if (path) {
        sendMessage(wsEvents.READ_IMAGE, {
          'path': path,
          'band': 'RGB',
          'rotation': 0
        });
      }  
    })
    addProcess(wsEvents.READ_IMAGE)
  }

  useEffect(() => {
    if (!rightBorder.current || !leftBar.current) return
    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = e.clientX;
      leftBar.current!.style.width = `${newWidth}px`
    };
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    rightBorder.current.addEventListener('mousedown', handleMouseDown);
    return () => {
      rightBorder.current?.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [leftBar, rightBorder]);

  return (
    <div ref={leftBar} className="flex relative flex-col gap-4 left-bar bg-custom-black h-screen p-2 overflow-hidden"
      style={{
        minWidth: '150px',
        width: '150px',
      }}
    >
      <button className="bg-primary text-custom-black p-2 gap-1 flex flex-row items-center hover:brightness-110" onClick={handleNewImage}>
        <RiImageAddFill />
        New Image
      </button>

      <div className="flex flex-col w-full grow overflow-hidden">
        <MetadataViewer />
      </div>

      <div ref={rightBorder} className="flex h-[calc(100%+.5rem)] w-1 bg-transparent absolute -top-2 right-0 cursor-ew-resize resize-y"/>
    </div>
  );
}