import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { AiOutlineLogout } from 'react-icons/ai'
import { Socket } from 'socket.io-client';
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
        <h1>Welcome {name}</h1>
        {loggedinUser && loggedinUser.map((elem, id) => {
          return (
            <div key={id}>
              <p>{elem.name}</p>
            </div>
          )

        })}
        <button className="btn btn-danger text-white mt-2" onClick={logout}>logout <AiOutlineLogout className="logoutIcon" /></button><br />
        <Link to="/showusers" className="pt-3 text-danger">click here to show database logged in users</Link>
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
