import React from 'react'
import "../styles/LoadingPage.css"
import logo from "../../public/icons8-chat-96.png"
function LoadingPage(props) {
  return (
    <div className="load-page">
      <div className='load-main'>
        <div className='logo-img'>
           <div></div>
        </div>
        <div className='load-text'>
          <span className='load-status-desc'>
      {
        props.contactStatus ? 
        <>
        {!props.chatStatus && "Downloading your chats"}
        </> : 
        <>
        Fetching your contact list
        </>
      }
      </span>
      <span className='load-line' style={{width : (props.contactStatus && props.chatStatus) ? "120%" : (props.contactStatus ? "92%" : "23%") }}></span>
      </div>
      </div>
    </div>
  )
}

export default LoadingPage