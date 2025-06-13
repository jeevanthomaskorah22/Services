import React, { useEffect, useState } from 'react';
import './profile.css';
import { ShoppingCartIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");  // Assuming token is stored in localStorage

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.post(
          'http://localhost:8001/users/me',
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserDetails(response.data);
      } catch (err) {
        setError('Failed to fetch user details');
        console.error(err);
      }
    };

    fetchUserDetails();
  }, [token]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header Section */}
        <div className="profile-header">
          <h1 className="profile-greeting">Hello, {userDetails.name}</h1>
          <button className="profile-logout-btn">Log Out</button>
        </div>

        {/* Quick Actions */}
        <div className="profile-actions">
          <Link to="/cart" className="profile-action-btn">
            <ShoppingCartIcon className="profile-action-icon" />
            <span>Your Cart</span>
          </Link>
          <Link to="/orders" className="profile-action-btn">
            <ArchiveBoxIcon className="profile-action-icon" />
            <span>Your Orders</span>
          </Link>
        </div>

        {/* User Details Form */}
        <div className="profile-details-container">
          <h2 className="profile-section-title">USER DETAILS</h2>
          <div className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label>Username</label>
                <input type="text" value={userDetails.name} readOnly />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={userDetails.email} readOnly />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Password</label>
                <input type="password" placeholder="Enter your password" />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" value={userDetails.phone} readOnly />
              </div>
            </div>
            <div className="form-group full-width">
              <label>Address</label>
                <textarea
                  placeholder="Enter your full address"
                  value={userDetails.addresses
                  .map(addr => `${addr.street}, ${addr.city}, ${addr.zip}`)
                  .join('\n')}
                  readOnly
                />
            </div>
            <button className="profile-save-btn">Save Details</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
