import React, { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import "../styles/login.css"
import MailIcon from '@mui/icons-material/Mail';
import LockIcon from '@mui/icons-material/Lock';
import { PhoneAndroidOutlined } from '@mui/icons-material';
import toast from 'react-hot-toast';
import axios from 'axios';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import BadgeIcon from '@mui/icons-material/Badge';
import { ApiUrl } from '../components/comVars';


function SignUp(props) {
  const navigate = useNavigate();
  const [userDetails, setDetails] = useState({uname:"",email:"",pwd:"",cpwd:"",phone:"",img:""});
  const updateInfo = (e) => {
    setDetails({...userDetails,[e.target.name]:e.target.value});
  }
  useEffect(() => {
    document.title = "Chat App | SignUp"
  },[])
  const register = () => {
    const id = toast.loading('Loading...');
     axios({
        url:ApiUrl + "/signup",
        method:"POST",
        headers:{},
        params: userDetails,
     }).then((res)=>{
      if (res.data.otherErrors) {
        toast.error("Enter valid details",{ id })
      } else {
          if (!res.data.uniqueEmail) {
            toast.error("Email already registered",{ id })
          } else {
            toast.success("Account created sucessfully. Login to continue",{ id })
            navigate("/login")
          }
        } 
     }).catch((err)=>{
      toast.error("Something wrong happened Reason : " + err.message,{ id });
     })
  }

  const handleImg = (e) => {
    const formData = new FormData();
    formData.append("file",e.target.files[0]);
    formData.append("upload_preset","n4930qx2");
    document.getElementById("send-btn")?.click();
    const id = toast.loading("Uploading Image...");                                   
    axios.post("https://api.cloudinary.com/v1_1/dzcxy6zsg/image/upload",formData).then((res)=>{
      console.log("Response from cloundinary : ",res);
      setDetails({...userDetails,"img":res.data.secure_url});
      toast.success("Dp uploaded successfully", {id});
    }).catch((err)=>{
      toast.error("Dp not uploaded Reason : " + err.message, {id});
      console.log("Error in uploading images to cloudinary : ",err.message);
    })
  }
  return (
    <div className='form-page'>
        <div className='align'>
        <div className='fix1'><span className='form-head'>Sign up</span></div>
        <div className='form-box'>
           <div className='input-box'><BadgeIcon /><input onChange={updateInfo} value={userDetails.uname} name="uname" className='input-cust' type="text" placeholder="Set a username" icon="BadgeIcon" /></div>
           <div className='input-box'><MailIcon /><input onChange={updateInfo} value={userDetails.email} name="email" className='input-cust' type="email" placeholder="Email Address" icon="MailIcon" /></div>
           <div className='input-box'><PhoneAndroidOutlined /><input onChange={updateInfo} value={userDetails.phone} name="phone" className='input-cust' type="tel" placeholder="Phone number" icon="MailIcon" /></div>
           <div className='input-box'><LockIcon /><input onChange={updateInfo} value={userDetails.pwd} name="pwd" className='input-cust' type="password" placeholder="Password" icon="Lock"/></div>
           <div className='input-box'><LockIcon /><input onChange={updateInfo} value={userDetails.cpwd} name="cpwd" className='input-cust' type="password" placeholder="Confirm Password" icon="Lock"/></div>
           <div className='input-box prof-pic'>
            <InsertEmoticonIcon />
            <input type='file' onChange={handleImg} id="dp-select" style={{display:"none"}} /><span onClick={
            ()=>{
              document.getElementById("dp-select").click();
            }
            } className='input-cust' style={{fontSize:"1.6rem",cursor:"pointer"}}>Choose profile picture</span></div>
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