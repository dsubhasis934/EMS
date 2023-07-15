import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUserEdit } from 'react-icons/fa'
import { GoSignIn } from 'react-icons/go'
import { AiOutlineLogin } from 'react-icons/ai'
import { login_sidebar_image, user_update, login_image, update_image } from '../images/Images';
function Signup() {
  const notify = () => toast.success("User Successfully Signin", { autoClose: 1200 });
  const notifyUpdate = () => toast.success("User Successfully Updated", { autoClose: 1200 });
  const navigate = useNavigate();
  const gettoken = localStorage.getItem("token");
  let { id } = useParams();




  const [checked, setChecked] = useState(!true);
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", user_type: "", secure_phase: "", image: "" })

  const handleSubmit = async (e) => {
    e.preventDefault();//whenever we submit any form it take 'get' method by default,so we called this functions for not take default value automaticslly.
    if (id == null) {
      const demoform = new FormData();
      demoform.append('name', credentials.name)
      demoform.append('email', credentials.email)
      demoform.append('password', credentials.password)
      demoform.append('user_type', credentials.user_type)
      demoform.append('secure_phase', credentials.secure_phase)
      demoform.append('image', credentials.image)
      await axios.post("http://localhost:3000/api/createuser", demoform)
        .then(resp => {
          const { success, message } = resp.data;
          if (success) {
            notify();
            setTimeout(() => {
              navigate('/login')
            }, 1500)
          } else {
            alert(message)
          }
        })
        .catch(cat => { alert(cat) })

      //trycode

      //  await axios.post("http://localhost:3000/api/createuser", credentials)
      //  .then(resp => {
      //    const { data,success, message} = data;
      //    if(success){
      //      alert(message);
      //    }else{
      //      alert("not success")
      //    }
      //  })
      //  .catch(cat=>{alert(cat)})


      //
    } else {
      const demoform = new FormData();
      demoform.append('name', credentials.name)
      demoform.append('email', credentials.email)
      demoform.append('password', credentials.password)
      demoform.append('user_type', credentials.user_type)
      demoform.append('secure_phase', credentials.secure_phase)
      demoform.append('image', credentials.image)
      await axios.patch(`http://localhost:3000/api/updateusers?id=${id}`, demoform, { headers: { Authorization: `Bearer ${gettoken}` } })
        .then(response => {
          console.log(response.data)
          const { success, message, data } = response.data;
          if (success) {
            notifyUpdate();
            setTimeout(() => {
              navigate('/showusers');
            }, 1500)
          } else {
            alert(message)
          }
        })


    }
  }

  const onChanges = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  }


  // useEffect(() => {
  //   console.log(credentials)
  // }, [credentials])
  const loadUserdata = async () => {
    await axios.get(`http://localhost:3000/api/fetchuser?id=${id}`)
      .then(response => {
        //console.log(response);
        const { data, message, success } = response.data;
        if (success) {
          setCredentials({
            name: data[0].name,
            email: data[0].email,
            secure_phase: data[0].secure_phase,
            user_type: data[0].user_type,
            image: data[0].image
          })
        }
      })
      .catch(error => { alert(error) })
  }

  useEffect(() => {
    console.log(id);
    id && loadUserdata();
    //updateuser();
  }, [])

  return (
    <section className="h-100 chat-background">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col">
            <div className="card card-registration my-4" id="card-registration">
              <div className="row g-0">
                <div className="col-xl-6 d-none d-xl-block">
                  <img src={!id ? login_image : update_image}
                    alt="Sample photo" className="img-fluid" style={{ borderTopLeftRadius: ".25rem", borderBottomLeftRadius: ".25rem", height: 800 }}
                  />
                </div>
                <div className="col-xl-6">
                  <div className="card-body p-md-5 text-black">
                    <h3 className="registration-form-heading text-center text-underline"><u>{!id ? "Register here" : "update here"}</u></h3>
                    <form onSubmit={handleSubmit} className="signup-form p-3">
                      <div className="row">
                        <div className="col-md-6 mb-4">
                          <div className="form-outline">
                            <input type="text" name="name" value={credentials.name} onChange={onChanges} className="form-control" id="exampleInputName1" aria-describedby="emailHelp" placeholder="Enter name" />
                            <label className="form-label" htmlFor="form3Example1m">Name</label>
                          </div>
                        </div>
                      </div>


                      <div className="form-outline mb-4">
                        <input type="email" disabled={!id ? "" : true} name="email" value={credentials.email} onChange={onChanges} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
                        <label className="form-label" htmlFor="form3Example8">Email</label>
                      </div>





                      <div className="form-outline mb-4" style={!id ? { "display": "block" } : { "display": "none" }}>
                        <input display="none" type={checked ? "text" : "password"} name="password" value={credentials.password} onChange={onChanges} className="form-control" id="exampleInputPassword1" placeholder="Password" />
                        <label className="form-label" htmlFor="form3Example90">Password</label>
                      </div>


                      {/* <div className="form-outline mb-4">
                        <input type="text" name="user_type" value={credentials.user_type} onChange={onChanges} className="form-control" id="exampleInputUsertype1" aria-describedby="emailHelp" placeholder="Enter your Designation" />
                        <label className="form-label" htmlFor="form3Example97">Designation</label>
                      </div> */}
                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="form3Example97">Designation</label>
                        <div className="radio-button" style={{ position: 'relative', left: '19px' }}>

                          <div>
                            <input
                              type="radio"
                              id="adminRadio"
                              name="user_type"
                              value="admin"
                              checked={credentials.user_type === "admin"}
                              onChange={onChanges}
                              className="form-check-input"
                            />
                            <label className="form-check-label" htmlFor="adminRadio">Admin</label>
                          </div>
                          <div>
                            <input
                              type="radio"
                              id="employeeRadio"
                              name="user_type"
                              value="employee"
                              checked={credentials.user_type === "employee"}
                              onChange={onChanges}
                              className="form-check-input"
                            />
                            <label className="form-check-label" htmlFor="employeeRadio">Employee</label>
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="exampleInputImage">Upload Image</label>
                        <img
                          src={
                            typeof credentials.image === "string" || !(credentials.image instanceof Blob)
                              ? `http://127.0.0.1:3000/images/${credentials.image}`
                              : URL.createObjectURL(credentials.image)
                          }
                          height={100}
                          width={150}
                          alt="upload"
                          onClick={() => document.getElementById("upload_img").click()}
                        />

                        {/* {credentials.image && typeof credentials.image !== "string" && (
                <button onClick={() => URL.revokeObjectURL(credentials.image)}>
                  Remove Image
                </button>
              )} */}
                        <input hidden type="file" name="image" id="upload_img" onChange={e => setCredentials(d => ({ ...d, image: e.target.files[0] }))} className="form-control" aria-describedby="emailHelp" placeholder="uplaod your image" />
                      </div>
                      <div className="form-group" style={!id ? { "display": "block" } : { "display": "none" }}>
                        <label htmlFor="exampleInputEmail1">Sequre Question</label>
                        <input type="text" name="secure_phase" value={credentials.secure_phase} onChange={onChanges} className="form-control" id="exampleInputSecurequestion1" aria-describedby="emailHelp" placeholder="Enter Your secure question" />
                      </div>
                      <div style={!id ? { "display": "block" } : { "display": "none" }} className="checkbox">
                        <input type="checkbox" checked={checked} onChange={() => setChecked((d) => !d)} />show password
                      </div>
                      <div className="d-flex justify-content-center pt-3">
                        {/* <button type="submit" className="btn btn-success m-3">{(id == null) ? "Sign In" : "Update"} {(id == null) ? <GoSignIn className="signinIcon fs-5" /> : <FaUserEdit className="updateIcon fs-5" />}</button> */}
                        {(id == null) ? <button type="submit" className="btn btn-success m-3">Sign In <GoSignIn className="signinIcon fs-5" /></button> : <button type="submit" className="btn m-3" style={{ backgroundColor: "#ffd700" }}>Update <FaUserEdit className="updateIcon fs-5" /></button>}
                        <Link to='/login' className="m-3 btn btn-primary" style={!id ? { "display": "block" } : { "display": "none" }}>Login <AiOutlineLogin /></Link>
                        {/* <ToastContainer autoClose={1500} /> */}
                      </div>
                      {/* <div className="d-flex justify-content-end pt-3">
                        <button type="submit" value={(id == null) ? "Signin" : "Update"} className="btn btn-success mt-2">{(id == null) ? <GoSignIn className="signinIcon fs-5" /> : <FaUserEdit className="updateIcon fs-5" />}</button>
                        <Link to='/login' className="m-3 btn btn-primary" style={!id ? { "display": "block" } : { "display": "none" }}>Login <AiOutlineLogin /></Link>
                        <ToastContainer autoClose={1500} />
                      </div> */}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Signup
