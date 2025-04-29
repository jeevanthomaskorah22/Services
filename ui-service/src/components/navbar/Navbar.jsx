import React from 'react';
import "./navbar.css";
import Search from './search.jpeg';

const Navbar = () => {
    return(
        <div className="navbar-container">
            <div className="navbar">
                <div className="logo">ShopName</div>
                <div className="search-bar">
                    <img src={Search} alt="Search" className="search-icon" /> 
                    <input type="text" placeholder="Search" className="search-input" />
                </div>
                <div className="entries"> Login</div>
                <div className="entries"> Products</div>
                <div className="entries"> My Cart</div>
                <div className="entries"> More</div>
            </div>
        </div>
    );
}
export default Navbar;