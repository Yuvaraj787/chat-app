import React, { useState } from 'react'
import AutorenewIcon from '@mui/icons-material/Autorenew';
import axios from 'axios';
import "../styles/chat.css";
import ImageViewer from './imageViewer';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import fileDownload from 'js-file-download';
import DownloadIcon from '@mui/icons-material/Download';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {GoogleMap} from "@react-google-maps/api";
import {useLoadScript} from "@react-google-maps/api";
import Game from './game';
import { useNavigate } from 'react-router-dom';

function chatBox(props) {
  const [text, setText] = useState({original: props.message, translated : ""});
  const [on , setOn] = useState(true);
  const [showFullScreen, setFullScreen] = useState(false);
  const [showDwldBtn, setShowDwldBtn] = useState(false);
  const bingEndPoint = "https://api.cognitive.microsofttranslator.com/"
  const{isLoaded, loadError} = useLoadScript({
    // Uncomment the line below and add your API key
    // googleMapsApiKey: '<Your API Key>',
  });
  let navigate = useNavigate();
  if (loadError) return "Error loading Maps";
  if (!isLoaded) return "Loading Maps";
  const redirect = (lat,long) => {
    window.location.replace("https://maps.google.com/?q="+lat+","+long);
  }
  const translate = () => {
    if (text.translated == "") {
      axios({
        url:bingEndPoint+"/translate",
        method:"post",
        headers: {
          'Ocp-Apim-Subscription-Key': "dc95f3815f6949a2ae48b6ad8fced0ff",
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
        setText({original: text.original, translated: "NETWORK ERROR " + err.message})
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
  const startGame = () => {

  }
  return (
    <div className='ChatMsg'>
        <div className='oneChatDiv' style={{flexDirection:props.side ? "row-reverse" : "row"}}>        
            <div className='onechat' style={{borderRadius:props.side ? "0.8125rem 0 33px 13px" : "0 13px 13px 33px" }} >
             {
              props.type == "image" ? 
              <div className="img-box"
               style={{position: !showFullScreen && "relative" }} onContextMenu={handleDownload}>
                  <img onFocus={()=>setShowDwldBtn(false)} style={{height:"300px", width:"300px",outline:0,objectFit:"cover"}} onClick={getFullView} src={!props.message ? "https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif?20151024034921" : props.message} />
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
                  <button className='req-btns acc' onClick={props.startGame}><CheckIcon />Accept</button>
                  <button className='req-btns rej' onClick={props.reject}><CloseIcon />Reject</button>
                  </div> 
              }
                
                </div>
             </div> : props.type == "location" ? <div className='map-par' >
              <a target='_blank' href={"https://maps.google.com/?q="+parseFloat(props.message.split(' ')[0])+","+parseFloat(props.message.split(' ')[1])} className='g-map-btn'><ArrowOutwardIcon fontSize='small' />Open in Gmap</a>
             <GoogleMap 
              mapContainerStyle={{
                width: '400px',
                height: '300px'
              }} 
              zoom={15} 
              center={{
                lat: parseFloat(props.message.split(' ')[0]),
                lng: parseFloat(props.message.split(' ')[1]),
              }} 
              /></div> :
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