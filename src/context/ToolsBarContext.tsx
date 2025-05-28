import { createContext, useState } from "react";

export interface multiDataData {
  mean: number[],
  min: number[],
  max: number[],
}

export interface dataListElement {
  type: 'pixel' | 'area',
  id: string,
  path: string,
  data: number[] | multiDataData,
  coords: {x: number, y: number} | {x1: number, y1: number, x2: number, y2: number},
  pos: {x: number | null, y: number | null},
  rotation: number
}

export const ToolsBarContext = createContext<{
  dataList: dataListElement[],
  isPixelGetActivated: (path: string) => boolean
  activatePixelGet: (path: string) => void
  deactivatePixelGet: (path: string) => void
  addData: (id:string, path: string, data: number[] | multiDataData, coords: {x: number, y: number} | {x1: number, y1: number, x2: number, y2: number}, rotation: number, type: 'pixel' | 'area') => void
  getAllDataFromPath: (path: string) => dataListElement[] | undefined
  removeDataFromPath: (path: string) => void
  getDataFromId: (id: string) => dataListElement | undefined
  removeDataFromId: (id: string) => void
  updateDataFromId: (id: string, newData : {data?: number[], pos?: {x: number | null, y: number | null}}) => void,
  moveUpDataFromId: (id: string) => void,
} | null>(null);


export function ToolsBarProvider({ children } : any) {
  const [pixelActivated, setPixelActivated] = useState<string[]>([]);
  const [dataList, setDataList] = useState<dataListElement[]>([]);

  const isPixelGetActivated = (path: string) => pixelActivated.includes(path);
  
  const activatePixelGet = (path: string) => setPixelActivated([...pixelActivated, path]);

  const deactivatePixelGet = (path: string) => setPixelActivated(pixelActivated.filter((p) => p !== path));

  const addData = (id: string, path: string, data: number[] | multiDataData, coords: {x: number, y: number} | {x1: number, y1: number, x2: number, y2: number}, rotation: number, type: 'pixel' | 'area') => {
    const dbData = getDataFromId(id)
    if (dbData) return
    setDataList(prev => [...prev, {
      type: type,
      id: id, 
      path : path, 
      data : type === 'pixel' ? data as number[] : data, 
      coords : coords,
      pos: {x: null, y: null}, 
      rotation : rotation
    }])
  }

  const getAllDataFromPath = (path: string) => {
    return dataList.filter((data) => data.path === path);
  }

  const removeDataFromPath = (path: string) => {
    const new_data = dataList.filter((data) => data.path !== path);
    setDataList(new_data);
  }

  const getDataFromId = (id: string) => dataList.find((data) => data.id === id)

  const removeDataFromId = (id: string) => setDataList(dataList.filter((data) => data.id !== id))

  const updateDataFromId = (id: string, newData : {data?: number[], pos?: {x: number | null, y: number | null}}) => {
    setDataList(dataList.map((p) => p.id === id ? {...p, ...newData} : p))
  } 

  const moveUpDataFromId = (id: string) => {
    const data = getDataFromId(id)
    if (data) {
      removeDataFromId(id)
      setDataList(prev => [...prev, data])
    }
  }

  const value = {
    dataList,
    isPixelGetActivated,
    activatePixelGet,
    deactivatePixelGet,
    addData,
    getAllDataFromPath,
    removeDataFromPath,
    getDataFromId,
    removeDataFromId,
    updateDataFromId,
    moveUpDataFromId,
  }
  return (
    <ToolsBarContext.Provider value={value}>
      {children}
    </ToolsBarContext.Provider>
  )
}