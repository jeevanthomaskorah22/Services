import React from 'react'
import './cart.css';
import dress from './dress.jpeg';
const Cart = () => {
  return (
    <div className="cart-page">
        <div className="cart-container">
            <div className="cart-title">Your Cart</div>
            <div className="cart-item">
                <img src={dress} alt="Product" className="cart-item-image"/>
                <div className="cart-item-details">
                    <span className="cart-item-name">Product Name</span>
                    <span className="cart-item-price">Price</span>
                    <span className="cart-item-quantity">Quantity</span>
                </div>
            </div>
        </div>
        <div className="cart-total">
            <div className="cart-total-summary">
                <span className="cart-total-order-summary">Order Summary</span>
                <span className="cart-total-title">Total</span>
                <span className="cart-total-quantity">Discount</span>
                <span className="cart-total-price">Total Price</span>
            </div>
            <div className="options">
                <button className="btn">Proceed to Checkout</button>
                <button className="btn">Continue Shopping</button>
            </div>
        </div>
    </div>
  )
}

export default Cart;
