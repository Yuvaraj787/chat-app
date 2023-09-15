import React, { useState, useEffect } from 'react'
import "../styles/navbar.css"
import { Cookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ApiUrl } from './comVars';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import logo from "/icons8-chat-96.png"
import MenuIcon from '@mui/icons-material/Menu';
import { Close } from '@mui/icons-material';
import ChatPage from './chatPage';
import toast from 'react-hot-toast';

function oNavbar(props) {
    const navigate = useNavigate();
    const [dp, setDp] = useState("");
    const [show, setShow] = useState(false);
    const [path, setPath] = useState("");
    const cookie = new Cookies();
    const logout = () => {
        cookie.remove('token');
        cookie.remove('username');
        localStorage.clear();
        toast.success("Logout successfull!");
        props.setLoggedIn(false);
        navigate("/login");
    }
    useEffect(() => {
        axios({
            method: "GET",
            url: ApiUrl + "/dp",
            headers: {
                "authtoken": cookie.get("token")
            }
        }).then((res) => {
            console.log("Dp is ", res.data.dp);
            setDp(res.data.dp);
        }).catch(err => {
            console.log("Error in fetching dp in oNavbar : ", err.message);
        })
    }, [])
    useEffect(()=>{
        setPath(window.location.pathname);
    })
    console.log("width > ", window.innerWidth);
    return (
        <div className='oNavbar'>
            <div className='inside-nav'>
                <div className='first-half'>
                    <div className='nav-brand'>
                        <img src={logo} className='brand-logo' />
                        <span>ChatApp</span>
                    </div>
                </div>
                <div className='drop-menu' onClick={()=>{
                    setShow(!show)
                }}>
                   {show ? <Close /> :  <MenuIcon fontSize='large' />}
                </div>
            </div>
            <div className='second-half' style={{height:show && "20vh"}}>
            {props.loggedIn && <div className='nav-item'>
                    <span>
                         <a style={{ cursor: "pointer" }} href='/view' className={path == "/view" && "setted"}>Chat</a>
                    </span>
                </div>}
                <div className='nav-item'>
                    <span className={path == "/login" && "setted"}>
                        {props.loggedIn ? <a style={{ cursor: "pointer" }} onClick={logout}>Logout</a> : <a href="/login">Login</a>}
                    </span>
                </div>
                
                <div className='nav-item'>
                    <span className={path == "/about" && "setted"}><a href="#">About</a></span>
                </div>
                <div className='nav-item'>
                    <span className={path == "/profile" && "setted"}><a href="/profile">{props.loggedIn ? <img src={dp} style={{ height: "2.5rem", width: "2.5rem", borderRadius: "50%", objectFit: "cover", display: "flex", border: "1px solid black" }} /> : <AccountCircleIcon fontSize='large' sx={{ display: "flex" }} />}</a></span>
                </div>
            </div>
        </div>
    )
}

export default oNavbar