import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import oneplus from './oneplus.jpeg';

const OrderDetails = () => {
  const { orderId } = useParams();
  const token = localStorage.getItem('token');

  const [orders, setOrders] = useState([]);
  const [productsMap, setProductsMap] = useState({});
  const [userAddresses, setUserAddresses] = useState({});

  const [order, setOrder] = useState(null);
  const [product, setProduct] = useState(null);
  const [address, setAddress] = useState(null);

  // Fetch all orders once
  useEffect(() => {
    fetch("http://localhost:8002/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error("Error fetching orders:", err));
  }, []);

  // Fetch product details for all orders
  useEffect(() => {
    if (orders.length > 0) {
      const fetchProductDetails = async () => {
        const map = {};
        for (const order of orders) {
          if (!map[order.product_id]) {
            try {
              const res = await fetch(`http://localhost:8000/products/${order.product_id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                }
              });
              if (res.ok) {
                const product = await res.json();
                map[order.product_id] = product;
              }
            } catch (err) {
              console.error(`Error fetching product ${order.product_id}:`, err);
            }
          }
        }
        setProductsMap(map);
      };

      fetchProductDetails();
    }
  }, [orders]);

  // Fetch current user (for address)
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("http://localhost:8001/users/me", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const user = await res.json();
          setUserAddresses({ [user.id]: user.addresses || [] });
        } else {
          console.error("Failed to fetch user info");
        }
      } catch (err) {
        console.error("Error fetching current user info:", err);
      }
    };

    if (token) fetchCurrentUser();
  }, [token]);

  // Set the specific order and product
  useEffect(() => {
    const foundOrder = orders.find((o) => o.order_id === parseInt(orderId));
    if (foundOrder) {
      setOrder(foundOrder);
      const product = productsMap[foundOrder.product_id];
      if (product) setProduct(product);
    }
  }, [orders, productsMap, orderId]);

  // Set the address (after userAddresses are loaded)
  useEffect(() => {
    if (Object.keys(userAddresses).length > 0) {
      const userId = Object.keys(userAddresses)[0];
      const addressList = userAddresses[userId];
      if (addressList && addressList.length > 0) {
        setAddress(addressList[0]);
      }
    }
  }, [userAddresses]);

  if (!order || !product) return <p>Loading order details...</p>;

  const totalPrice = product.price * order.quantity;
  const formattedAddress = address
    ? `${address.street}, ${address.city}, ${address.zip}`
    : "Address not available";

  return (
    <div className="orders-page">
      <h1 style={{ marginBottom: '20px', fontSize: '1.8rem' }}>
        Order ID: #{order.order_id}
      </h1>

      <div className="order">
        <div className="product">
          <img src={oneplus} alt="Product" className="order-image" />
          <div className="order-info">
            <h2 className="order-title">Product: {product.name}</h2>
            <p className="order-description">Quantity: {order.quantity}</p>
            <span className="order-price">Price per unit: ${product.price}</span><br />
            <span className="order-price">Total Price: ${totalPrice}</span>
          </div>
        </div>

        <div className="order-details">
          <h2 className="order-title">Order Details:</h2>
          <p className="order-description">Order Status: Confirmed</p>
          <p className="order-description">Payment Method: COD</p>
          <p className="order-description">Shipping Address: {formattedAddress}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
