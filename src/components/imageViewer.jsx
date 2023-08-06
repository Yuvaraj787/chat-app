import React, { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';

import "../styles/imageViewer.css"


export default function ImageViewer(props) {
  const [full,setFull] = useState(false);
  const handleClose = () => {
    props.setFullScreen(false);
  }
  const EscKeyHandle = (e) => {
    console.log(e);
  }

  const handleSize = () => {
    setFull(!full);
  }
  
  return (
    <div className='image-div' style={{display: !props.show && "none",position:"absolute" }} autoFocus={true}>
       <div className='img-view-par' >
        <div className='control-box' onClick={handleClose} >
            <CloseIcon />
        </div>
        <img  src={props.src} className='img-view' /></div>
    </div>
  )
}
