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
              headers:{
                  "authtoken":cookie.get('token')
              }
          }).then((res)=>{
              if (res.data.verified) {
                  setLoggedIn(true);
              } else {
                 console.log(window.location.pathname);
                    alert("Logged out");
                    navigate("/login");
                  setLoggedIn(false);
              }
          }).catch(err => {
              console.log("Error in detecting user : ",err.message);
          })
      }
  }
  return (
    <div className="App">
    <div>
    <Navbar loggedIn={loggedIn}/>
    </div>
    <div>
      <Routes >
          <Route path="/"   element={<Login onLoad={verifyStatus}/>} />
          <Route path="/login"  element={<Login onLoad={verifyStatus}/>} />
          <Route path="/signup" element={<Signup onLoad={verifyStatus}/>} />
          <Route path="/load" element={<LoadingPage />} />
          <Route path="/view" element={<Main />} />
      </Routes>
      </div>
    </div>
  )
}

export default App
