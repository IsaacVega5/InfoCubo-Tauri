import { useContext, useEffect, useState } from "react"
import { ToolsContext } from "../context/tools.jsx"
import { HiperImgContext } from "../context/hiperImg.jsx"
import { FaRegDotCircle } from "react-icons/fa";

export default function CutPoints() {
  const {hiperImgValues} = useContext(HiperImgContext)
  const {toolsValues, setToolsValues} = useContext(ToolsContext)
  const [resizeFactor, setResizeFactor] = useState(0)
  const [margin, setMargin] = useState({
    left: 0,
    top : 0
  })
  const [mousePos, setMousePos] = useState({top: 0, left: 0})

  const cutBoxCalc = () => {

    const pointCoords = [
      {
        x: toolsValues.cutPoints[0].x * resizeFactor + margin.left, 
        y: toolsValues.cutPoints[0].y * resizeFactor + margin.top
      },
      {
        x: toolsValues.cutPoints[1] ? toolsValues.cutPoints[1].x * resizeFactor + margin.left : mousePos.left, 
        y: toolsValues.cutPoints[1] ? toolsValues.cutPoints[1].y * resizeFactor + margin.top : mousePos.top
      }
    ]

    const x = Math.min(...pointCoords.map(coord => coord.x))
    const y = Math.min(...pointCoords.map(coord => coord.y))
    const width = Math.abs(pointCoords[0].x - pointCoords[1].x) 
    const height = Math.abs(pointCoords[0].y - pointCoords[1].y)

    return {x, y, width, height}
  }

  const setPositionValues = () => {
    if (!toolsValues.cutCheck) return
    const canvas = document.getElementById("img_canvas");
    const imgCont = document.getElementById("img_cont");
    const rect = canvas.getBoundingClientRect();
    setResizeFactor(rect.height / hiperImgValues.shape[0])
    
    setMargin({
      left:  (imgCont.offsetWidth - rect.width) / 2,
      top: (imgCont.offsetHeight - rect.height) / 2
    })
  }

  useEffect(() => {
    setPositionValues()
    window.addEventListener('resize', setPositionValues);
    return () => {
      window.removeEventListener('resize', setPositionValues);
    };
  },[toolsValues.cutPoints])
  useEffect(() => {
    setToolsValues({...toolsValues, cutPoints: [null, null]})
    
    //* Añade un listener al mouse
    const imgCont = document.getElementById("img_cont");
    if (toolsValues.cutCheck) {
      const onMouseMove = (e) => {
        const rect = imgCont.getBoundingClientRect();
        setMousePos({top: e.clientY - rect.top, left: e.clientX - rect.left})
      }
      imgCont.addEventListener("mousemove", onMouseMove);
      return () => {
        imgCont.removeEventListener("mousemove", onMouseMove);
      }
    }

  }, [toolsValues.cutCheck])

  return (
    <>
      { (toolsValues.cutPoints[0] && toolsValues.cutCheck) && (
        <div className="cut-line" style={{
          position: "absolute",
          top: cutBoxCalc().y, 
          left: cutBoxCalc().x,
          width: cutBoxCalc().width,
          height: cutBoxCalc().height,
          opacity: 0.5,
          border: toolsValues.cutPoints[1] ? "1px solid #fcc419" : "1px dashed #fcc419",
          pointerEvents: "none",
        }} ></div>
      )}

      { (toolsValues.cutCheck) && (
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          top: toolsValues.cutPoints[0] ? toolsValues.cutPoints[0].y * resizeFactor + margin.top : mousePos.top,
          left: toolsValues.cutPoints[0] ? toolsValues.cutPoints[0].x * resizeFactor + margin.left : mousePos.left,
          transform: "translate(-50%, -50%)",
          userSelect: "none",
          color: "#fcc419",
          pointerEvents: "none",
        }}>
          <FaRegDotCircle />
        </div>
      )}

      { (toolsValues.cutPoints[0] && toolsValues.cutCheck) && (
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          top: toolsValues.cutPoints[1] ? toolsValues.cutPoints[1].y * resizeFactor + margin.top : mousePos.top,
          left: toolsValues.cutPoints[1] ? toolsValues.cutPoints[1].x * resizeFactor + margin.left : mousePos.left,
          transform: "translate(-50%, -50%)",
          userSelect: "none",
          color: "#fcc419",
          pointerEvents: "none",
        }}>
          <FaRegDotCircle />
        </div>
      )}
    </>
  )
}
