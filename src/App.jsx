import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Pages and components import
import Login from "./pages/login";
import Navbar from './components/navbar';
import Signup from './pages/signup';
import Main from './pages/mainpage';
// StyleSheets
import './App.css';

function App() {

  return (
    <div className="App">
    <BrowserRouter>
    <div>
    <Navbar />
    </div>
    <div>
      <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/view" element={<Main />} />
      </Routes>
      </div>
    </BrowserRouter>
    </div>
  )
}

export default App
