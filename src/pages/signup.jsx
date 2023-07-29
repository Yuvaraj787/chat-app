import React, { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import "../styles/login.css"
import MailIcon from '@mui/icons-material/Mail';
import LockIcon from '@mui/icons-material/Lock';
import axios from 'axios';
import BadgeIcon from '@mui/icons-material/Badge';
import { ApiUrl } from '../components/comVars';


function SignUp(props) {
  const navigate = useNavigate();
  const [userDetails, setDetails] = useState({uname:"",email:"",pwd:"",cpwd:"",phone:""});
  const updateInfo = (e) => {
    setDetails({...userDetails,[e.target.name]:e.target.value});
  }
  useEffect(() => {
    props.onLoad();
    document.title = "Chat App | SignUp"
  },[])
  const register = () => {
     axios({
        url:ApiUrl + "/signup",
        method:"POST",
        headers:{},
        params: userDetails,
     }).then((res)=>{
      if (res.data.otherErrors) {
        alert("Something wrong in credientals")
      } else {
          if (!res.data.uniqueEmail) {
            alert("Email already used")
          } else {
            alert("Successfully account created !. Login to continue.")
            navigate("/login")
          }
        } 
     }).catch((err)=>{
      console.log(err);
     })
  }
  return (
    <div className='form-page'>
        <div className='align'>
        <div className='fix1'><span className='form-head'>Sign up</span></div>
        <div className='form-box'>
           <div className='input-box'><BadgeIcon /><input onChange={updateInfo} value={userDetails.uname} name="uname" className='input-cust' type="text" placeholder="Set a username" icon="BadgeIcon" /></div>
           <div className='input-box'><MailIcon /><input onChange={updateInfo} value={userDetails.email} name="email" className='input-cust' type="email" placeholder="Email Address" icon="MailIcon" /></div>
           <div className='input-box'><MailIcon /><input onChange={updateInfo} value={userDetails.phone} name="phone" className='input-cust' type="tel" placeholder="Phone number" icon="MailIcon" /></div>
           <div className='input-box'><LockIcon /><input onChange={updateInfo} value={userDetails.pwd} name="pwd" className='input-cust' type="password" placeholder="Password" icon="Lock"/></div>
           <div className='input-box'><LockIcon /><input onChange={updateInfo} value={userDetails.cpwd} name="cpwd" className='input-cust' type="password" placeholder="Confirm Password" icon="Lock"/></div>
           <button onClick={register} className='lgn-btn'>Register</button>
        </div>
        <div className='form-foot'>
            <span className='form-info'>Already have an account ? <a href='/login'>login here</a></span>
        </div>
        </div>
    </div>
  )
}

export default SignUp