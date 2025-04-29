import "./home.css";
import { useState } from "react";
import Phone from './phone-tablet.jpeg';
import Laptop from './laptop.jpeg';
import Fashion from './Fashion.jpeg';
import furniture from './furniture.jpeg';
import sports from './sports.jpeg';
import food from './food.jpeg';

const Home = () => {
  const [showMore, setShowMore] = useState(false);

  const handleToggle = () => setShowMore(prev => !prev);

  return (
    <div className="home-page">
      <div className="new-style">
        <h1>Discover New Styles!!</h1>
        <p>Explore latest trends and shop now</p>
        <button className="btn">Shop Now</button>
      </div>

      <div className="category">
        <h1>Explore Categories</h1>

        <div className="category-list">
          <div className="category-item">
            <img src={Phone} alt="Phone" className="category-image" />
            <span className="category-title">Phones & Tablets</span>
          </div>

          <div className="category-item">
            <img src={Laptop} alt="Laptop" className="category-image" />
            <span className="category-title">Laptops</span>
          </div>

          <div className="category-item">
            <img src={Fashion} alt="Fashion" className="category-image1" />
            <span className="category-title">Fashion & Beauty</span>
          </div>

          <div className="category-item">
            <img src={furniture} alt="furniture" className="category-image1" />
            <span className="category-title">Furniture</span>
          </div>
          
          <div className="category-item">
            <img src={sports} alt="sports & fitness" className="category-image1" />
            <span className="category-title">Sports & Fitness</span>
          </div>
        </div>

        {showMore && (
          <div className="category-list">
            <div className="category-item">
              <img src={food} alt="Food & Groceries" className="category-image" />
              <span className="category-title">Food & Groceries</span>
            </div>
          </div>
        )}

        <button className="btn" onClick={handleToggle}>
          {showMore ? "Show Less" : "Show More"}
        </button>
      </div>

      <div className="featured">
        <h1>Featured Products</h1>
        
        <div className="featured-list">
          <div className="featured-item">
            <img src={Phone} alt="Phone" className="category-image" />
            <span className="category-title">Phones & Tablets</span>
            <button className="btn1">View</button>
          </div>

          <div className="featured-item">
            <img src={Laptop} alt="Laptop" className="category-image" />
            <span className="category-title">Laptops</span>
            <button className="btn1">View</button>
          </div>

          <div className="featured-item">
            <img src={Fashion} alt="Fashion" className="category-image1" />
            <span className="category-title">Fashion & Beauty</span>
            <button className="btn1">View</button>
          </div>
          
          <div className="featured-item">
            <img src={furniture} alt="furniture" className="category-image1" />
            <span className="category-title">Furniture</span>
            <button className="btn1">View</button>
          </div>

          <div className="featured-item">
            <img src={sports} alt="sports & fitness" className="category-image1" />
            <span className="category-title">Sports & Fitness</span>
            <button className="btn1">View</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
