import "./signup.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        rePassword: "",
        email: "",
        phone: "",
        street: "",
        city: "",
        zip: "",
        agree: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.agree) {
            alert("Please agree to the terms and conditions.");
            return;
        }

        if (formData.password !== formData.rePassword) {
            alert("Passwords do not match!");
            return;
        }

        const payload = {
            name: formData.username,
            password: formData.password,
            email: formData.email,
            phone: formData.phone,
            addresses: [
                {
                    street: formData.street,
                    city: formData.city,
                    zip: formData.zip,
                }
            ],
        };

        try {
            const response = await axios.post("http://localhost:8001/users/signup", payload);
            alert("Signup successful!");
            console.log(response.data);
            navigate("/login");
        } catch (error) {
            console.error(error);
            alert("Signup failed: " + (error.response?.data?.detail || error.message));
        }
    };

    return (
        <div className="signup-page">
            <form className="signup-card" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    className="signup-input"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="signup-input"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="rePassword"
                    placeholder="Re-enter Password"
                    className="signup-input"
                    value={formData.rePassword}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="signup-input"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    className="signup-input"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="street"
                    placeholder="Street"
                    className="signup-input"
                    value={formData.street}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="city"
                    placeholder="City"
                    className="signup-input"
                    value={formData.city}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="zip"
                    placeholder="ZIP Code"
                    className="signup-input"
                    value={formData.zip}
                    onChange={handleChange}
                    required
                />
                <div className="signup-input2">
                    <input
                        type="checkbox"
                        name="agree"
                        className="signup-checkbox"
                        checked={formData.agree}
                        onChange={handleChange}
                    />
                    <label className="signup-checkbox-label" htmlFor="terms-checkbox">
                        I agree to the terms and conditions
                    </label>
                </div>
                <button type="submit" className="signup-button">
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default Signup;
