import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
function Navbar() {
    return (
        <>
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header d-flex justify-content-center">
                        <a className="navbar-brand align-items-center" href="/">
                            Employeee Management System
                        </a>
                    </div>
                    {/* {isLoggedIn && getToken ? (
                        <button onClick={onLogout}>Logout</button>
                    ) : (
                        <button onClick={onLogin}>Login</button>
                    )} */}
                </div>
            </nav>

        </>
    )
}

export default Navbar
