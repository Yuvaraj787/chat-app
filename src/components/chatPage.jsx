import React, {useState} from 'react'
import ChatBox from "./chatBox"
import { useEffect } from 'react';
import io  from 'socket.io-client';
import { Cookies } from 'react-cookie';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import axios from 'axios';
function ChatPage(props) {
  const cookie = new Cookies()
  useEffect(()=>console.log(props),[])
  // const [props.AllChats, setChats] = useState([]);
  const [fetched, setFetched] = useState(true);
   
  
 
  const sendMessage = (e) => {
    e.preventDefault();
    const mValue = document.querySelector("#msg").value;
    if (mValue == '') return;
    localStorage.setItem(props.details.userid+"",JSON.stringify([...props.curChats,{message:mValue,sent:true}]))
    props.setChats([...props.curChats,{message:mValue,sent:true}])
    console.log("Message sent request : ",props)
    props.reqSocket.emit("send_message",{message : mValue, room : props.details.roomid, senderToken: cookie.get("token")})
    document.querySelector("#msg").value = ""
    console.log(document.querySelector("#img").value)
  }
  
  useEffect(()=>{
    setSuggestions([]);
    const msgArea = document.querySelector(".mid-area");
    msgArea.scrollTop = msgArea.scrollHeight;
    if (props.curChats.length == 0) return;
    if (props.curChats.sent) return;
    axios({
      url:"https://api.openai.com/v1/chat/completions",
      method:"POST",
      headers:{
        Authorization:"Bearer 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",
        ContentType:"application/json"
      },
      data:{
        model: "gpt-3.5-turbo",
        messages: [{
          "role": "system", 
          "content": "Give me a just js array without variable name (i.e you should start from [ and end with ] also do not include new line escape sequence like \n )  that contains 3 short replies for" + props.curChats[props.curChats.length - 1].message + "(I need Just a friendly reply)"}],
        temperature: 0.7
      }
    }).then((res)=>{
       setSuggestions(JSON.parse(res.data.choices[0].message.content))
    }).catch((err)=>{
      console.log("Error in gpt api ",err)
    })
  },[props.curChats])

  const [suggestions, setSuggestions] = useState([])
  const handleImg = (e) => {
    console.log("Image details")
    console.log(e.target.files[0])
  }
    
  return (
    <div className='chat-page'>
        <div className='chat-head'>
          <span className='c-head'><span className='bold'>To : </span>{props.details.name}</span>
        </div> 
        <div className='mid-area'>
          {props.curChats.map(chat=>{
            return (
            <div style={{display:"flex",justifyContent:chat.sent ? "flex-end" : "flex-start"}}> 
                <ChatBox message={chat.message} side={chat.sent}/>
            </div>
            )
          })}
        </div>
        <form onSubmit={sendMessage}>
        <div>
        {(props.curChats.length != 0 && !props.curChats[props.curChats.length - 1].sent) && <div style={{height:"80px"}} className='msg-rec'>
            <div className='rec-head'>Message suggestions : </div>
            {suggestions.length != 0 ? suggestions.map(msg=>{
              return (
                <div className='one-rec' onClick={()=>{
                  document.getElementById("msg").value = msg;
                  document.getElementById("send-btn").click();                  }}>
                  {msg}
                </div>
              )
            }) : "Loading recommendations for you!"}
          </div>}        
        <div className='type-area'>
            <input type="file" id="img" style={{display:"none"}} onChange={handleImg} />
            <AddPhotoAlternateIcon fontSize='large' onClick={() => document.getElementById("img").click()}/>
            <input type='text' className='chat-space' id="msg" placeholder="Message"/>
            <button className='send-btn' type='submit' id="send-btn" onClick={sendMessage}>Send</button>
        </div>
        </div>
        </form>
    </div>
  )
}

export default ChatPage