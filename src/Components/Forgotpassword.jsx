import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaUserEdit } from 'react-icons/fa'
import { user_update } from '../images/Images'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function Forgotpassword() {
    const navigate = useNavigate();
    const notify = () => toast.success("Sucessfully changed password", { autoClose: 1200 });
    const [values, setValues] = useState({ email: "", secure_phase: "", reset_password: "", confirm_password: "" })
    const formSubmit = async (e) => {
        e.preventDefault();
        await axios.post("http://localhost:3000/api/forgotpassword", values)
            .then(res => {
                //console.log(res);
                const { success, message } = res.data;
                if (success) {
                    notify();
                    setTimeout(() => {
                        navigate('/login')
                    }, 1500)
                } else {
                    alert(message);
                }
            })
            .catch(err => { alert(err) });
    }
    const valueChanges = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value })
    }
    return (
        <>
            <section className="h-100 chat-background">
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col">
                            <div className="card card-registration my-4" id="card-registration">
                                <div className="row g-0">
                                    <div className="col-xl-6 d-none d-xl-block">
                                        <img src={user_update}
                                            alt="Sample photo" className="img-fluid" style={{ borderTopLeftRadius: ".25rem", borderBottomLeftRadius: ".25rem", height: 800 }}
                                        />
                                    </div>
                                    <div className="col-xl-6">
                                        <div className="card-body p-md-5 text-black">
                                            <h1><u>change your password here</u></h1>
                                            <form onSubmit={formSubmit} className="signup-form p-3">

                                                <div className="form-outline mb-4">
                                                    <input name="email" type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" value={values.email} onChange={valueChanges} />
                                                    <label className="form-label" htmlFor="form3Example8">Email</label>
                                                </div>





                                                <div className="form-outline mb-4">
                                                    <input name="reset_password" type="password" className="form-control" id="exampleInputPassword1" placeholder="enter your New Password" value={values.reset_password} onChange={valueChanges} />
                                                    <label className="form-label" htmlFor="form3Example90">Reset Password</label>
                                                </div>

                                                <div className="form-outline mb-4">
                                                    <input name="confirm_password" type="password" className="form-control" id="exampleInputConfirmPassword1" placeholder="Confirm your Password" value={values.confirm_password} onChange={valueChanges} />
                                                    <label className="form-label" htmlFor="form3Example90">Confirmed Password</label>
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="exampleInputEmail1">Sequre Question</label>
                                                    <input name="secure_phase" type="text" className="form-control" id="exampleInputSecurePhase" aria-describedby="emailHelp" placeholder="Your secure question" value={values.secure_phase} onChange={valueChanges} />
                                                </div>

                                                <div className="d-flex justify-content-center pt-3">
                                                    <button type="submit" className=" mt-3 btn btn-primary">update <FaUserEdit className="updateIcon fs-5" /></button>
                                                    {/* <ToastContainer autoClose={1500} /> */}
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Forgotpassword
