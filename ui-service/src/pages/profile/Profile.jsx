import React, { useEffect, useState } from 'react';
import './profile.css';
import { ShoppingCartIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [editableDetails, setEditableDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

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
        setEditableDetails({
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone,
          addresses: response.data.addresses.map(addr => ({
            street: addr.street,
            city: addr.city,
            zip: addr.zip
          }))
        });
      } catch (err) {
        setError('Failed to fetch user details');
        console.error(err);
      }
    };

    fetchUserDetails();
  }, [token]);

  const handleChange = (e, index, field) => {
    if (field.startsWith("address")) {
      const [_, key] = field.split(".");
      const updated = [...editableDetails.addresses];
      updated[index][key] = e.target.value;
      setEditableDetails(prev => ({ ...prev, addresses: updated }));
    } else {
      setEditableDetails(prev => ({ ...prev, [field]: e.target.value }));
    }
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(
        `http://localhost:8001/users/${userDetails.id}`,
        {
          name: editableDetails.name,
          phone: editableDetails.phone,
          addresses: editableDetails.addresses,
          cart: []  // optional
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserDetails(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile", err);
      setError("Update failed");
    }
  };

  if (error) return <div>Error: {error}</div>;
  if (!userDetails || !editableDetails) return <div>Loading...</div>;

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1 className="profile-greeting">Hello, {userDetails.name}</h1>
        </div>

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

        <div className="profile-details-container">
          <h2 className="profile-section-title">USER DETAILS</h2>
          <div className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={editableDetails.name}
                  onChange={(e) => handleChange(e, null, "name")}
                  readOnly={!isEditing}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={editableDetails.email} readOnly />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={editableDetails.phone}
                  onChange={(e) => handleChange(e, null, "phone")}
                  readOnly={!isEditing}
                />
              </div>
            </div>

            {editableDetails.addresses.map((addr, index) => (
              <div className="form-row" key={index}>
                <div className="form-group">
                  <label>Street</label>
                  <input
                    type="text"
                    value={addr.street}
                    onChange={(e) => handleChange(e, index, "address.street")}
                    readOnly={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={addr.city}
                    onChange={(e) => handleChange(e, index, "address.city")}
                    readOnly={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>ZIP</label>
                  <input
                    type="text"
                    value={addr.zip}
                    onChange={(e) => handleChange(e, index, "address.zip")}
                    readOnly={!isEditing}
                  />
                </div>
              </div>
            ))}

            <div className="form-actions">
              {isEditing ? (
                <button className="profile-save-btn" onClick={handleSave}>Save Details</button>
              ) : (
                <button className="profile-edit-btn" onClick={() => setIsEditing(true)}>Edit Details</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
