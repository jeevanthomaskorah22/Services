import React from 'react'
import "./product-detail.css";
import oneplus from './oneplus.jpeg';
import {Link} from 'react-router-dom';
const ProductDetail = () => {
  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <img src={oneplus} alt="Product" className="product-detail-image" />
        <div className="product-detail-info">
          <h1 className="product-detail-title">Product Name</h1>
          <p className="product-detail-description">Product Description</p>
          <p className="product-detail-description">Quantity : 1</p>
          <span className="product-detail-price">$99.99</span>
          <div className="buttons">
            <button className="btn">Add to Cart</button>
            <Link to="/cart" style={{textDecoration: "none"}}><button className="btn">Go to Cart</button></Link>
          </div>
          <div className="buttons">
            <button className="btn3">Buy Now</button>
          </div>
        </div>
      </div>
      
      <div className="product-detail-footer">
        <div className="highlights">
          <h2>Highlights</h2>
          <ul>
            <li>6.7" AMOLED Display with 120Hz refresh rate</li>
            <li>Snapdragon 8 Gen 2 Processor</li>
            <li>5000mAh Battery with 100W SuperVOOC Charging</li>
            <li>50MP Triple Rear Camera Setup</li>
            <li>OxygenOS based on Android 14</li>
          </ul>
        </div>

        <div className="reviews">
          <h2>Customer Reviews</h2>
            <div className="review-item">
            <strong>Ravi S.</strong>
            <p>Absolutely amazing performance and display quality. Super fast charging is a blessing.</p>
            </div>
            <div className="review-item">
            <strong>Meena K.</strong>
            <p>Camera is top-notch. Premium feel in hand. Definitely a flagship killer.</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ProductDetail;
