import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import reactLogo from './assets/react.svg'
import axios from 'axios';

import './App.css'
import Login from './Components/Login'
import Signup from './Components/Signup';
import Home from './Components/Home';
import Showusers from './Components/Showusers';
import Forgotpassword from './Components/Forgotpassword';
import io from "socket.io-client";
import Chat from './Components/Chat';
import Navbar from './Components/Navbar';
import Sendemail from './Components/Sendemail';
var socket = io.connect("http://localhost:3000");

function App() {
  const navigate = useNavigate();
  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  // function handleLogin() {
  //   setIsLoggedIn(true);
  //   navigate('/login')
  // }

  // function handleLogout() {
  //   setIsLoggedIn(false);
  //   localStorage.removeItem('token');
  //   navigate('/signup');
  // }
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home socket={socket} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/:id" element={<Signup />} />
        <Route path="/showusers" element={<Showusers socket={socket} />} />
        <Route path="/sendmail" element={<Sendemail />} />
        <Route path="/forgotpassword/:id" element={<Forgotpassword />} />
        <Route path="/chat" element={<Chat socket={socket} />} />
        {/* <Route path="/chat/:id" element={<Chat socket={socket} />} /> */}
      </Routes>
    </>

  )
}

export default App
