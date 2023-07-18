import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { AddBox } from '@mui/icons-material'
import { Cookies } from 'react-cookie'
import axios from 'axios'
import { logout } from "../components/functions"
import io from "socket.io-client"
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

function OneBox(props) {
     const cookie = new Cookies()
     const socket = io.connect("http://localhost:3000")
     const [sampleChats, setChats] = useState([]);
     const [fetched, setFetched] = useState(false);
     useEffect(()=>{
      console.log("Trying to join room from client side :",props)
      socket.emit("join_room", props.roomid)
     },[])
     const [unread, setUnread] = useState(false);
     const chats = JSON.parse(localStorage.getItem(props.oid+""));
    
     useEffect(()=>{
      if (props.selected && fetched) {
        props.onChange(props.index,socket, sampleChats)
      }
     },[props.selected])
     useEffect(()=>{
          socket.on("receive_message",(data)=>{   
          if (data.userid != props.oid) return;
          setUnread(true)
          console.log("1st : ",chats)
          var chat1 = JSON.parse(localStorage.getItem(props.oid+""));
          if (chat1[chat1.length - 1].message != data.message) 
            chat1.push({message:data.message, sent: false});
          
          localStorage.setItem(props.oid+"",JSON.stringify(chat1))
          if (cookie.get("selected") == props.oid) {
            props.changeChat([...chat1]) 
          }
        })
     },[socket])

     return (
      <> 
        <div className='OneBox' style={{backgroundColor:props.selected && "#0567b4",color:props.selected && "white"}} onClick={
          () => {
            props.changeChat([...chats])
            cookie.set("selected",props.oid)
            props.onChange({name:props.name,userid:props.oid,roomid:props.roomid})
            props.sChange(socket)
          }
          }>
          <span>{props.name}  
          {unread && <span style={{color:"green"}}>*</span>}</span>
        </div>
      </>
     )
}

function List(props) {
  const cookie = new Cookies();
  const [email,setEmail] = useState("");

  const [selected, setSelected] = useState(0);
  const [displayState, setDisplay] = useState(false);

  // const update = (ind,socket) => {
  //   props.list[selected].selected = false;
  //   props.list[ind].selected = true;
  //   setList([...list]);
  //   setSelected(ind);
  //   props.changeSocket(socket);
  //   props.onChange(list[ind]);
  // }
  const toggle = () => setDisplay(!displayState);
  
  const updateEmail = (e) => setEmail(e.target.value);
  
  const addChat = () => {
      axios({
        url : "http://localhost:3000/addchat",
        method:"POST",
        params:{email:email},
        headers:{
          "authToken":cookie.get("token")
        }
      }).then((res)=>{
         if (res.data.wrongToken) logout()
         if (res.data.success) {
          alert("Successfully added")
         } else if (res.data.alreadyExist) {
          alert("Already exist")
         } else if (res.data.NotExist) {
          alert("Given Email not registered")
         }
      }).catch((err)=>{
        console.log("Error in adding chat : ",err.message);
      })
  }

  return (
    <div className='list-section'>
    <div className='list-head'>
      <span>
        {props.username}
      </span>
      <MenuOpenIcon onClick={()=>{props.setScreen(false)}}/>
    </div>
    <div className='list-head'>
      <span>
        Your Chats
      </span>
      <button className='add-btn' onClick={toggle}>
        {displayState ? "Cancel" : <><AddBox /> New Chat</>}
      </button>  
    </div>
    {displayState && <div className='form-section input-div'>
      <input className='input-cust extra-cust' onChange={updateEmail} value={email} placeholder="Email Address" type="email" icon={"MailIcon"} />
      <button onClick={addChat}>Add</button>
    </div>}  
    <div className='list'>
     {props.list.map((e,i)=>{
        return (<OneBox
                 s={props.select.userid} 
                 changeChat={props.stChats}
                 name={e.name}
                 index={i} 
                 selected={e.roomid == props.cur.roomid} 
                 onChange={props.onChange} 
                 sChange={props.changeSocket} 
                 roomid={e.roomid} 
                 oid={e.id}
                />)
     })}
    </div>
    </div>
  )
}

export default List