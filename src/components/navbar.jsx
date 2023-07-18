import React, { useState,useEffect } from 'react'
import "../styles/navbar.css"
import { Cookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
function navbar() {
    const navigate = useNavigate();
    const cookie = new Cookies();
    const [loggedIn, setLoggedIn] = useState(true);
    useEffect(()=>{
        if (!cookie.get('token')) {
        setLoggedIn(false);
        }
    },[])
    const logout = () => {
        cookie.remove('token');
        cookie.remove('username');
        alert("Logout successfull!");
        setLoggedIn(false);
        navigate("/login");
    }
    return (
        <div className='navbar'>
            <div className='first-half'>
                <div className='nav-brand'>
                    <span>ChatApp</span>
                </div>
            </div>
            <div className='second-half'>
                <div className='nav-item'>
                    <span>
                        {loggedIn ? <a onClick={logout}>Logout</a> : <a href="/login">Login</a>}
                    </span>
                </div>
                <div className='nav-item'>
                    <span>About</span>
                </div>
            </div>
        </div>
    )
}

export default navbar