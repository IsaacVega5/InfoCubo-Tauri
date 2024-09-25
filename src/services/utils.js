import { exists } from '@tauri-apps/api/fs'

export function getElementShape(id){
  const element = document.getElementById(id)
  const rect = element.getBoundingClientRect()
  return {x: rect.x, y: rect.y, width: rect.width, height: rect.height}
}

export async function checkHiperPath(path){
  if (path == null) return false
  if (path.length == 0) return false
  const image = path.replace('.hdr', '')
  
  if (!await exists(image) || !await exists(path)){
    return false
  }
  return true
}