import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';
import { Cookies } from 'react-cookie'
import axios from 'axios'
import { logout, validateEmail } from "../components/functions"
import io from "socket.io-client"
import profileImg from "../assets/profile.png";
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import CloseIcon from '@mui/icons-material/Close';
import ImageViewer from './imageViewer';
import { ApiUrl } from './comVars';
import toast from 'react-hot-toast';

function OneBox(props) {
  const cookie = new Cookies()
  const socket = io.connect(ApiUrl);
  socket.kid = 8900;
  const [sampleChats, setChats] = useState([]);
  const [fetched, setFetched] = useState(false);
  const [show, setShow] = useState(false);
  const [unread, setUnread] = useState(false);
  const [typing, setTyping] = useState(false);
  const [online, setOnline] = useState(false);
  
  useEffect(() => {
    console.log("Trying to join room from client side :", props)
    socket.emit("join_room", props.roomid)
    socket.emit("send_message", { message: null, type: "online-give", room: props.roomid, senderToken: cookie.get("token") })
  }, [])
  const chats = JSON.parse(localStorage.getItem(props.oid + ""));

  // useEffect(() => {
  //   if (props.selected && fetched) {
  //     props.onChange(props.index, socket, sampleChats)
  //   }
  // }, [props.selected])
  useEffect(() => {

    socket.on("receive_message", async (data) => {
      console.log(data);
      if (data.type == "offline") {
        setOnline(false);
        return;
      }
      if (data.userid != props.oid) return;
      if (data.type == "typing" && !typing) {
        setTyping(true);
        await setTimeout(() => {
          setTyping(false);
        }, 2000);
        return;
      } else if (data.type == "online-give") {
        setOnline(true);
        socket.emit("send_message", { message: null, type: "online-back", room: props.roomid, senderToken: cookie.get("token") })
      } else if (data.type == "online-back") {
        setOnline(true);
      } else {
        setUnread(true)
        console.log(data);
        var chat1 = JSON.parse(localStorage.getItem(props.oid + ""));
        // if (chat1[chat1.length - 1].message != data.message)
        chat1.push({ message: data.message, sent: false, type: data.type, values: data.values });
        localStorage.setItem(props.oid + "", JSON.stringify(chat1))
        if (cookie.get("selected") == props.oid) {
          props.changeChat([...chat1])
        } else {
          toast(`Message received from ${props.name} : ${chat1[chat1.length - 1].message}`);
        }
      }
    })
  }, [socket])
  return (
    <div className="OneBox" 
    style={{ backgroundColor: props.selected && "#214475",
           fontWeight: props.selected && "bold",
           display:"flex",
           columnGap:"10px",
           alignItems:"center"}}
    onClick={
      () => {
        if (window.innerWidth < 600) {
          document.querySelector(".list-section").style.maxWidth = "50px";
          props.setFs(true);
          document.querySelector(".chat-page").style.display = "flex";
        }
        props.changeChat();
        props.changeChat([...chats])
        cookie.set("selected", props.oid)
        props.onChange({ name: props.name, userid: props.oid, roomid: props.roomid, dp:props.dp })
        props.sChange(socket)
      }
    }>
      <span>
        <img src={props.dp == null ? profileImg : props.dp} onClick={()=>setShow(true)} style={{height:"35px",width:"35px",borderRadius:"50%",objectFit:"cover",display:"flex",cursor:"pointer"}} />
        {show && <ImageViewer src={props.dp} show={show} setFullScreen={setShow} /> }
      </span>
      <div style={{display:"flex", flexDirection:"column"}}>
        <span>{props.name}</span>
        <span style={{fontSize:"1.3rem"}}>{online && <span style={{ color: props.selected ? "#029500" : "darkgreen"}}>Online</span>} {typing && <span style={{ color: props.selected ? "#029500" : "darkgreen" }}><span style={{color:"black"}}>|</span> Typing..</span> } </span>
      </div>
    </div>
  )
}

function List(props) {
  const cookie = new Cookies();
  const [email, setEmail] = useState("");

  const [selected, setSelected] = useState(0);
  const [displayState, setDisplay] = useState(false);
  const [fs, setFs] = useState(false);

  const updateEmail = (e) => setEmail(e.target.value);

  const addChat = () => {
    if (!validateEmail(email)) {
      toast.error("Enter a valid email !");
      return;
    }
    let id = toast.loading("Searching for the contact....");
    axios({
      url: ApiUrl + "/addchat",
      method: "POST",
      params: { email: email },
      headers: {
        "authToken": cookie.get("token")
      }
    }).then((res) => {
      if (res.data.wrongToken) logout()
      if (res.data.success) {
        toast.success("Successfully added", { id });
        window.location.reload();
      } else if (res.data.alreadyExist) {
        toast.error("Contact Already exist", { id })
      } else if (res.data.NotExist) {
        toast.error("Given email not registered", { id })
      }
    }).catch((err) => {
      toast.error("Error in adding contact. Reason " + err.message, { id })
      console.log("Error in adding chat : ", err.message);
    })
  }

  return (
    <div className='list-section'>
      <div className='list-head list pad-med' style={{paddingLeft:"5%"}}>
        <span style={{ visibility: fs && "hidden",textTransform:"capitalize" }}>
          {props.username}
        </span>
        {!fs ? <MenuOpenIcon className="i2" onClick={
          () => {
            document.querySelector(".list-section").style.maxWidth = "50px";
            setFs(true);
          }
        } /> : <MenuOpenIcon sx={{ transform: "scaleX(-1)" }} className="i2" onClick={
          () => {
            if (window.innerWidth < 600) {
              document.querySelector(".chat-page").style.display = "none";
            }
            document.querySelector(".list-section").style.maxWidth = "300px";
            setFs(false);
          }
        } />}
      </div>
      <div className='list-copy'  style={{ visibility: fs && "hidden" }}>
        <div className='list-head1'>
          <span style={{ whiteSpace: "nowrap" }}>
            Your Chats
          </span>
          <button className='add-btn i1' onClick={() => {
            // document.querySelector(".input-div").style.height = displayState ? "70px" : "0px";
            setDisplay(!displayState);
          }}>
            <>{displayState ? <CloseIcon sx={{ color: "red" }} /> : <PersonAddAlt1RoundedIcon sx={{ color: "black" }} />}</>
          </button>
        </div>
        <div className='form-section input-div' style={{ height: displayState ? "70px" : 0 }}>
          <input className='input-cust extra-cust' onChange={updateEmail} value={email} placeholder="Email Address" type="email" icon={"MailIcon"} />
          <button onClick={addChat} className='send-btn add-btn2'>Add</button>
        </div>
      </div>

      <div className='list' style={{ visibility: fs && "hidden" }} >
        {props.list.map((e, i) => {
          return (<OneBox
            s={props.select.userid}
            dp={e.dp}
            changeChat={props.stChats}
            name={e.name}
            index={i}
            selected={e.roomid == props.cur.roomid}
            onChange={props.onChange}
            sChange={props.changeSocket}
            roomid={e.roomid}
            oid={e.id}
            setFs={setFs}
          />)
        })}
      </div>
    </div>
  )
}

export default List