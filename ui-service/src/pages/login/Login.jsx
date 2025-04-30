import React from 'react';
import "./login.css";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {

    const navigate = useNavigate();

    const handleSignIn = () => {
        navigate("/home");
    }
    return(
        <div className="login-page">

            <div className="login-card">
                <input type="text" placeholder="Email" className="login-input" />
                <input type="password" placeholder="Password" className="login-input" />
                <button className="login-button" onClick={handleSignIn}>Sign-In</button>
                <div className="login-footer">
                    <Link className="footer-text" navigate to="/reset-password" textDecoration="none">Forget Password?</Link>
                    <Link className="footer-text" navigate to="/signup" textDecoration="none">SignUp</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;