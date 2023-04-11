import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUserEdit } from 'react-icons/fa'
import { GoSignIn } from 'react-icons/go'
import { AiOutlineLogin } from 'react-icons/ai'
function Signup() {
  const notify = () => toast.success("User Successfully Signin");
  const notifyUpdate = () => toast.success("User Successfully Updated");
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
        console.log(response);
        const { data, message, success } = response.data;
        if (success) {
          setCredentials({
            name: data.name,
            email: data.email,
            secure_phase: data.secure_phase,
            user_type: data.user_type,
            image: data.image
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
    <section className="signup py-3 gradient-custom">
      <div className="signup container py-5 h-100">
        <h1 className="registration-form-heading text-underline"><u>{!id ? "Register here" : "update here"}</u></h1>
        <form onSubmit={handleSubmit} className="signup-form p-3">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" name="name" value={credentials.name} onChange={onChanges} className="form-control" id="exampleInputName1" aria-describedby="emailHelp" placeholder="Enter name" />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Email address</label>
            <input type="email" disabled={!id ? "" : "true"} name="email" value={credentials.email} onChange={onChanges} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
            <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
          </div>
          <div className="form-group" style={!id ? { "display": "block" } : { "display": "none" }}>
            <label htmlFor="exampleInputPassword1">Password</label>
            <input display="none" type={checked ? "text" : "password"} name="password" value={credentials.password} onChange={onChanges} className="form-control" id="exampleInputPassword1" placeholder="Password" />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">User Type</label>
            <input type="text" name="user_type" value={credentials.user_type} onChange={onChanges} className="form-control" id="exampleInputUsertype1" aria-describedby="emailHelp" placeholder="Enter your user type" />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputImage">Upload Image</label>
            <img
              src={
                typeof credentials.image === "string" || !(credentials.image instanceof Blob)
                  ? ""
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
          <button type="submit" value={(id == null) ? "Signin" : "Update"} className="btn btn-success mt-2">{(id == null) ? <GoSignIn className="signinIcon fs-5" /> : <FaUserEdit className="updateIcon fs-5" />}</button>
          <Link to='/login' className="m-3 btn btn-primary" style={!id ? { "display": "block" } : { "display": "none" }}>Login <AiOutlineLogin /></Link>
          <ToastContainer autoClose={1500} />
        </form>
        {/* <button type="submit" className="btn btn-success" onClick={updateuser}>updateuser</button> */}
      </div>
    </section>
  )
}

export default Signup
