import "./signup.css";
import React from 'react';

const Signup = () => {
    return (
        <div className="signup-page">
            <div className="signup-card">
                <input type="text" placeholder="Username" className="signup-input"/>
                <input type="text" placeholder="Password" className="signup-input"/>
                <input type="text" placeholder="Re-enter Password" className="signup-input"/>
                <input type="text" placeholder="Email" className="signup-input"/>
                <input type="text" placeholder="Phone Number" className="signup-input"/>
                <input type="text" placeholder="Address" className="signup-input1"/>
                <div className="signup-input2">
                <input type="checkbox" className="signup-checkbox"/>
                <label className="signup-checkbox-label" htmlFor="terms-checkbox">
                    I agree to the terms and conditions
                </label>
                </div>
                <button className="signup-button">SignUp</button>
            </div>
        </div>
    );
}

export default Signup;