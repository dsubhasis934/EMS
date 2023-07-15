import axios from 'axios';
import React, { useState } from 'react'
import { AiOutlineLogin } from 'react-icons/ai'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function Sendemail() {
    const notify = (receivedMessage) => toast.success(receivedMessage, { autoClose: 1200 });
    const [credentials, setCredentials] = useState({ email: "" });
    const onChanges = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3000/api/sendlink', credentials)
            .then(resp => {
                const { success, message } = resp.data;
                if (success) {
                    notify(message);
                } else {
                    alert(message);
                }

            });
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
                                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/img4.webp"
                                            alt="Sample photo" className="img-fluid"
                                            style={{ borderTopLeftRadius: ".25rem", borderBottomLeftRadius: ".25rem" }} />
                                    </div>
                                    <div className="col-xl-6">
                                        <div className="card-body p-md-5 text-black">
                                            <h1 className="registration-form-heading text-center text-underline"><u>Enter your Email</u></h1>
                                            <form onSubmit={handleSubmit} className="login-form p-3">

                                                <div className="form-outline mb-4">
                                                    <input type="email" className="form-control" name="email" value={credentials.email} onChange={onChanges} id="exampleInputEmail1" aria-describedby="emailHelp" />
                                                    <label className="form-label" htmlFor="form3Example8">Email</label>
                                                </div>


                                                <div className="d-flex justify-content-center pt-3">
                                                    <button type="submit" className="submit-button btn btn-success mt-3">Submit <AiOutlineLogin /></button>
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

export default Sendemail
