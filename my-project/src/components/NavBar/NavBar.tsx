import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./NavBar.scss";

const NavBar = () => {
  const storedUser = localStorage.getItem("currentUser");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const isAdmin = user?.isAdmin;

  return (
    <div className="layout">
      <header className="navbar">
        <div className="logo">🍰 Sweet Cakes</div>
        <nav className="nav-links">
          <Link to="/home" className="nav-link">בית</Link>
          <Link to="/home/products" className="nav-link">המוצרים שלנו</Link>
          <Link to="/home/profile" className="nav-link">הפרטים שלי</Link>
          {isAdmin && (
            <Link to="/home/addproduct" className="nav-link admin">
              הוספת מוצר
            </Link>
          )}
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
