import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./NavBar.scss";
import { useCart } from "../../context/CartContext";
import profileIcon from "../../assets/icons/profile.svg";
import homeIcon from "../../assets/icons/home.svg";
import cakeIcon from "../../assets/icons/cake.svg";
import addProductIcon from "../../assets/icons/add-product.svg";
import cartIcon from "../../assets/icons/cart.svg";

const NavBar = () => {
  const storedUser = localStorage.getItem("currentUser");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const isAdmin = user?.isAdmin;
  const { totalItems } = useCart();

  return (
    <div className="layout">
      <header className="navbar">
        <div className="logo">🍰 Sweet Cakes</div>
        <nav className="nav-links">
          <Link to="/home" className="nav-link" title="בית">
            <img src={homeIcon} className="nav-icon" alt="בית" />
          </Link>
          <Link to="/home/products" className="nav-link" title="המוצרים שלנו">
            <img src={cakeIcon} className="nav-icon" alt="מוצרים" />
          </Link>
          <Link to="/home/profile" className="nav-link" title="הפרטים שלי">
            <img src={profileIcon} className="nav-icon" alt="פרופיל" />
          </Link>
          {isAdmin && (
            <Link to="/home/addproduct" className="nav-link admin" title="הוספת מוצר">
              <img src={addProductIcon} className="nav-icon" alt="הוספת מוצר" />
            </Link>
          )}
          <Link to="/home/cart" className="nav-link cart-link" title="הסל שלי">
            <img src={cartIcon} className="nav-icon" alt="סל" />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>
          <span className="user-greeting">שלום, {user?.name}</span>
        </nav>
      </header>

      <main className="content">
        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default NavBar;
