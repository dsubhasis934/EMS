import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { AiOutlineLogout } from 'react-icons/ai'
import { Socket } from 'socket.io-client';
//import Typing from 'react-typing-animation';

import axios from 'axios';
function Home({ socket }) {
  const [loggedinUser, setLoggedinUser] = useState([]);
  const getToken = localStorage.getItem("token");
  const findToken = JSON.parse(getToken)
  const { name, id } = findToken;
  const navigate = useNavigate();
  const loaduserdata = () => {
    axios.get(`http://localhost:3000/api/fetchuser?id=${id}`)
      .then(resp => {
        const { data, success, message } = resp.data;
        console.log(data);
        if (success) {
          setLoggedinUser(data);
        }
      })
  }
  useEffect(() => {
    loaduserdata()
  }, [])
  const logout = () => {
    localStorage.removeItem('token');
    navigate('/signup');
  }
  const checkedtoken = localStorage.getItem("token");
  const tokenChecking = () => {
    if (checkedtoken === null) {
      navigate('/login')
    } else {
      navigate('/');
    }
  }

  useEffect(() => {
    tokenChecking();
    console.log(getToken);
  }, [])


  // useEffect(() => {
  //   socket.emit("user-connect", findToken.id);
  // }, [])
  return (

    <>

      <div className="d-flex flex-wrap flex-column align-items-center chat-background">
        <h1>welcome</h1>

        {loggedinUser && loggedinUser.map((elem, id) => {
          return (
            <div className="card text-center" key={id}>
              <div className="card-header">
                {elem.name}
              </div>
              <div className="card-body">
                <img src={
                  typeof elem.image === "string" || !(elem.image instanceof Blob)
                    ? `http://127.0.0.1:3000/images/${elem.image}`
                    : URL.createObjectURL(elem.image)
                } alt="default" height={100}
                  width={150} />
                <h5 className="card-title mt-5">{elem.email}</h5>
                <p className="card-text">{elem.user_type}.</p>
               
              </div>
              <Link to="/showusers" className="pt-3">click here to show database logged in users</Link>
            </div>
          )

        })}
   <button className="btn btn-danger text-white mt-2" onClick={logout}>logout <AiOutlineLogout className="logoutIcon" /></button><br />

      </div>
    </>



    /*<>
    {(checkedtoken===null)?(<div><h1>welcome to our home page</h1>
    <Link to='/login'>Login</Link>
    <Link to='/signup'>Signup</Link>
    </div>):<div><h1>user logged in</h1><button onClick={logout}>logout</button></div>} */

  )
}

export default Home
