interface SelectedAreaProps {
  position: {x1: number | null, y1: number | null, x2: number | null, y2: number | null}
}

export default function SelectedArea({position} : SelectedAreaProps) {
  const size = () => {
    if (!position.x1 || !position.y1 || !position.x2 || !position.y2) return {width: 0, height: 0}
    const width = position.x2 > position.x1 ? position.x2 - position.x1 : position.x1 - position.x2
    const height = position.y2 > position.y1 ? position.y2 - position.y1 : position.y1 - position.y2

    return {width, height}
  }

  return position.x1 && position.y1 && position.x2 && position.y2 && (
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