import React, {useState} from 'react'
import ChatBox from "./chatBox"
import { useEffect } from 'react';
import { Cookies } from 'react-cookie';
import SendIcon from '@mui/icons-material/Send';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import axios from 'axios';
function ChatPage(props) {
  const cookie = new Cookies()
  const [file, setFile] = useState("");
  // const [props.AllChats, setChats] = useState([]);
  const sendMessage = (e) => {
    e.preventDefault();
    const mValue = document.querySelector("#msg").value;
    if (mValue == '' && file == "") return;    
    localStorage.setItem(props.details.userid+"",JSON.stringify([...props.curChats,{message : file ? file : mValue,sent:true,type: file ? "image" : "text"}]))
    props.setChats([...props.curChats,{message:file ? file : mValue,sent:true, type: file ? "image" : "text"}])
    console.log("Message sent request : ",props)
    props.reqSocket.emit("send_message",{message : file ? file : mValue, type: file ? "image" : "text", room : props.details.roomid, senderToken: cookie.get("token")})
    setFile("");
    document.querySelector("#msg").value = ""
  }
  
  useEffect(()=>{
    if (props.details.name == "") return;
    setSuggestions([]);
    const msgArea = document.querySelector(".mid-area");
    msgArea.scrollTop = msgArea.scrollHeight;
    if (props.curChats.length == 0) return;
    if (props.curChats[props.curChats.length - 1].sent) return;
    console.log("Fetching started from chatgpt api");
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
          "content": "Give me a just js array without variable name (i.e you should start from [ and end with ] also do not include new line escape sequence like \n )  that contains 3 short replies for" + props.curChats[props.curChats.length - 1].message + "(I need Just a friendly reply. I need chatting type of english )"}],
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
    setFile(URL.createObjectURL(e.target.files[0]));
    console.log(file);
  }
  useEffect(()=>{
    document.getElementById("send-btn").click();                                   
  },[file])
    
  return (
    <div className='chat-page'>
      {props.details.name == "" ? 
        <span style={{margin:"auto", fontSize:"1.7rem"}}>Please select a name to start chat</span>      
       : 
      <>
        <div className='chat-head'>
          <span className='c-head bold'>{props.details.name}</span>
        </div> 
        <div className='mid-area'>
          {props.curChats.map(chat=>{
            return (
            <div className='par-msg-box' style={{display:"flex",justifyContent:chat.sent ? "flex-end" : "flex-start"}}> 
                <ChatBox message={chat.message} side={chat.sent} type={chat.type}/>
            </div>
            )
          })}
        </div>
        <form onSubmit={sendMessage}>
        <div>
        {(props.curChats.length != 0 && !props.curChats[props.curChats.length - 1].sent) && <div style={{height:"80px"}} className='msg-rec'>
            <div className='rec-head'>    </div>
            {suggestions.length != 0 ? suggestions.map(msg=>{
              return (
                <div className='one-rec' onClick={()=>{
                  document.getElementById("msg").value = msg;
                  document.getElementById("send-btn").click();                  
                }}>
                  {msg}
                </div>
              )
            }) : "Loading recommendations for you!"}
          </div>}        
        <div className='type-area'>
            <input type="file" id="img" style={{display:"none"}} onChange={handleImg} />
            <AddPhotoAlternateIcon fontSize='large' onClick={() => document.getElementById("img").click()}/>
            <input type='text' className='chat-space' id="msg" placeholder="Message"/>
            <button className='send-btn' type='submit' id="send-btn" onClick={sendMessage}><SendIcon /> </button>
        </div>
        </div>
        </form>
        </>}
    </div>
  )
}

export default ChatPage