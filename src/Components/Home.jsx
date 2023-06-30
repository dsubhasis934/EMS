import React, { useEffect, useState, createContext } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { AiOutlineLogout } from 'react-icons/ai'
import { Socket } from 'socket.io-client';
//import Typing from 'react-typing-animation';
// import { useDispatch } from 'react-redux';
import { setLoggedInUser } from './redux/UserAction';
import { useSelector, useDispatch } from 'react-redux'
import { SET_LOGGED_IN_USER } from './redux/UserReducer'
import axios from 'axios';
function Home({ socket }) {
  const dispatch = useDispatch();
  const UserContext = createContext();
  const [loggedinUser, setLoggedinUser] = useState([]);
  const getToken = localStorage.getItem("token");
  const findToken = JSON.parse(getToken)
  const navigate = useNavigate();
  const loaduserdata = () => {
    const { id } = findToken;
    axios.get(`http://localhost:3000/api/fetchuser?id=${id}`)
      .then(resp => {
        const { data, success, message } = resp.data;
        console.log(data);
        if (success) {
          dispatch(SET_LOGGED_IN_USER(data))
          setLoggedinUser(data);

        }
      })
  }
  const tokenChecking = () => {
    if (getToken === null) {
      navigate('/login')
    } else {
      navigate('/');
      loaduserdata()
    }
  }
  useEffect(() => {
    tokenChecking();
    console.log(getToken);
  }, [])
  const logout = () => {
    localStorage.removeItem('token');
    navigate('/signup');
  }
  // const checkedtoken = localStorage.getItem("token");



  // useEffect(() => {
  //   socket.emit("user-connect", findToken.id);
  // }, [])
  return (

    <>

      <div className="chat-background">

        {loggedinUser && loggedinUser.map((elem, id) => {
          console.log(elem)
          return (
            // <div className="card text-center" key={id}>
            //   <div className="card-header">
            //     {elem.name}
            //   </div>
            //   <div className="card-body">
            //     <img src={
            //       typeof elem.image === "string" || !(elem.image instanceof Blob)
            //         ? `http://127.0.0.1:3000/images/${elem.image}`
            //         : URL.createObjectURL(elem.image)
            //     } alt="default" height={100}
            //       width={150} />
            //     <h5 className="card-title mt-5">{elem.email}</h5>
            //     <p className="card-text">{elem.user_type}.</p>

            //   </div>
            //   <Link to="/showusers" className="pt-3">click here to show database logged in users</Link>
            // </div>

            <section class="vh-100 chat-background" key={id}>
              <div class="container py-5 h-100">
                <div class="row d-flex justify-content-center align-items-center h-100">
                  <div class="col col-lg-6 mb-4 mb-lg-0">
                    <div class="card mb-3" style={{ borderRadius: ".5rem" }}>
                      <div class="row g-0">
                        <div class="col-md-4 gradient-custom text-center text-white"
                          style={{ "border-top-left-radius": ".5rem", "border-bottom-left-radius": ".5rem" }}>
                          <img src={
                            typeof elem.image === "string" || !(elem.image instanceof Blob)
                              ? `http://127.0.0.1:3000/images/${elem.image}`
                              : URL.createObjectURL(elem.image)
                          }
                            alt="Avatar" class="img-fluid my-5" style={{ width: "100px", height: "100px" }} />
                          <h5>{elem.name}</h5>
                          <i class="far fa-edit mb-5"></i>
                        </div>
                        <div class="col-md-8">
                          <div class="card-body p-4">
                            <h6>Information</h6>
                            <hr class="mt-0 mb-4" />
                            <div class="row pt-1">
                              <div class="col-12 mb-3">
                                <h6>Email</h6>
                                <p class="text-muted">{elem.email}</p>
                              </div>
                              <div class="col-12 mb-3">
                                <h6>User Role</h6>
                                <p class="text-muted">{elem.user_type}</p>
                              </div>
                              <div class="col-12 mb-3">
                                <Link to="/showusers" className="pt-3">click here to show database logged in users</Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex justify-content-center">
                      <button className="btn btn-danger text-white mt-2" onClick={logout}>logout <AiOutlineLogout className="logoutIcon" /></button><br />
                    </div>

                  </div>
                </div>

              </div>
            </section>


          )

        })}

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
