export function getElementShape(id){
  const element = document.getElementById(id)
  const rect = element.getBoundingClientRect()
  return {x: rect.x, y: rect.y, width: rect.width, height: rect.height}
}