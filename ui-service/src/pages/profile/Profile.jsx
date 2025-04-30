import React from 'react'
import './profile.css';
import {ShoppingCartIcon} from '@heroicons/react/24/outline';
import { ArchiveBoxIcon } from '@heroicons/react/24/outline';
import {Link} from 'react-router-dom';

const Profile = () => {
  return (
    <div className="profile-page">
        <div className="user">
            <div className="user-name">Hello, UserName</div>
            <button className="btn">Log Out</button>
        </div>
        <div className="cart-order">
            <Link to="/cart" style={{textDecoration: "none"}}><button className="btn2">
                <div>Your Cart</div>
                <ShoppingCartIcon className="cart-icon"/>    
            </button></Link>
            <button className="btn2">
                <div>Your Orders</div>
                <ArchiveBoxIcon className="cart-icon"/>
            </button>
        </div>
        
        <div className="container">
        <span className="details">User Details</span>
            <div className="user-details">
                <input type="text" placeholder="Username" className="user-input" />
                <input type="password" placeholder="Password" className="user-input" />
                <input type="text" placeholder="Email" className="user-input" />
                <input type="text" placeholder="Phone Number" className="user-input" />
                <input type="text" placeholder="Address" className="user-input1" />
            </div>
            <button className="btn">Save Details</button>
        </div>
    </div>
  )
}

export default Profile;
