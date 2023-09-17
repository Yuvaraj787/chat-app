import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import "../styles/login.css"
import { validateEmail } from '../components/functions';
import MailIcon from '@mui/icons-material/Mail';
import LockIcon from '@mui/icons-material/Lock';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import { ApiUrl } from '../components/comVars';
function login(props) {
  const cookie = new Cookies();
  useEffect(()=>{
    document.title = "Chat App | Login"
  })
  const navigate = useNavigate();
  const [userDetails, setDetails] = React.useState({email:"",pwd:""});
  const updateInfo = (e) => {
    setDetails({...userDetails,[e.target.name]:e.target.value});
  }
  
  const verify = (e) => {
    e.preventDefault();
    localStorage.clear();

    let missingFields = [];
    Object.keys(userDetails).forEach(key => {
      if (userDetails[key] == "") missingFields.push(document.getElementsByName(key)[0].placeholder);
    })
    if (missingFields.length > 0) {
      let warnMessage = "Missing fields : ";
      let fields = missingFields.reduce((first, second) => first + ", " + second);
      toast.error(warnMessage + fields);
      return;
    }

    if (!validateEmail(userDetails.email)) {
      toast.error("Enter a valid email !");
      return;
    }
    
    const toastId = toast.loading('Loading...');
    axios({
      url:ApiUrl + "/login",
      method:"POST",
      params: userDetails,
    }).then((res)=>{
    if (res.data.correct) {
      toast.success('Logged successfully', {
        id: toastId,
      });
      props.setLoggedIn(true);
      cookie.set("token",res.data.token);
      cookie.set("username", res.data.username);
      navigate("/view");
    } else {
      if (res.data.newEmail) {
        toast.error("Email not already registered!",{
          id:toastId
        })
      }
      else if (res.data.wrgPwd) {
        toast.error("Wrong password",{
          id:toastId
        })
      }
    } 
   }).catch((err)=>{
    toast.error("Login failed ! Reason : " + err.message,{
      id:toastId
    })
   })
  }
  
  return (
    <div className='form-page'>
        <div className='align'>
        <div className='fix1'><span className='form-head'>Login</span></div>
        <form>
        <div className='form-box'>
           <div className='input-box'><MailIcon /><input onChange={updateInfo} value={userDetails.email} name="email" className='input-cust' type="email" placeholder="Email Address" icon="MailIcon" /></div>
           <div className='input-box'><LockIcon /><input onChange={updateInfo} value={userDetails.pwd} name="pwd" className='input-cust' type="password" placeholder="Password" icon="Lock"/></div>
           <button onClick={verify} className='lgn-btn'>Login</button>
        </div>
        <div className='form-foot'>
            <span className='form-info'>Don't have an account ? <a href='/signup'>Signup here</a></span>
        </div>
        </form>
        </div>
    </div>
  )
}

export default login