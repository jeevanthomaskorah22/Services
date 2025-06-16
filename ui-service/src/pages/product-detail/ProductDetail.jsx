import React, { useEffect, useState } from 'react';
import "./product-detail.css";
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import oneplus from "./oneplus.jpeg";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token missing");
        return;
      }

      try {
        const res = await axios.get(`http://localhost:8000/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const userId = user?.id;

  if (!userId) {
    alert("Please log in to add items to the cart.");
    return;
  }

  if (!product) {
    alert("Product data not loaded.");
    return;
  }

  const formData = new FormData();
  formData.append("user_id", userId);
  formData.append("product_id", product.id);
  formData.append("quantity", quantity);

  try {
    const res = await fetch("http://localhost:8002/cart", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Server error response:", text);
      throw new Error(`Server error: ${res.status}`);
    }

    const result = await res.json();
    alert(result.message || "Added to cart");
  } catch (error) {
    console.error("Error adding to cart:", error.message);
    alert("Failed to add product to cart.");
  }
};


  if (!product) return <div>Loading...</div>;

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <img src={oneplus} alt={product.name} className="product-detail-image" />
        <div className="product-detail-info">
          <h1 className="product-detail-title">{product.name}</h1>
          <span className="product-detail-price">${product.price}</span>
          <p className="product-detail-stock">Stock: {product.stock}</p>

          <label htmlFor="quantity">Quantity: </label>
          <input
            type="number"
            id="quantity"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
          />

          <div className="buttons">
            <button className="btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
            
            <Link to={`/checkout?id=${product.id}&qty=${quantity}`} style={{ textDecoration: 'none' }}>
              <button className="btn">Buy Now</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
