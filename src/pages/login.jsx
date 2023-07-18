import React from 'react'
import { useNavigate } from 'react-router-dom'
import "../styles/login.css"
import MailIcon from '@mui/icons-material/Mail';
import LockIcon from '@mui/icons-material/Lock';
import BadgeIcon from '@mui/icons-material/Badge';
import axios from 'axios';
import { Cookies } from 'react-cookie';
function login() {
  const cookie = new Cookies();
  const navigate = useNavigate();
  const [userDetails, setDetails] = React.useState({email:"",pwd:""});
  const updateInfo = (e) => {
    setDetails({...userDetails,[e.target.name]:e.target.value});
  }
  
  const verify = () => {
    
    axios({
      url:"https://chat-app-backend-pp9x.onrender.com/login",
      method:"POST",
      params: userDetails,
   }).then((res)=>{
    if (res.data.correct) {
      alert("Login success!")
      cookie.set("token",res.data.token);
      cookie.set("username", res.data.username);
      navigate("/view");
    } else {
      if (res.data.newEmail) alert("Email not already registered!")
      else if (res.data.wrgPwd) alert("Wrong password")
    } 
   }).catch((err)=>{
    console.log(err);
   })

  }
  
  return (
    <div className='form-page'>
        <div className='align'>
        <div className='fix1'><span className='form-head'>Login</span></div>
        <div className='form-box'>
           <div className='input-box'><MailIcon /><input onChange={updateInfo} value={userDetails.email} name="email" className='input-cust' type="email" placeholder="Email Address" icon="MailIcon" /></div>
           <div className='input-box'><LockIcon /><input onChange={updateInfo} value={userDetails.pwd} name="pwd" className='input-cust' type="password" placeholder="Password" icon="Lock"/></div>
           <button onClick={verify}>Login</button>
        </div>
        <div className='form-foot'>
            <span className='form-info'>Don't have an account ? <a href='/signup'>Signup here</a></span>
        </div>
        </div>
    </div>
  )
}

export default login