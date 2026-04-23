import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./NavBar.scss";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import profileIcon from "../../assets/icons/profile.svg";
import homeIcon from "../../assets/icons/home.svg";
import cakeIcon from "../../assets/icons/cake.svg";
import addProductIcon from "../../assets/icons/add-product.svg";
import cartIcon from "../../assets/icons/cart.svg";
import ordersIcon from "../../assets/icons/orders.svg";
import ChatBot from "../ChatBot/ChatBot";

const NavBar = () => {
  const storedUser = localStorage.getItem("currentUser");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const isAdmin = user?.isAdmin;
  const { totalItems } = useCart();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    navigate("/");
  };

  const close = () => setMenuOpen(false);

  return (
    <div className="layout">
      <header className="navbar">
        <div className="logo">🍰 Sweet Cakes</div>

        {/* Desktop nav */}
        <nav className="nav-links">
          <Link to="/home" className="nav-link" title="בית"><img src={homeIcon} className="nav-icon" alt="בית" /></Link>
          <Link to="/home/products" className="nav-link" title="מוצרים"><img src={cakeIcon} className="nav-icon" alt="מוצרים" /></Link>
          <Link to="/home/profile" className="nav-link" title="פרופיל"><img src={profileIcon} className="nav-icon" alt="פרופיל" /></Link>
          {isAdmin && <Link to="/home/addproduct" className="nav-link admin" title="הוספת מוצר"><img src={addProductIcon} className="nav-icon" alt="הוספת מוצר" /></Link>}
          <Link to="/home/favorites" className="nav-link favorites-link" title="מועדפים">
            🤍{favorites.length > 0 && <span className="cart-badge">{favorites.length}</span>}
          </Link>
          <Link to="/home/orders" className="nav-link" title="הזמנות"><img src={ordersIcon} className="nav-icon" alt="הזמנות" /></Link>
          <Link to="/home/cart" className="nav-link cart-link" title="סל">
            <img src={cartIcon} className="nav-icon" alt="סל" />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>
          <span className="user-greeting">שלום, {user?.name}</span>
          <button className="logout-btn" onClick={handleLogout}>התנתק</button>
        </nav>

        {/* Mobile right side */}
        <div className="mobile-right">
          <Link to="/home/cart" className="nav-link cart-link">
            <img src={cartIcon} className="nav-icon" alt="סל" />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>
          <button className="hamburger" onClick={() => setMenuOpen(o => !o)}>
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-header">
            <span>שלום, {user?.name}</span>
            <button onClick={close}>✕</button>
          </div>
          <Link to="/home" className="mobile-link" onClick={close}><img src={homeIcon} alt="" />בית</Link>
          <Link to="/home/products" className="mobile-link" onClick={close}><img src={cakeIcon} alt="" />מוצרים</Link>
          <Link to="/home/profile" className="mobile-link" onClick={close}><img src={profileIcon} alt="" />פרופיל</Link>
          <Link to="/home/orders" className="mobile-link" onClick={close}><img src={ordersIcon} alt="" />הזמנות שלי</Link>
          <Link to="/home/favorites" className="mobile-link" onClick={close}>🤍 מועדפים {favorites.length > 0 && `(${favorites.length})`}</Link>
          <Link to="/home/calculator" className="mobile-link" onClick={close}>🧮 מחשבון מחיר</Link>
          <Link to="/home/booking" className="mobile-link" onClick={close}>📅 בדיקת זמינות</Link>
          {isAdmin && <Link to="/home/addproduct" className="mobile-link" onClick={close}><img src={addProductIcon} alt="" />הוספת מוצר</Link>}
          <button className="mobile-logout" onClick={() => { close(); handleLogout(); }}>התנתק</button>
        </div>
      )}

      <main className="content">
        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>
      <ChatBot />
    </div>
  );
};

export default NavBar;
