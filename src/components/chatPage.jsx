const dotenv = require('dotenv');
import React, { useState } from 'react'
import ChatBox from "./chatBox"
import { useEffect } from 'react';
import { Cookies } from 'react-cookie';
import SendIcon from '@mui/icons-material/Send';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import axios from 'axios';
import profileImg from "../assets/profile.png";
import ImageViewer from './imageViewer';
import Game from './game';
function ChatPage(props) {
  const cookie = new Cookies();
  const env = dotenv.config().parsed;
  const [file, setFile] = useState("");
  const [imgLoad, setImgLoad] = useState(false);
  // const [props.AllChats, setChats] = useState([]);
  const sendMessage = (e) => {
    e.preventDefault();
    const mValue = document.querySelector("#msg").value;
    if (mValue == '' && file == "") return;
    localStorage.setItem(props.details.userid + "", JSON.stringify([...props.curChats, { message: file ? file : mValue, sent: true, type: file ? "image" : "text" }]))
    props.setChats([...props.curChats, { message: file ? file : mValue, sent: true, type: file ? "image" : "text" }])
    console.log("Message sent request : ", props)
    props.reqSocket.emit("send_message", { message: file ? file : mValue, type: file ? "image" : "text", room: props.details.roomid, senderToken: cookie.get("token") })
    setFile("");
    document.querySelector("#msg").value = ""
  }
  const [thisChats, setThisChats] = useState(props.curChats);

  useEffect(() => {
    if (props.details.name == "") return;
    setThisChats(props.curChats);
    console.log("logged in this page",[...props.curChats])
    setSuggestions([]);
    if (props.curChats.length == 0) return;
    if (props.curChats[props.curChats.length - 1].sent) return;
    console.log("Fetching started from chatgpt api");
    axios({
      url: "https://api.openai.com/v1/chat/completions",
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CHAT_GPT_KEY}`,
        ContentType: "application/json"
      },
      data: {
        model: "gpt-3.5-turbo",
        messages: [{
          "role": "system",
          "content": "Give me a just js array without variable name (i.e you should start from [ and end with ] also do not include new line escape sequence like \n )  that contains 3 short replies for" + props.curChats[props.curChats.length - 1].message + "(I need Just a friendly reply. I need chatting type of english. include tanglish sometimes  )"
        }],
        temperature: 0.7
      }
    }).then((res) => {
      setSuggestions(JSON.parse(res.data.choices[0].message.content))
    }).catch((err) => {
      console.log("Error in gpt api ", err)
    })
  }, [props.curChats])
  useEffect(()=>{
    if (props.details.name == "") return;
    const msgArea = document.querySelector(".mid-area");
    msgArea.scrollTop = msgArea.scrollHeight
  },[thisChats])

  const [suggestions, setSuggestions] = useState([])
  const handleImg = (e) => {
    console.log("Image details")
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("upload_preset", "n4930qx2");
    setImgLoad(true);
    document.getElementById("send-btn")?.click();
    axios.post("https://api.cloudinary.com/v1_1/dzcxy6zsg/image/upload", formData).then((res) => {
      console.log("Response from cloundinary : ", res);
      setFile(res.data.secure_url);
      setImgLoad(false);
    }).catch((err) => {
      console.log("Error in uploading images to cloudinary : ", err.message);
    })
    console.log(file);
  }

  const [show, setShow] = useState(false);

  const giveGameRequest = () => {
    setValues([
      ['.','.','.'],
      ['.','.','.'],
      ['.','.','.']
    ])
    localStorage.setItem("uservalue","X");
    localStorage.setItem(props.details.userid + "", JSON.stringify([...props.curChats, { message: "Game request sent" , sent: true, type: "game-request" }]))
    props.setChats([...props.curChats, {message: "Game request sent" , sent: true, type: "game-request"}])
    console.log("Message sent request : ", props)
    props.reqSocket.emit("send_message", {message: "Game request sent" ,  type: "game-request", room: props.details.roomid, senderToken: cookie.get("token") })
    document.querySelector("#msg").value = ""
  }
  const [isGameOn, setGameOn] = useState(false);

  const [gameValues, setValues] = useState([
    ['.','.','.'],
    ['.','.','.'],
    ['.','.','.']
  ]);

  const startGame = () => {
    localStorage.setItem("uservalue","O");
    setValues([
      ['.','.','.'],
      ['.','.','.'],
      ['.','.','.']
    ])
    localStorage.setItem(props.details.userid + "", JSON.stringify([...props.curChats, { message: "Request sent" , sent: true, type: "game-req-accept" }]))
    props.setChats([...props.curChats, {message: "Request accepted" , sent: true, type: "game-req-accept"}])
    console.log("Accepted : ", props)
    props.reqSocket.emit("send_message", {message: "Request Accepted" ,  type: "game-req-accept", room: props.details.roomid, senderToken: cookie.get("token") })
    document.querySelector("#msg").value = ""
    setGameOn(true);
  }
  const makeMove = (gvalues) => {
    props.reqSocket.emit("send_message", { message: "game move", type: "req-game-values", values: gvalues, room: props.details.roomid, senderToken: cookie.get("token") })
  }
  
  useEffect(()=>{
    if (thisChats.length > 1 && thisChats[thisChats.length - 1].type == "game-req-accept") {
      setGameOn(true);
    }
    if (thisChats.length > 1 && thisChats[thisChats.length - 1].type == "req-game-values") {
      setValues(thisChats[thisChats.length - 1].values);
    }
  },[thisChats])

  return (
    <div className='chat-page'>
      <div style={{position:"absolute",left:0,top:0,display:!isGameOn && "none"}}><Game setGameOn={setGameOn} setValues={setValues} makeMove={makeMove} values={gameValues} roomid={props.details.roomid} sock={props.reqSocket}/></div>
      {props.details.name == "" ?
        <span style={{ margin: "auto", fontSize: "1.7rem" }}>Please select a name to start chat</span>
        :
        <>
          <div className='chat-head'>
            <div style={{display:"flex",alignItems:"center",}}>
              <span><img onClick={()=>{setShow(true)}} style={{cursor:"pointer",height:"40px",width:"40px",borderRadius:"50%",objectFit:"cover"}} src={props.details.dp == null ? profileImg : props.details.dp} /></span>
              <span className='c-head bold'><a style={{color:"black"}} href={"/profile/" + props.details.userid}>{props.details.name}</a></span>
              {show && <ImageViewer src={props.details.dp == null ? profileImg : props.details.dp} show={show} setFullScreen={setShow} /> }
            </div>
          </div>
          <div className='mid-area' id="chat-space">
            {thisChats.map(chat => {
              return (
                <div className='par-msg-box' style={{ display: "flex", justifyContent: chat.sent ? "flex-end" : "flex-start" }}>
                  <ChatBox message={chat.message} side={chat.sent} type={chat.type} imgLoad={imgLoad} setGameOn={setGameOn} isGameOn={setGameOn} startGame={startGame} />
                </div>
              )
            })}
          </div>
            <div>

              {(props.curChats.length != 0 && !props.curChats[props.curChats.length - 1].sent) && <div style={{ height: "80px" }} className='msg-rec'>
                <div className='rec-head'>    </div>
                {suggestions.length != 0 ? suggestions.map(msg => {
                  return (
                    <div className='one-rec' style={{color:"black"}} onClick={() => {
                      document.getElementById("msg").value = msg;
                      document.getElementById("send-btn").click();
                    }}>
                      {msg}
                    </div>
                  )
                }) : <span className='rec-load'>Loading suggestions for you</span>}
              </div>}
              <div className='type-area'>
                <input onKeyDown={(e)=>{
                   if (e.key == "Enter") document.getElementById("msg").click();
                }} type="file" id="img" style={{ display: "none" }} onChange={handleImg} />
                <img width="45" height="45" src="https://img.icons8.com/external-others-inmotus-design/67/external-Tic-Tac-Toe-round-icons-others-inmotus-design-5.png" alt="external-Tic-Tac-Toe-round-icons-others-inmotus-design-5" onClick={giveGameRequest} />
                <AddPhotoAlternateIcon sx={{ color: "black" }} fontSize='large' onClick={() => document.getElementById("img").click()} />
                <input onKeyDown={(e)=>{
                   if (e.key == "Enter") document.getElementById("send-btn").click();
                }} type='text' className='chat-space' id="msg" placeholder="Message" />
                <button className='send-btn' type='submit' id="send-btn" onClick={sendMessage}><SendIcon /> </button>
              </div>
            </div>
        </>}




    </div>
  )
}

export default ChatPage