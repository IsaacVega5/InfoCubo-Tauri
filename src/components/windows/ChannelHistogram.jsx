import { Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'
import './ChannelHistogram.css'
import { IoCloseCircleOutline } from "react-icons/io5";

export default function ChannelHistogram({id, title = "Histogram", data, pos, destroy, onMouseUp, onMouseDown}) {

  let f_data = []
  for (let i = 0; i < data.length; i++) {
    f_data.push({ 
      band: i,
      value: data[i]
    })
  }
  
  return (
    <div className='ChannelHistogram'
      style={{
        top: pos.y, left: pos.x
      }}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      <div className="header" id={id}>
        <span>{title}</span>

        <button title='Cerrar' onClick={() => destroy(id)}><IoCloseCircleOutline/></button>
      </div>
      <LineChart 
        width={500} height={300} 
        data={f_data} 
        margin={{
          top: 5,
          right:20,
          left:0,
          bottom: 5,
        }}
      > 
        <YAxis/>
        <Tooltip className='Tooltip' label={"Band"}/>
        <XAxis dataKey="band" />
        <Line type="monotone" dataKey="value" stroke="#4ebf71" dot={false}/>
      </LineChart>
    </div>
  )
}
