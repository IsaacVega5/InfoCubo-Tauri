import { IoMdClose } from "react-icons/io";
import { useImages } from "../hooks/useImages"
import { useEffect, useRef } from "react";

export function ImageTabs() {
  const {getImages, currentImage} = useImages();
  
  return (
    <div className="flex flex-row items-center justify-start bg-custom-black w-full overflow-x-auto scrollbar-thumb-gray-500 scrollbar-thin scrollbar-track-custom-lighter-black scrollbar-thumb-rounded-none">
      {
        getImages().map((image, index) => (
          <ImageTab key={`tab-${index}`} path={image.path} active={image.path === currentImage?.path} />
        ))
      }
      {
        getImages().length === 0 && (
          <ImageTab key={`tab-0`} path={'No images'} active={true} />
        )
      }
    </div>
  )
}

function ImageTab({path, active} : {path : string, active : boolean}) {
  const myRef = useRef<HTMLDivElement>(null);
  const {removeImage, setCurrentImage, getImageByPath} = useImages();
  const bgColor = active ? 'bg-custom-lighter-black border-gray-400' : 'bg-custom-black hover:brightness-125 border-transparent';

  useEffect(() => {
    if (active) {
      myRef.current?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }
  }
  , [active]);

  const getName = (path : string) =>{
    const parts = path.replace(/\\/g, '/').split('/');
    return parts[parts.length - 1];
  }

  const handleClose = () => {
    removeImage(path)
  }

  const handleClick = () => {
    const image = getImageByPath(path);
    if (!image) return;
    setCurrentImage(image);
  }

  return (
    <div ref={myRef} className={`${bgColor} border-b-1 flex flex-row gap-0.5 items-center p-2 select-none cursor-pointer`} onClick={handleClick}>
      <span className="text-xs">{getName(path)}</span>
      <button className="hover:text-custom-red" onClick={handleClose}>
        <IoMdClose />
      </button>
    </div>
  )
}