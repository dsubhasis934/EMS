import { useState, useEffect } from 'react'
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
var socket = io.connect("http://localhost:3000");

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home socket={socket} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/:id" element={<Signup />} />
        <Route path="/showusers" element={<Showusers socket={socket} />} />
        <Route path="/forgotpassword" element={<Forgotpassword />} />
        <Route path="/chat" element={<Chat socket={socket} />} />
        {/* <Route path="/chat/:id" element={<Chat socket={socket} />} /> */}
      </Routes>
    </BrowserRouter>

  )
}

export default App
