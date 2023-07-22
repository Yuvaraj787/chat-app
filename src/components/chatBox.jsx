import React, { useState } from 'react'
import AutorenewIcon from '@mui/icons-material/Autorenew';
import axios from 'axios'
import "../styles/chat.css"
function chatBox(props) {
  const [text, setText] = useState({original: props.message, translated : ""});
  const [on , setOn] = useState(true);
  const bingEndPoint = "https://api.cognitive.microsofttranslator.com/"
  const translate = () => {
    if (text.translated == "") {
      axios({
        url:bingEndPoint+"/translate",
        method:"post",
        headers: {
          'Ocp-Apim-Subscription-Key': "5e65ad6a50d4424ea7a561c119768ec1",
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
  return (
    <div className='ChatMsg'>
        <div className='oneChatDiv' style={{flexDirection:props.side ? "row-reverse" : "row"}}>        
            <div className='onechat' style={{borderRadius:props.side ? "13px 0 33px 13px" : "0 13px 13px 33px" }} >
             {
              props.type == "image" ? 
              <img style={{height:"300px", width:"300px"}} src={props.message} />
             :
             <>
            {on ? text.original : text.translated}
            {(!on && text.translated == "") && <span className='trans-loading-text'>Translating...</span>}
            </>
             }
          </div>
          {props.side != "image" && <div className='trans-side' style={{flexDirection:props.side ? "row-reverse" : "row"}} >
            <span onClick={translate}><AutorenewIcon /></span>
           <span style={{fontStyle:"italic"}}>  {!on && "( Translated to tamil ) "} </span>
          </div>}
         
          
        </div>
   </div>
  )
}

export default chatBox;