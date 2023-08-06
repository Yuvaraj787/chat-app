import React, { useState,useEffect } from 'react'
import "../styles/navbar.css"
import { Cookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ApiUrl } from './comVars';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import logo from "/icons8-chat-96.png"

function navbar(props) {
    const navigate = useNavigate();
    const [dp, setDp] = useState("");
    const cookie = new Cookies();
    const logout = () => {
        cookie.remove('token');
        cookie.remove('username');
        localStorage.clear();
        alert("Logout successfull!");
        props.setLoggedIn(false);
        navigate("/login");
    }
    useEffect(() => {
        axios({
            method:"GET",
            url:ApiUrl + "/dp",
            headers:{
                "authtoken":cookie.get("token")
            }
        }).then((res)=>{
            console.log("Dp is " , res.data.dp);
            setDp(res.data.dp);
        }).catch(err=>{
            console.log("Error in fetching dp in navbar : ",err.message);
        })
    },[])
    
    return (
        <div className='navbar'>
            <div className='first-half'>
                <div className='nav-brand'>
                    <img src={logo} className='brand-logo'/>
                    <span>ChatApp</span>
                </div>
            </div>
            <div className='second-half'>
                <div className='nav-item'>
                    <span>
                        {props.loggedIn ? <a style={{cursor:"pointer"}} onClick={logout}>Logout</a> : <a href="/login">Login</a>}
                    </span>
                </div>
                <div className='nav-item'>
                    <span><a href="#">About</a></span>
                </div>
                <div className='nav-item'>
                    <span><a href="/profile/">{props.loggedIn ? <img src={dp} style={{height:"2.5rem",width:"2.5rem",borderRadius:"50%",objectFit:"cover", display:"flex", border:"1px solid black"}} /> : <AccountCircleIcon fontSize='large' sx={{display:"flex"}} />}</a></span>
                </div>
            </div>
        </div>
    )
}

export default navbar