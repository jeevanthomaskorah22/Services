import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Profile from "./pages/profile/Profile";
import Cart from "./pages/cart/Cart";
import ProductDetail from "./pages/product-detail/ProductDetail";
import Products from "./pages/products/Products";
import Orders from "./pages/orders/Orders";
import Checkout from "./pages/checkout/Checkout";
import OrderDetails from "./pages/order-detail/OrderDetails";

const AppContent = () => {
  const location = useLocation();

  const noNavbarRoutes = ['/login', '/signup'];

  const hideNavbar = noNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/user-profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product-detail/:id" element={<ProductDetail />} />
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders/:orderId" element={<OrderDetails />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
