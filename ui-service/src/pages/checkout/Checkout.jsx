import React, { useEffect, useState } from "react";
import "./checkout.css";
import { useLocation,useNavigate } from "react-router-dom";
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

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1); 
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const productId = searchParams.get("id");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:8001/users/me", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch user data");

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

    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8000/products/${productId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch product");

        const productData = await response.json();
        setProduct(productData);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    if (productId) {
      fetchUserData();
      fetchProduct();
    }
  }, [productId]);

  const handlePlaceOrder = async () => {
  try {
    const totalAmount = product.price * quantity;

    // Step 1: Create Order
    const orderResponse = await axios.post("http://localhost:8002/orders", null, {
      params: {
        user_id: userData.id,
        product_id: productId,
        quantity: quantity,
      },
    });

    if (orderResponse.status !== 200) {
      alert("Order placement failed.");
      return;
    }

    const orderId = orderResponse.data.order_id;
    console.log("Order created:", orderId);

    // Step 2: Initiate Payment
    const paymentResponse = await axios.post("http://localhost:8006/payments/initiate", {
      orderId: orderId,
      userId: userData.id,
      amount: totalAmount,
      currency: "INR",
    });

    if (paymentResponse.status !== 200) {
      alert("Payment initiation failed.");
      return;
    }

    const { paymentId, gatewayPaymentUrl } = paymentResponse.data;
    console.log("Payment initiated:", paymentId);
    console.log("Gateway URL:", gatewayPaymentUrl);

    // Step 3: Create Shipping Entry
    const shippingResponse = await axios.post("http://localhost:8005/shipping", {
      orderId: orderId,
      userId: userData.id,
      address: userData.address,
    });

    if (shippingResponse.status === 200) {
      alert(`Order Placed! Tracking ID: ${shippingResponse.data.trackingId}`);
    } else {
      alert("Shipping creation failed.");
      return;
    }

    navigate("/orders");

  } catch (error) {
    console.error("Error in checkout flow:", error);
    alert("Something went wrong during the checkout process. Please try again.");
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
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" value={userData.name} readOnly />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input type="text" value={userData.address} readOnly />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" value={userData.phone} readOnly />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={userData.email} readOnly />
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                />
              </div>
            </div>
            <div>
              <button className="btn" onClick={handlePlaceOrder}>Place Order</button>
            </div>
          </div>

          <div className="order-summary">
            <h2 className="section-title">Order Summary</h2>

            {product ? (
              <>
                <div className="product-review">
                  <img src={oneplus} alt="Product" className="product-image" />
                  <div className="product-details">
                    <h3>{product.name}</h3>
                    <p>Color: Morning Mist</p>
                    <p>Storage: 256GB</p>
                    <p>Quantity: {quantity}</p>
                  </div>
                  <div className="product-price">
                    ${(product.price * quantity).toFixed(2)}
                  </div>
                </div>

                <div className="summary-details">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>${(product.price * quantity).toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span>FREE</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total</span>
                    <span>${(product.price * quantity).toFixed(2)}</span>
                  </div>
                </div>
              </>
            ) : (
              <p>Loading product...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
