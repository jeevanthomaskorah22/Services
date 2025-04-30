import React from 'react';
import "./navbar.css";
import Search from './search.jpeg';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    return(
        <div className="navbar-container">
            <div className="navbar">
                <Link to="/home" style={{textDecoration: "none"}}><div className="logo">ShopName</div></Link>
                <div className="search-bar">
                    <img src={Search} alt="Search" className="search-icon" /> 
                    <input type="text" placeholder="Search" className="search-input" />
                </div>
                <Link to="/user-profile" style={{textDecoration: "none"}}><div className="entries"> Profile</div></Link>
                <div className="entries"> Products</div>
                <Link to="/cart" style={{textDecoration: "none"}}><div className="entries"> Cart</div></Link>
                <div className="entries"> More</div>
            </div>
        </div>
    );
}
export default Navbar;