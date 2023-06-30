import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineLogout } from 'react-icons/ai'
import { AiOutlineLogin } from 'react-icons/ai'
import { useDispatch } from 'react-redux';
function Login() {
  // const value = useSelector((state) => state.counter.value)
  const dispatch = useDispatch();
  const getToken = localStorage.getItem("token");
  const findToken = JSON.parse(getToken)
  const notify = () => toast.success("user loggedin");
  //const history = useHistory();
  const navigate = useNavigate();
  const onChanges = (e) => {
    setcredentials({ ...credentials, [e.target.name]: e.target.value })
  }
  const handlesubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3000/api/loginuser", { //this api is our backend api
      method: 'POST', //this method and header we set beacuse we send request as post in backend and 
      // in thunderclint, we set header as a content-type:application/json
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: credentials.email, password: credentials.password }) //which value we get through the input field,and here we take 'credentials' as a state where we save inout field values.  
    })
    const jsonData = await response.json();
    if (!jsonData.success) {
      alert('enter valid credentials');
    } else {
      const loggedUser = {
        tok: jsonData.token,
        name: jsonData.name,
        id: jsonData._id
      }

      localStorage.setItem("token", JSON.stringify(loggedUser));
      //console.log(localStorage.getItem("token"))
      notify();
      setTimeout(() => {
        navigate('/');
      }, 1500)
      //set the auth token

      //console.log(getToken);


    }
  }
  useEffect(() => {
    console.log(findToken);
  }, [])
  const logout = () => {
    localStorage.removeItem('token');
    navigate('/signup');
  }

  const [credentials, setcredentials] = useState({ email: "", password: "" })
  return (

    <>

      {!getToken ?
        <section className="h-100 chat-background">
          <div className="container py-5 h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col">
                <div className="card card-registration my-4">
                  <div className="row g-0">
                    <div className="col-xl-6 d-none d-xl-block">
                      <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/img4.webp"
                        alt="Sample photo" className="img-fluid"
                        style={{ borderTopLeftRadius: ".25rem", borderBottomLeftRadius: ".25rem" }} />
                    </div>
                    <div className="col-xl-6">
                      <div className="card-body p-md-5 text-black">
                        <h1 className="registration-form-heading text-center text-underline"><u>Login Form</u></h1>
                        <form onSubmit={handlesubmit} className="login-form p-3">

                          <div className="form-outline mb-4">
                            <input type="email" className="form-control" name="email" value={credentials.email} onChange={onChanges} id="exampleInputEmail1" aria-describedby="emailHelp" />
                            <label className="form-label" htmlFor="form3Example8">Email</label>
                          </div>





                          <div className="form-outline mb-4">
                            <input type="password" className="form-control" name="password" value={credentials.password} onChange={onChanges} id="exampleInputPassword1" />
                            <label className="form-label" htmlFor="form3Example90">Password</label>
                          </div>

                          <div className="d-flex justify-content-center pt-3">
                            <button type="submit" className="submit-button btn btn-success mt-3">Login <AiOutlineLogin /></button>
                            <ToastContainer autoClose={1500} />
                          </div>
                        </form>
                      </div>
                      <div className="d-flex justify-content-around">
                        <Link className="mt-5 fs-3 color-red-100" to='/sendmail'>forgot password?</Link>
                        <Link className="mt-5 fs-3 color-red-100" to='/signup'>Register Here?</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        :
        <div>
          <h1>user already logged in</h1>
          <button className="btn btn-danger text-white mt-2" onClick={logout}>logout <AiOutlineLogout className="logoutIcon" /></button>
        </div>

      }
    </>
  )
}

export default Login