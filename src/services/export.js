import { createDir } from "@tauri-apps/api/fs";
import { getIndices } from "./indices.js";

export async function exportIndices({indices, imagePath, outputPath, rotation, cutPoints=[null, null]}){
  if (indices.length == 0) return
  
  await createDir(outputPath, { recursive: true })

  let imageName = imagePath.split('\\').pop().split('.')[0]
  const indicesPath = await Promise.all(indices.map(async (indice) => {
    const res = await getIndices({indice: indice, 
      imagePath: imagePath, 
      outputPath: `${outputPath}\\${imageName}_${indice}.tif`, 
      rotation: rotation, 
      cutPoints: cutPoints})
    
    return res.path
  }))

  return {
    path: outputPath,
    indices: indicesPath
  }
}