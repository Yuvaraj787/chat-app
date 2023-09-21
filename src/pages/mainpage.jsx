import React, { useEffect, useState } from 'react'
import List from "../components/list"
import ChatPage from "../components/chatPage"
import "../styles/mainpage.css"
import axios from 'axios'
import toast from 'react-hot-toast'
import LoadingPage from "../components/LoadingPage"
import { Cookies } from 'react-cookie'
import { ApiUrl } from '../components/comVars'
const cookie = new Cookies();

const downloadChats = async (list) => {
    for (var i = 0; i < list.length; i++) {
      await axios({
        url:ApiUrl + "/getChat",
        method:"GET",
        headers:{
          "authToken": cookie.get("token")
        },
        params:{
          roomid:list[i].roomid
        }
        }).then((res)=>{
        if (res.data.success) {
          localStorage.setItem(list[i].id+"",JSON.stringify(res.data.chats))
        } else {
          toast.error("Error in fetching chats of this person please try again later");
        }
        }).catch(err=>{
          console.log("Error in getting the chat of this person");
        })
    }
    return true;
}

function mainpage(props) {
  const [selected, setSelected] = useState({userid : -1, name:"",roomid:-1,dp:""});
  const [contactsFetched, setFetched] = useState(false);
  const [chatFetched, setChatFetched] = useState(false);
  const [fullScreen , setFullScreen] = useState(true);
  const [chatList, setList] = useState([]);
  const [currentChats, setChats] = useState([]);
  const [requiredSocket, setSocket] = useState();
  const name = cookie.get("username");
  
  useEffect(()=>{
    document.title = "Chat App | Your Chats"
    axios({
      url:ApiUrl + "/getlist",
      method:"GET",
      headers:{
        "authToken": cookie.get("token")
      },
    }).then(async (res)=>{
      if (res.data.wrongToken) logout()
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
  contactsFetched && chatFetched ?
    <div className='main-page' >
        <List onChange={setSelected} screen={fullScreen} username={name} cur={selected} stChats={setChats} select={selected} changeSocket={setSocket} list={chatList} setScreen={setFullScreen}/>
        <ChatPage details={selected} reqSocket={requiredSocket} setChats={setChats} curChats={currentChats}/> 
    </div> :
    <LoadingPage contactStatus={contactsFetched} chatStatus={chatFetched} />
  )
}

export default mainpage