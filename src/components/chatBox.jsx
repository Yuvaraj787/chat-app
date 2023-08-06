import React, { useState } from 'react'
import AutorenewIcon from '@mui/icons-material/Autorenew';
import axios from 'axios'
import "../styles/chat.css"
import ImageViewer from './imageViewer';
import fileDownload from 'js-file-download';
import DownloadIcon from '@mui/icons-material/Download';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

function chatBox(props) {
  const [text, setText] = useState({original: props.message, translated : ""});
  const [on , setOn] = useState(true);
  const [showFullScreen, setFullScreen] = useState(false);
  const [showDwldBtn, setShowDwldBtn] = useState(false);
  const bingEndPoint = "https://api.cognitive.microsofttranslator.com/"
  const translate = () => {
    if (text.translated == "") {
      axios({
        url:bingEndPoint+"/translate",
        method:"post",
        headers: {
          'Ocp-Apim-Subscription-Key': "69f3e3e6d6c14d648af0db92c52ecf44",
           // location required if you're using a multi-service or regional (not global) resource.
          'Ocp-Apim-Subscription-Region': "global",
          'Content-type': 'application/json'
        },
        params: {
          'api-version': '3.0',
          'from': 'en',
          'to': ['ta']
        },
        data: [{
          'text': text.original
        }],
      responseType: 'json'
      }).then(res=>{
        setText({original: text.original, translated: res.data[0].translations[0].text})
      }).catch(err=>{
        console.log("Error in translating text reason : ",err)
      })
      setOn(!on)
    } else {
      setOn(!on)
    }
  }

  const handleDownload = (e) => {
    e.preventDefault();
    setShowDwldBtn(!showDwldBtn);
  }

  const download = () => {
     axios.get(props.message, {
      responseType:"blob"
     }).then((res)=>{
        fileDownload(res.data,"imageDownloadedInChatApp.jpg")
        setShowDwldBtn(false);
     })
  }

  const getFullView = () => {
    if (showDwldBtn) {
      setShowDwldBtn(false);
      return;
    }
    setFullScreen(true);
  }

  return (
    <div className='ChatMsg'>
        <div className='oneChatDiv' style={{flexDirection:props.side ? "row-reverse" : "row"}}>        
            <div className='onechat' style={{borderRadius:props.side ? "0.8125rem 0 33px 13px" : "0 13px 13px 33px" }} >
             {
              props.type == "image" ? 
              <div className="img-box"
               style={{position: !showFullScreen && "relative" }} onContextMenu={handleDownload}>
                  <img onFocus={()=>setShowDwldBtn(false)} style={{height:"300px", width:"300px",outline:0,objectFit:"cover"}} onClick={getFullView} src={props.imgLoad ? "https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif?20151024034921" : props.message} />
                  <ImageViewer src={props.message} show={showFullScreen} setFullScreen={setFullScreen}/>
                  {showDwldBtn && <button className='download-btn'  onClick={download}>
                    <DownloadIcon />Download  
                  </button>}
              </div>
             : props.type == "game-request" ? 
             <div className='game-req-div'>
              <div className='req-head'>
                  <div className='req-title'>
                    Game Request
                  </div>
              </div>
              <div className='req-child'>
                <span className='game-req-text'>
                  {props.side  ? "Tic Tac Toe game request has been sent to your friend" : "Your friend wants to play tic tac toe with you"}         
                  </span>
              </div>
              <div className='req-child req-bottom'>
                {props.side ? 
                 <>
                  <span>
                  <QueryBuilderIcon />
                  </span>
                  <span>
                    You will be able to play once your friend accepts the request
                  </span>
                </> : <div className='opp-side-req'>
                  <button className='req-btns acc'><CheckIcon />Accept</button>
                  <button className='req-btns rej'><CloseIcon />Reject</button>
                  </div> 
              }
                
                </div>
             </div> :
             <>
            {on ? text.original : text.translated}
            {(!on && text.translated == "") && <span className='trans-loading-text'>Translating...</span>}
            </>
             }
          </div>
          {props.type != "image" && <div className='trans-side' style={{flexDirection:props.side ? "row-reverse" : "row"}} >
            <span onClick={translate}><AutorenewIcon /></span>
           <span style={{fontStyle:"italic"}}>  {(!on && text.translated!="") && "( Translated to tamil ) "} </span>
          </div>}
         
          
        </div>
   </div>
  )
}

export default chatBox;