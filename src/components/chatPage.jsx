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
  const [imgLoad, setImgLoad] = useState(false);
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
    const formData = new FormData();
    formData.append("file",e.target.files[0]);
    formData.append("upload_preset","n4930qx2");
    setImgLoad(true);
    document.getElementById("send-btn")?.click();                                   
    axios.post("https://api.cloudinary.com/v1_1/dzcxy6zsg/image/upload",formData).then((res)=>{
      console.log("Response from cloundinary : ",res);
      setFile(res.data.secure_url);
      setImgLoad(false);
    }).catch((err)=>{
      console.log("Error in uploading images to cloudinary : ",err.message);
    })
    console.log(file);
  }
    
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
                <ChatBox message={chat.message} side={chat.sent} type={chat.type} imgLoad={imgLoad}/>
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
            }) : <span className='rec-load'>Loading suggestions for you</span>}
          </div>}        
        <div className='type-area'>
            <input type="file" id="img" style={{display:"none"}} onChange={handleImg} />
            <img width="45" height="45" src="https://img.icons8.com/external-others-inmotus-design/67/external-Tic-Tac-Toe-round-icons-others-inmotus-design-5.png" alt="external-Tic-Tac-Toe-round-icons-others-inmotus-design-5"/>
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