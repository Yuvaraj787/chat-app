import React from 'react'

function LoadingPage(props) {
  return (
    <div>
      {
        props.contactStatus ? 
        <>
        {!props.chatStatus && "Downloading your chats"}
        </> : 
        <>
        Fetching your contact list...
        </>
      }
    </div>
  )
}

export default LoadingPage