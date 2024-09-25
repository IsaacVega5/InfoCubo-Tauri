import './HistogramGroup.css'

import ChannelHistogram from './ChannelHistogram.jsx'
import { useContext, useEffect, useState } from 'react'
import { HiperImgContext } from '../../context/hiperImg.jsx'

function HistogramGroup({histograms, setHistograms}) {
	const {hiperImgValues, setHiperImgValues} = useContext(HiperImgContext)
  const [dragging, setDragging] = useState("")
  const[mouseDistance, setMouseDistance] = useState(({x: 0, y: 0}))
  
  const deleteHistogram = (id) => {
    setHistograms(histograms.filter((histogram) => histogram.id !== id))
  }

  const handleMouseMove = (e) => {
    if (dragging == "") return
    
    let ImageViewer = document.getElementById('ImageViewer')
    let rect = ImageViewer.getBoundingClientRect();
    let relX = e.clientX - rect.left;
    let relY = e.clientY - rect.top;

    const pos = {
      x: relX - mouseDistance.x,
      y: relY - mouseDistance.y
    }

    setHistograms(histograms.map((histogram) => {
      if (histogram.id != dragging) return histogram
      return {
        ...histogram,
        pos: {
          x: pos.x < 0 ? 0 : pos.x,
          y: pos.y < 0 ? 0 : pos.y
        }
      }
    }))
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [dragging])

  const handleMouseDown = (e) => {
    let id = e.target.id
    if (!id) return
    e.target.style.cursor = 'move'

    const header_rect = e.target.getBoundingClientRect();
    const x = e.clientX - header_rect.left;
    const y = e.clientY - header_rect.top;

    setDragging(id)
    setMouseDistance({x: x, y: y})
  }
  const handleMouseUp = (e) => {
    e.target.style.cursor = 'default'
    setDragging(false)
  }
  
  const group = histograms.map((histogram) => {
    
    let x = histogram.imgCoords[0]
    let y = histogram.imgCoords[1]
    
    let title = `Histograma | x: ${x} y: ${y}`

    return (
      <ChannelHistogram 
        key={histogram.id}
        id={histogram.id}
        title={title}
        data={histogram.value}
        pos={histogram.pos}
        destroy = {deleteHistogram}
        onMouseDown={handleMouseDown}
        onMouseUp = {handleMouseUp}
      />
    )
  })

  

  return (
    <>
      {group}
    </>
  )
}

export default HistogramGroup