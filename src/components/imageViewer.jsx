import React from 'react'
import "../styles/imageViewer.css"


export default function ImageViewer(props) {
  return (
    <div className='image-div' style={{display: !props.show && "none",position:"absolute" }}>
        <button onClick={()=>{props.setFullScreen(false)}}>Close</button>
       <img src={props.src} className='img-view'/>
    </div>
  )
}
