// Account.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Account.css'; // We'll create custom styles for dark and light themes

const Account = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [billingDetails, setBillingDetails] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      // Fetch user profile, orders, and billing details from backend
      fetchUserProfile();
      fetchOrderHistory();
      fetchBillingDetails();
    }
  }, [navigate]);

  const fetchUserProfile = async () => {
    // Simulate fetching user data
    const userProfile = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      profilePicture: '/path/to/profile-pic.jpg', // Update accordingly
    };
    setUser(userProfile);
  };

  const fetchOrderHistory = async () => {
    // Simulate fetching order history
    const orderHistory = [
      { id: 1, item: 'Pizza', date: '2023-10-10', amount: '$15.00' },
      { id: 2, item: 'Burger', date: '2023-10-12', amount: '$10.00' },
    ];
    setOrders(orderHistory);
  };

  const fetchBillingDetails = async () => {
    // Simulate fetching billing details
    const billing = {
      cardNumber: '**** **** **** 1234',
      billingAddress: '1234 Street, City, Country',
    };
    setBillingDetails(billing);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleUpdateProfile = () => {
    // Handle profile update logic
  };

  const handleChangePassword = () => {
    // Handle password change logic
  };

  return (
    <div className={`container mt-5 account-page ${isDarkMode ? 'dark-theme' : ''}`}>
      <h2>Account Information</h2>

      {/* Profile Information */}
      {user && (
        <div className="profile-section">
          <img src={user.profilePicture} alt="Profile" className="profile-pic" />
          <h3>{user.name}</h3>
          <p>Email: {user.email}</p>
        </div>
      )}

      {/* Account Actions */}
      <div className="account-actions">
        <button className="btn btn-primary" onClick={handleUpdateProfile}>
          Update Profile
        </button>
        <button className="btn btn-secondary" onClick={handleChangePassword}>
          Change Password
        </button>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Order History */}
      <div className="order-history mt-5">
        <h3>Order History</h3>
        {orders.length > 0 ? (
          <ul className="list-group">
            {orders.map(order => (
              <li key={order.id} className="list-group-item">
                {order.item} - {order.date} - {order.amount}
              </li>
            ))}
          </ul>
        ) : (
          <p>No orders yet.</p>
        )}
      </div>

      {/* Billing Details */}
      <div className="billing-details mt-5">
        <h3>Billing Details</h3>
        <p>Card Number: {billingDetails.cardNumber}</p>
        <p>Billing Address: {billingDetails.billingAddress}</p>
      </div>
    </div>
  );
};

export default Account;
