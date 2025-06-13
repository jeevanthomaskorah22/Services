import React, { useEffect, useState } from 'react';
import './cart.css';
import oneplus from './oneplus.jpeg';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [productDetails, setProductDetails] = useState({});
    const [total, setTotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [finalTotal, setFinalTotal] = useState(0);

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    const userId = user?.id;

    useEffect(() => {
        if (userId) {
            fetchCartItems();
        }
    }, [userId]);

    const fetchCartItems = async () => {
        try {
            const res = await axios.get(`http://localhost:8002/cart/json?user_id=${userId}`);
            setCartItems(res.data);
            fetchProductDetails(res.data); 
        } catch (err) {
            console.error('Error fetching cart items:', err);
        }
    };

    const fetchProductDetails = async (items) => {
        const details = {};
        try {
            for (let item of items) {
                const productId = item.product_id;
                if (!details[productId]) {
                    const res = await axios.get(`http://localhost:8000/products/${productId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    details[productId] = res.data;
                }
            }
            setProductDetails(details);
            calculateTotals(items, details);
        } catch (err) {
            console.error('Failed to fetch product details', err);
        }
    };

    const calculateTotals = (items, details) => {
        let totalAmount = 0;
        for (let item of items) {
            const product = details[item.product_id];
            if (product) {
                totalAmount += product.price * item.quantity;
            }
        }
        const discountAmount = 0.00;
        const final = totalAmount - discountAmount;

        setTotal(parseFloat(totalAmount.toFixed(2)));
        setDiscount(parseFloat(discountAmount.toFixed(2)));
        setFinalTotal(parseFloat(final.toFixed(2)));
    };

    const removeFromCart = async (cartItemId) => {
        try {
            await axios.post(
                'http://localhost:8002/cart/remove',
                new URLSearchParams({ cart_item_id: cartItemId, user_id: userId }),
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            );
            fetchCartItems();
        } catch (err) {
            console.error('Error removing item:', err);
        }
    };

    const proceedToCheckout = () => {
        navigate("/checkout");
    };

    const continueShopping = () => {
        navigate("/home");
    };

    return (
        <div className="cart-page">
            <div className="cart-container">
                <div className="cart-title">Your Cart</div>
                {cartItems.length === 0 ? (
                    <div>No items in cart</div>
                ) : (
                    cartItems.map((item) => {
                        const product = productDetails[item.product_id];
                        return (
                            <div className="cart-item" key={item.id}>
                                <img src={oneplus} alt="Product" className="cart-item-image" />
                                <div className="cart-item-details">
                                    <span className="cart-item-name">
                                        {product ? product.name : `Product ID: ${item.product_id}`}
                                    </span>
                                    <span className="cart-item-price">
                                        ₹ {product ? product.price : 'XXXX'}
                                    </span>
                                    <span className="cart-item-quantity">Qty: {item.quantity}</span>
                                    <button className="btn" onClick={() => removeFromCart(item.id)}>Remove</button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
            <div className="cart-total">
                <div className="cart-total-summary">
                    <span className="cart-total-order-summary">Order Summary</span>
                    <span className="cart-total-title">Total: ₹ {total}</span>
                    <span className="cart-total-quantity">Discount: ₹ {discount}</span>
                    <span className="cart-total-price">Final: ₹ {finalTotal}</span>
                </div>
                <div className="options">
                    <button className="btn" onClick={proceedToCheckout}>Proceed to Checkout</button>
                    <button className="btn" onClick={continueShopping}>Continue Shopping</button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
