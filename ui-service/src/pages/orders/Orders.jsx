import React from 'react'
import "./orders.css";
import oneplus from "./oneplus.jpeg";
const Orders = () => {
  return (
    <div className="orders-page">
        <div className="order">
            <div className="product">
                <img src={oneplus} alt="Product" className="order-image" />
                <div className="order-info">
                    <h2 className="order-title">Product Name</h2>
                    <p className="order-description">Product Description</p>
                    <p className="order-description">Quantity : 1</p>
                    <span className="order-price">$99.99</span>
                </div>
            </div>
            <div className="order-details">
                <h2 className="order-title">Order Details:</h2>
                <p className="order-description">Order Status :</p>
                <p className="order-description">Date :</p>
                <p className="order-description">Payment Method :</p>
                <p className="order-description">Shipping Address :</p>
            </div>
        </div>
        <div className="transaction">
            <h2 className="order-title">Transaction Details:</h2>
            <div className="transaction-info">
                <span className="transaction-description">ID</span>
                <span className="transaction-description">Date</span>    
                <span className="transaction-description">Amount</span>
                <span className="transaction-description">Status</span>
                <span className="transaction-description">Payment Method</span>
            </div>
        </div>
    </div>
  )
}

export default Orders;
