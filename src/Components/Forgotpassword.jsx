import axios from 'axios'
import React, { useState } from 'react'
import { FaUserEdit } from 'react-icons/fa'
function Forgotpassword() {
    const [values, setValues] = useState({ email: "", secure_phase: "", reset_password: "", confirm_password: "" })
    const formSubmit = async (e) => {
        e.preventDefault();
        await axios.post("http://localhost:3000/api/forgotpassword", values)
            .then(res => {
                //console.log(res);
                const { success, message } = res.data;
                if (success) {
                    alert(message);
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
            <section className="signup py-3 gradient-custom">
                <div className="signup container py-5 h-100">
                    <h1>change your password here</h1>
                    <form onSubmit={formSubmit} className="signup-form p-3">
                        <div className="change-password form-group">
                            <label to="exampleInputEmail1">Email address</label>
                            <input name="email" type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" value={values.email} onChange={valueChanges} />

                        </div>
                        <div className="change-password form-group">
                            <label to="exampleInputsecurePassword">Your Secure question</label>
                            <input name="secure_phase" type="text" className="form-control" id="exampleInputSecurePhase" aria-describedby="emailHelp" placeholder="Your secure question" value={values.secure_phase} onChange={valueChanges} />

                        </div>
                        <div className="change-password form-group">
                            <label to="exampleInputPassword1">New Password</label>
                            <input name="reset_password" type="password" className="form-control" id="exampleInputPassword1" placeholder="enter your New Password" value={values.reset_password} onChange={valueChanges} />
                        </div>
                        <div className="change-password form-group">
                            <label to="exampleInputPassword1">Confirm New Password</label>
                            <input name="confirm_password" type="password" className="form-control" id="exampleInputConfirmPassword1" placeholder="Confirm your Password" value={values.confirm_password} onChange={valueChanges} />
                        </div>

                        <button type="submit" className=" mt-3 btn btn-primary">update <FaUserEdit className="updateIcon fs-5" /></button>
                    </form>
                </div>
            </section>
        </>
    )
}

export default Forgotpassword
