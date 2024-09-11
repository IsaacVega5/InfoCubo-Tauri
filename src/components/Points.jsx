import { useContext, useEffect, useState } from "react"
import { HiperImgContext } from "../context/hiperImg.jsx";
import { MdOutlineMyLocation } from "react-icons/md";

export default function Points({histograms}) {
  const [points, setPoints] = useState([])
  const {hiperImgValues} = useContext(HiperImgContext)
  
  const drawPoints = () => {
    const canvas = document.getElementById("img_canvas");
    const imgCont = document.getElementById("img_cont");
    const rect = canvas.getBoundingClientRect();
    const resize_factor = rect.height / hiperImgValues.shape[0];
    const leftMargin = (imgCont.offsetWidth - rect.width) / 2;
    const topMargin = (imgCont.offsetHeight - rect.height) / 2;

    const newPoints = histograms.map((histogram) => {
      const x = histogram.coords[0];
      const y = histogram.coords[1];

      return (
        <div 
          style={{
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            key: `K-dot-${histogram.id}`,
            id: `dot-${histogram.id}`,
            left: x * resize_factor + leftMargin,
            top: y * resize_factor + topMargin,
            color: '#4ebf71',
            transform: 'translate(-50%, calc(-50%))',
            userSelect: 'none',
          }}
          title={`x: ${histogram.imgCoords[0]}\ny: ${histogram.imgCoords[1]}`} 
        >
          <span style={{height:'25px', position: 'absolute', top: '-25px', width: 'max-content'}}>
            {histogram.imgCoords[0]},
            {histogram.imgCoords[1]}
          </span>
          <MdOutlineMyLocation />
        </div>
      );
    });

    setPoints(newPoints);
  };
  
  
  useEffect(() => {  
    drawPoints();
    window.addEventListener('resize', drawPoints);
    return () => {
      window.removeEventListener('resize', drawPoints);
    };
  }, [histograms, hiperImgValues.shape]);

  return (
    <>
      {points}
    </>
  )
}
