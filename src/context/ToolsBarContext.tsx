import { createContext, useState } from "react";

export const ToolsBarContext = createContext<{
  pixelDataList: pixelData[],
  isPixelGetActivated: (path: string) => boolean
  activatePixelGet: (path: string) => void
  deactivatePixelGet: (path: string) => void
  addPixelData: (id:string, path: string, data: number[], pos: {x: number, y: number}, rotation: number) => void
  getAllPixelDataFromPath: (path: string) => pixelData[] | undefined
  removePixelDataFromPath: (path: string) => void
  getPixelDataFromId: (id: string) => pixelData | undefined
  removePixelDataFromId: (id: string) => void
  updatePixelDataFromId: (id: string, data: number[], pos: {x: number | null, y: number | null}) => void,
  moveUpPixelDataFromId: (id: string) => void,

  areaDataList: areaData[],
  addAreaData: (id: string, path: string, coords: { x1: number; y1: number; x2: number; y2: number; }, data: { mean: number[]; min: number[]; max: number[]; }) => void
  getAreaDataFromId: (id: string) => areaData | undefined
  removeAreaDataFromId: (id: string) => void
} | null>(null);

export interface pixelData {
  id: string,
  path: string,
  data: number[],
  coord: {x: number, y: number},
  pos: {x: number | null, y: number | null},
  rotation: number
}
export interface areaData {
  id: string,
  path: string,
  coords : {x1: number, y1: number, x2: number, y2: number},
  data: {
    mean: number[],
    min: number[],
    max: number[],
  },
}

export function ToolsBarProvider({ children } : any) {
  const [pixelActivated, setPixelActivated] = useState<string[]>([]);
  const [pixelDataList, setPixelDataList] = useState<pixelData[]>([]);
  const [areaDataList, setAreaDataList] = useState<areaData[]>([]);

  const isPixelGetActivated = (path: string) => pixelActivated.includes(path);
  
  const activatePixelGet = (path: string) => setPixelActivated([...pixelActivated, path]);

  const deactivatePixelGet = (path: string) => setPixelActivated(pixelActivated.filter((p) => p !== path));

  const addPixelData = (id: string, path: string, data: number[], coord: {x: number, y: number}, rotation: number) => {
    const dbData = getPixelDataFromId(id)
    if (dbData) return
    setPixelDataList(prev => [...prev,
      {
        id: id, 
        path : path, 
        data : data, 
        coord: coord,
        pos: {x: null, y: null}, 
        rotation : rotation
      }]);
  }
  const addAreaData = (id: string, path: string, coords: {x1: number, y1: number, x2: number, y2: number}, data: {mean: number[], min: number[], max: number[]}) => {
    const dbData = getAreaDataFromId(id)
    if (dbData) return
    setAreaDataList(prev => [...prev,
      {
        id: id, 
        path : path, 
        coords : coords,
        data : data
      }]);
  }
  const getAreaDataFromId = (id: string) => areaDataList.find((p) => p.id === id)
  const removeAreaDataFromId = (id: string) => setAreaDataList(areaDataList.filter((p) => p.id !== id))

  const getAllPixelDataFromPath = (path: string) => {
    return pixelDataList.filter((p) => p.path === path);
  }

  const removePixelDataFromPath = (path: string) => {
    const new_data = pixelDataList.filter((p) => p.path !== path);
    setPixelDataList(new_data);
  }

  const getPixelDataFromId = (id: string) => pixelDataList.find((p) => p.id === id)

  const removePixelDataFromId = (id: string) => setPixelDataList(pixelDataList.filter((p) => p.id !== id))

  const updatePixelDataFromId = (id: string, data: number[], pos: {x: number | null, y: number | null}) => setPixelDataList(pixelDataList.map((p) => p.id === id ? {...p, data, pos} : p))

  const moveUpPixelDataFromId = (id: string) => {
    const data = getPixelDataFromId(id)
    if (data) {
      removePixelDataFromId(id)
      setPixelDataList(prev => [...prev, data])
    }
  }

  const value = {
    pixelDataList,
    isPixelGetActivated,
    activatePixelGet,
    deactivatePixelGet,
    addPixelData,
    getAllPixelDataFromPath,
    removePixelDataFromPath,
    getPixelDataFromId,
    removePixelDataFromId,
    updatePixelDataFromId,
    moveUpPixelDataFromId,
    areaDataList,
    addAreaData,
    getAreaDataFromId,
    removeAreaDataFromId
  }
  return (
    <ToolsBarContext.Provider value={value}>
      {children}
    </ToolsBarContext.Provider>
  )
}