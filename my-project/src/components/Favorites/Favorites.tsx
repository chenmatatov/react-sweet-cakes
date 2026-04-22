import { useNavigate } from "react-router-dom";
import { useFavorites } from "../../context/FavoritesContext";
import { useCart } from "../../context/CartContext";
import cartIcon from "../../assets/icons/cart.svg";
import deleteIcon from "../../assets/icons/delete.svg";
import "./Favorites.scss";
import api from "../../api";

const Favorites = () => {
  const { favorites, toggleFavorite } = useFavorites();
  const { addToCart, items } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = async (product: any) => {
    try {
      await api.patch(`/products/${product._id || product.id}/buycount`, {});
    } catch (err) { console.log("שגיאה בעדכון buyCount", err); }
    addToCart(product);
  };

  if (favorites.length === 0) {
    return (
      <div className="favorites-empty">
        <div className="favorites-empty-content">
          <span className="favorites-empty-icon">🤍</span>
          <h2>אין מועדפים עדיין</h2>
          <p>הוסיפי מוצרים למועדפים מהחנות שלנו</p>
          <button onClick={() => navigate("/home/products")}>לחנות</button>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <h1>❤️ המועדפים שלי</h1>
      <div className="favorites-grid">
        {favorites.map(product => {
          const pid = product._id || product.id;
          const inCart = items.some(i => (i.product._id || i.product.id) === pid);
          return (
            <div className="favorite-card" key={pid}>
              <img src={product.image} alt={product.name} onClick={() => navigate(`/home/products/${pid}`)} />
              <button className="remove-favorite" onClick={() => toggleFavorite(product)} title="הסר ממועדפים">
                <img src={deleteIcon} alt="הסר" />
              </button>
              <div className="favorite-info">
                <h3 onClick={() => navigate(`/home/products/${pid}`)}>{product.name}</h3>
                <span className="favorite-price">₪{product.price}</span>
                <button className={`add-to-cart-btn ${inCart ? "in-cart" : ""}`}
                  onClick={() => !inCart && handleAddToCart(product)} disabled={inCart}>
                  {inCart ? "✓ בסל" : <>הוסף לסל <img src={cartIcon} alt="סל" className="cart-btn-icon" /></>}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Favorites;
