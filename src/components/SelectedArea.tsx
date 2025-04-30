export default function SelectedArea({position} : {position: {x1: number, y1: number, x2: number, y2: number}}) {
  const size = () => {
    const width = position.x2 > position.x1 ? position.x2 - position.x1 : position.x1 - position.x2
    const height = position.y2 > position.y1 ? position.y2 - position.y1 : position.y1 - position.y2

    return {width, height}
  }

  return (
    <div 
      className="absolute border-primary border-1 bg-primary/30 select-none pointer-events-none" 
      style = {{
        top: position.y1 < position.y2 ? position.y1 : position.y2,
        left: position.x1 < position.x2 ? position.x1 : position.x2,
        width: size().width,
        height: size().height
      }}
    />
  )
}