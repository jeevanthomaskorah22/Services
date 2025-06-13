import React, { useState } from 'react';
import "./login.css";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = async () => {
        const formData = new URLSearchParams();
        formData.append('username', email);  // FastAPI expects 'username'
        formData.append('password', password);

        try {
            const response = await fetch('http://localhost:8001/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(errorData.detail || "Login failed");
                return;
            }

            const data = await response.json();
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user)); 

            navigate("/home");
        } catch (error) {
            console.error("Login error:", error);
            alert("An error occurred while logging in.");
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <input
                    type="text"
                    placeholder="Email"
                    className="login-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="login-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="login-button" onClick={handleSignIn}>
                    Sign-In
                </button>
                <div className="login-footer">
                    <Link className="footer-text" to="/reset-password">Forget Password?</Link>
                    <Link className="footer-text" to="/signup">SignUp</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
