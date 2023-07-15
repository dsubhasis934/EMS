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
          data.push(findToken.tok)
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

  const logout = (id) => {
    localStorage.removeItem('token');
    // socket.emit("logout", id); // Emit the logout event
    // socket.disconnect();
    navigate('/signup');
  }

  return (
    <>
      {loggedinUser.length > 0 && (
        <section class="vh-100 chat-background">
          <div class="py-5 h-100">
            <div class="row d-flex justify-content-center align-items-center h-100">
              <div class="col col-lg-6 mb-4 mb-lg-0">
                <div class="card mb-3" style={{ borderRadius: ".5rem" }} id="user-card">
                  <div class="row g-0">
                    <div class="col-md-4 gradient-custom text-center text-white"
                      style={{ "border-top-left-radius": ".5rem", "border-bottom-left-radius": ".5rem" }}>
                      <img src={
                        typeof loggedinUser[0].image === "string" || !(loggedinUser[0].image instanceof Blob)
                          ? `http://localhost:3000/images/${loggedinUser[0].image}`
                          : URL.createObjectURL(loggedinUser[0].image)
                      }
                        alt="Avatar" class="img-fluid my-5" style={{ width: "100px", height: "100px" }} />
                      <h5>{loggedinUser[0].name}</h5>
                      <i class="far fa-edit mb-5"></i>
                    </div>
                    <div class="col-md-8">
                      <div class="card-body p-4">
                        <h6>Information</h6>
                        <hr class="mt-0 mb-4" />
                        <div class="row pt-1">
                          <div class="col-12 mb-3">
                            <h6>Email</h6>
                            <p class="text-muted">{loggedinUser[0].email}</p>
                          </div>
                          <div class="col-12 mb-3">
                            <h6>User Role</h6>
                            <p class="text-muted">{loggedinUser[0].user_type}</p>
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
                  <button className="logout-btn mt-2" onClick={() => logout(loggedinUser[0]?._id)}>
                    logout <AiOutlineLogout className="logoutIcon" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}

export default Home;
