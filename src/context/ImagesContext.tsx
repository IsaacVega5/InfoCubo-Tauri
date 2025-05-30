import { createContext, useEffect, useState } from 'react';

export interface ImagesContextType {
  image: image[];
  addImage: (newImage: image) => void;
  removeImage: (path: string) => void;
  updateImage: (updatedImage: image) => void;
  clearImages: () => void;
  getImage: (path: string) => image | undefined;
  getImages: () => image[];
  getImageByPath: (path: string) => image | undefined;
  currentImage: image | null;
  setCurrentImage: (image: image) => void;
}
export const ImagesContext = createContext<ImagesContextType | null>(null)


export interface image {
  path: string;
  url: string;
  band: number | 'RGB';
  metadata: any;
  rotation: number;
  size: { width: number, height: number };
  zoom: number;
  translation: { x: number, y: number };
} 
interface ImagesProviderProps {
  children: React.ReactNode;
}
export function ImagesProvider({ children } : ImagesProviderProps) {
  const [image, setImage] = useState<image[]>([]);
  const [currentImage, setCurrentImage] = useState<image | null>(null);

  useEffect(() => {
    image.find((img) => img.path === currentImage?.path) ? setCurrentImage(currentImage) : setCurrentImage(image[0]);
  }, [image, currentImage]);

  const addImage = (newImage: image) => {
    setImage((prevImages) => {
      if (prevImages.find((img) => img.path === newImage.path)) return prevImages;
      return [...prevImages, newImage];
    });
    console.log(newImage);
    
    setCurrentImage(newImage);
  };
  const removeImage = (path: string) => {
    setImage((prevImages) => prevImages.filter((img) => img.path !== path));
  }
  const updateImage = (updatedImage: image) => {
    setImage((prevImages) => prevImages.map((img) => img.path === updatedImage.path ? updatedImage : img));
    if (updatedImage.path === currentImage?.path) setCurrentImage(updatedImage);
  }
  const clearImages = () => {
    setImage([]);
  }
  const getImage = (path: string) => {
    return image.find((img) => img.path === path);
  }
  const getImages = () => {
    return image;
  }
  const getImageByPath = (path: string) => {
    return image.find((img) => img.path === path);
  }

  return (
    <ImagesContext.Provider value={{
      image,
      addImage,
      removeImage,
      updateImage,
      clearImages,
      getImage,
      getImages,
      getImageByPath,
      currentImage,
      setCurrentImage,
    }}>
      {children}
    </ImagesContext.Provider>
  )
}