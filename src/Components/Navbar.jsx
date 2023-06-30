import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
function Navbar() {
    const token = localStorage.getItem('token');
    return (
        <>
            <div class="navbar navbar-default">
                <div class="navbar-inner">
                    <div class="container">
                        <Link class="brand" style={{ margin: 0, float: "none" }} to="/">
                            <p>Employee Management System</p></Link>

                        {/* <div className="logout" style={{ display: !token ? 'none' : 'block' }}>
                            <button>Logout</button>
                        </div> */}
                    </div>
                </div>
            </div >

        </>
    )
}

export default Navbar
