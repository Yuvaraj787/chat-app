import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
// Pages and components import
import Login from "./pages/login";
import Navbar from './components/navbar';
import Signup from './pages/signup';
import LoadingPage from './components/LoadingPage';
import Main from './pages/mainpage';
import { Cookies } from 'react-cookie';
import { ApiUrl } from './components/comVars';
import About from './pages/about';
import Profile from './pages/Profile/profile';
import OtherProfile from "./pages/Profile/otherProfile";
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
// StyleSheets
import './App.css';

function App() {
  const cookie = new Cookies();
  const [loggedIn, setLoggedIn] = useState(false);

  const navigate = useNavigate();

  const verifyStatus = async () => {
    console.log("Verifying login status")
    if (!cookie.get('token')) {
      if (window.location.pathname == "/view") {
        alert("Logged out");
        navigate("/login");
      }
      setLoggedIn(false);
    } else {
      await axios({
        url: ApiUrl + "/verify",
        method: "POST",
        
        headers: {
          "authtoken": cookie.get('token')
        }
      }).then((res) => {
        if (res.data.verified) {
          console.log("Auth success");
          setLoggedIn(true);
        } else {
          cookie.remove('token');
          cookie.remove('username');
          alert("Logged out");
          navigate("/login");
          setLoggedIn(false);
        }
      }).catch(err => {
        console.log("Error in detecting user : ", err.message);
      })
    }
  }
  useEffect(() => {
    verifyStatus();
    console.log("App Running in " + process.env.NODE_ENV + " mode");
  }, [])
  return (
    <div className="App">
      <div style={{width:"100%"}}>
        <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      </div>
      <div className='inside-app'>
        <Routes >
          <Route path="/" element={<Login  setLoggedIn={setLoggedIn}/>} />
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/load" element={<LoadingPage />} />
          <Route path="/view" element={<Main />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile/:userid" element={<OtherProfile />} />
        </Routes>
      </div>
      <Toaster
      position="top-center"
      />
    </div>
  )
}

export default App
