// import 'dotenv/config'
import React, { useState } from 'react'
import ChatBox from "./chatBox"
import { useEffect } from 'react';
import { Cookies } from 'react-cookie';
import SendIcon from '@mui/icons-material/Send';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import axios from 'axios';
import ShareLocationIcon from '@mui/icons-material/ShareLocation';
import toast from 'react-hot-toast';
import { ApiUrl } from './comVars'
import profileImg from "../assets/profile.png";
import ImageViewer from './imageViewer';
import Game from './game';
function ChatPage(props) {
  const cookie = new Cookies();  
  const [imgLoad, setImgLoad] = useState(false);
  const sendMessage = (e) => {
    try {
      e.preventDefault();
      
    } catch(e) {
      console.log(e.message);
    }
    const mValue = document.querySelector("#msg").value;
    if (mValue == '') return;
    localStorage.setItem(props.details.userid + "", JSON.stringify([...props.curChats, { message: mValue, sent: true, type: "text" }]))
    props.setChats([...props.curChats, { message:  mValue, sent: true, type: "text" }])
    props.reqSocket.emit("send_message", { message: mValue, type: "text", room: props.details.roomid, senderToken: cookie.get("token") })
    document.querySelector("#msg").value = ""
  }
  const sendImg = (url) => {
      const mValue = document.querySelector("#msg").value;
      localStorage.setItem(props.details.userid + "", JSON.stringify([...props.curChats, { message: url , sent: true, type: "image" }]))
      props.setChats([...props.curChats, { message: url, sent: true, type: "image" }])
      props.reqSocket.emit("send_message", { message: url, type: "image", room: props.details.roomid, senderToken: cookie.get("token") })
      document.querySelector("#msg").value = ""
    }
  
  const [thisChats, setThisChats] = useState(props.curChats);

  useEffect(() => {
    if (props.details.name == "") return;
    setThisChats(props.curChats);
    setSuggestions([]);
    if (props.curChats.length == 0) return;
    if (props.curChats[props.curChats.length - 1].sent) return;
    axios({
      url: ApiUrl + "/suggest",
      method: "GET",
      params: {
        msg: props.curChats[props.curChats.length - 1].message,
      }
    }).then((res) => {
      if (res.data.error) {
        console.log("Error ", res.data.error);
        return;
      } 
      console.log(res.data.array);
      setSuggestions([...res.data.array]);
    }).catch((err) => {
      console.log("Error in gpt api ", err)
    })
  }, [props.curChats])
  useEffect(()=>{
    if (props.details.name == "") return;
    const msgArea = document.querySelector(".mid-area");
    msgArea.scrollTop = msgArea.scrollHeight
  },[thisChats])

  const [suggestions, setSuggestions] = useState([]);

  const handleImg = (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("upload_preset", "n4930qx2");
    let id = toast.loading("Uploading image");
    setImgLoad(true);
    axios.post("https://api.cloudinary.com/v1_1/dzcxy6zsg/image/upload", formData).then((res) => {
      console.log("Response from cloundinary : ", res);
      toast.success("Image uploaded successfully.",{ id });
      sendImg(res.data.secure_url);
      setImgLoad(false);
    }).catch((err) => {
      toast.error("Error in uploading image. Reason : " + err.message,{ id });
      console.log("Error in uploading images to cloudinary : ", err.message);
    })
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
    props.setChats([...props.curChats, {message: "can we play a tic tac toe game ?" , sent: true, type: "game-request"}])
    props.reqSocket.emit("send_message", {message: "can we play a tic tac toe game ?" ,  type: "game-request", room: props.details.roomid, senderToken: cookie.get("token") })
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
    props.reqSocket.emit("send_message", {message: "Request Accepted" ,  type: "game-req-accept", room: props.details.roomid, senderToken: cookie.get("token") })
    document.querySelector("#msg").value = ""
    setGameOn(true);
  }
  const reject = () => {
    props.setChats([...props.curChats, {message: "Request rejected" , sent: true, type: "game-req-reject"}])
    props.reqSocket.emit("send_message", {message: "Request rejected" ,  type: "game-req-reject", room: props.details.roomid, senderToken: cookie.get("token") })
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

  const handleTyping = () => {
    props.reqSocket.emit("send_message", { message: null, type: "typing", room: props.details.roomid, senderToken: cookie.get("token") })
  }
  const sendLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        localStorage.setItem(props.details.userid + "", JSON.stringify([...props.curChats, { message: position.coords.latitude+" "+position.coords.longitude, sent: true, type: "location" }]))
        props.setChats([...props.curChats, { message:  position.coords.latitude+" "+position.coords.longitude, sent: true, type: "location" }])
        props.reqSocket.emit("send_message", { message: position.coords.latitude+" "+position.coords.longitude, type: "location", room: props.details.roomid, senderToken: cookie.get("token") })
      },
      (error) => {
        console.log(error);
      }
  );
  }
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
              if (chat.type == "req-game-values") {
                return;
              }
              return (
                <div className='par-msg-box' style={{ display: "flex", justifyContent: chat.sent ? "flex-end" : "flex-start" }}>
                  <ChatBox message={chat.message} side={chat.sent} type={chat.type} imgLoad={imgLoad} setGameOn={setGameOn} isGameOn={setGameOn} reject={reject} startGame={startGame} />
                </div>
              )
            })}
          </div>
            <div>

              {(props.curChats.length != 0 && !props.curChats[props.curChats.length - 1].sent) && 
              <div style={{ height: "80px" }} className='msg-rec'>
                <div className='rec-head'>    </div>
                {suggestions.length !=0 ? suggestions.map(msg => {
                  return (
                    <div className='one-rec' style={{color:"black"}} onClick={() => {
                      document.getElementById("msg").value = msg;
                      document.getElementById("send-btn").click();
                    }}>
                      {msg}
                    </div>
                  )
                })
                 : <span className='rec-load'>Loading suggestions for you</span> }
              </div>}
              <div className='type-area'>
                <input onKeyDown={(e)=>{
                   if (e.key == "Enter") document.getElementById("msg").click();
                }} type="file" id="img" style={{ display: "none" }} onChange={handleImg} />
                <img width="45" height="45" src="https://img.icons8.com/external-others-inmotus-design/67/external-Tic-Tac-Toe-round-icons-others-inmotus-design-5.png" alt="external-Tic-Tac-Toe-round-icons-others-inmotus-design-5" onClick={giveGameRequest} />
                <ShareLocationIcon sx={{ color: "black" }} fontSize='large' onClick={sendLocation}>location share</ShareLocationIcon>
                <AddPhotoAlternateIcon sx={{ color: "black" }} fontSize='large' onClick={() => document.getElementById("img").click()} />
                <input onKeyDown={(e)=>{
                   if (e.key == "Enter") document.getElementById("send-btn").click();
                }} onChange={handleTyping} type='text' className='chat-space' id="msg" placeholder="Message" />
                <button className='send-btn' type='submit' id="send-btn" onClick={sendMessage}><SendIcon /> </button>
              </div>
            </div>
        </>}




    </div>
  )
}

export default ChatPage