import React, { useEffect, useState } from "react";
import "./checkout.css";
import { useLocation, useNavigate } from "react-router-dom";
import oneplus from "./oneplus.jpeg";
import axios from "axios";

const Checkout = () => {
  const [userData, setUserData] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [cartItems, setCartItems] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const productId = searchParams.get("id");
  const quantityParam = searchParams.get("qty");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    fetchUserData();

    if (productId) {
      // Buy Now flow
      fetchProduct(productId, parseInt(quantityParam) || 1);
    } else {
      // Cart checkout flow
      fetchCartItems();
    }
  }, [productId]);

  useEffect(() => {
  let total = 0;
  for (const item of cartItems) {
    const product = productDetails[item.product_id];
    if (product) {
      total += product.price * item.quantity;
    }
  }
  setTotalPrice(total);
}, [cartItems, productDetails]);

  const fetchUserData = async () => {
    try {
      const response = await fetch("http://localhost:8001/users/me", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      const addressString =
        data.addresses && data.addresses.length > 0
          ? `${data.addresses[0].street}, ${data.addresses[0].city}, ${data.addresses[0].zip}`
          : "";

      setUserData({
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: addressString,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchProduct = async (id, qty) => {
    try {
      const response = await fetch(`http://localhost:8000/products/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setCartItems([{ product_id: id, quantity: qty }]);
      setProductDetails({ [id]: data });
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const fetchCartItems = async () => {
    try {
      const res = await axios.get(`http://localhost:8002/cart/json?user_id=${userId}`);
      const items = res.data;
      setCartItems(items);
      const details = {};
      for (let item of items) {
        if (!details[item.product_id]) {
          const res = await axios.get(`http://localhost:8000/products/${item.product_id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          details[item.product_id] = res.data;
        }
      }
      setProductDetails(details);
    } catch (err) {
      console.error("Error fetching cart items:", err);
    }
  };

  const handlePlaceOrder = async () => {
  try {
    for (let item of cartItems) {
      const product = productDetails[item.product_id];
      const quantity = item.quantity;
      const totalAmount = product.price * quantity;

      if (product.stock < quantity) {
        alert(`Not enough stock for ${product.name}. Available: ${product.stock}`);
        return;
      }

      const orderRes = await axios.post("http://localhost:8002/orders", null, {
        params: {
          user_id: userData.id,
          product_id: item.product_id,
          quantity: quantity,
        },
      });

      const orderId = orderRes.data.order_id;

      const paymentRes = await axios.post("http://localhost:8006/payments/initiate", {
        orderId: orderId,
        userId: userData.id,
        amount: totalAmount,
        currency: "INR",
      });

      const shippingRes = await axios.post("http://localhost:8005/shipping", {
        orderId: orderId,
        userId: userData.id,
        address: userData.address,
      });

      const updatedStock = product.stock - quantity;

      await axios.put(
        `http://localhost:8000/products/${item.product_id}`,
        {
          name: product.name,
          price: product.price,
          stock: updatedStock,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (shippingRes.status === 200) {
        console.log(`Tracking ID: ${shippingRes.data.trackingId}`);
      } else {
        alert("Shipping failed for one item.");
      }
    }

    alert("All orders placed successfully!");
    navigate("/orders");

  } catch (err) {
    console.error("Checkout error:", err);
    alert("Something went wrong. Please try again.");
  }
};


  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1 className="checkout-title">Checkout</h1>
        <div className="checkout-content">
          <div className="checkout-form">
            <div className="form-section">
              <h2 className="section-title">Delivery Information</h2>
              <div className="form-group"><label>Full Name</label><input type="text" value={userData.name} readOnly /></div>
              <div className="form-group"><label>Address</label><input type="text" value={userData.address} readOnly /></div>
              <div className="form-group"><label>Phone Number</label><input type="tel" value={userData.phone} readOnly /></div>
              <div className="form-group"><label>Email</label><input type="email" value={userData.email} readOnly /></div>
            </div>
            <div><button className="btn" onClick={handlePlaceOrder}>Place Order</button></div>
          </div>

          <div className="order-summary">
            <h2 className="section-title">Order Summary</h2>
            {cartItems.length === 0 ? (
              <p>No items to checkout</p>
            ) : (
              cartItems.map((item, index) => {
                const product = productDetails[item.product_id];
                return (
                  product && (
                    <div className="product-review" key={index}>
                      <img src={oneplus} alt="Product" className="product-image" />
                      <div className="product-details">
                        <h3>{product.name}</h3>
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: ₹{product.price}</p>
                      </div>
                      <div className="product-price">
                        ₹{(product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  )
                );
              })
            )}
                      <div >
                      <hr />
                      <h3 className="order-total">Total: ₹{totalPrice.toFixed(2)}</h3>
                      </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
