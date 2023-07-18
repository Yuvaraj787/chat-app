import React, { useEffect, useState } from 'react'
import List from "../components/list"
import ChatPage from "../components/chatPage"
import "../styles/mainpage.css"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import LoadingPage from "../components/LoadingPage"
import { Cookies } from 'react-cookie'
import io from "socket.io-client"
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
const cookie = new Cookies();

const downloadChats = async (list) => {
    for (var i = 0; i < list.length; i++) {
      await axios({
        url:"https://chat-app-backend-pp9x.onrender.com/getChat",
        method:"GET",
        headers:{
          "authToken": cookie.get("token")
        },
        params:{
          roomid:list[i].roomid
        }
        }).then((res)=>{
        if (res.data.success) {
          console.log(res.data.chats)
          localStorage.setItem(list[i].id+"",JSON.stringify(res.data.chats))
        } else {
          alert("Error in fetching chats of this person please try again later");
        }
        }).catch(err=>{
          console.log("Error in getting the chat of this person");
        })
    }
    return true;
}

function mainpage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState({userid : -1, name:"",roomid:-1});
  const [contactsFetched, setFetched] = useState(false);
  const [chatFetched, setChatFetched] = useState(false);
  const [fullScreen , setFullScreen] = useState(true);
  const [chatList, setList] = useState([]);
  const [currentChats, setChats] = useState([]);
  const [requiredSocket, setSocket] = useState();
  const name = cookie.get("username");
  
  useEffect(()=>{
    axios({
      url:"https://chat-app-backend-pp9x.onrender.com/getlist",
      method:"GET",
      headers:{
        "authToken": cookie.get("token")
      },
    }).then(async (res)=>{
      if (res.data.wrongToken) logout()
      console.log(res.data.list);
      setList(res.data.list);
      setFetched(true)
      if (await downloadChats(res.data.list)) {
        setChatFetched(true)
      }
    }).catch((err)=>{
      console.log("Error in retreiving the list : ",err.message);
    })
  },[])
  
  return (
    <div className='main-page'>
    
      {contactsFetched && chatFetched ?
       <>
      {fullScreen ?
        <List onChange={setSelected} username={name} cur={selected} stChats={setChats} select={selected} changeSocket={setSocket} list={chatList} setScreen={setFullScreen}/>
       :  <KeyboardDoubleArrowRightIcon  onClick={()=>setFullScreen(true)} />
       }
      {selected.name == "" ? 
      "select a name to chat"
       :
      <ChatPage details={selected} reqSocket={requiredSocket} setChats={setChats} curChats={currentChats}/>
      } 
      </> :
       <LoadingPage contactStatus={contactsFetched} chatStatus={chatFetched} />}
      
    </div>
  )
}

export default mainpage