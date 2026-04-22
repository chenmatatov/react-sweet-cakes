import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./Cart.scss";
import cartIcon from "../../assets/icons/cart.svg";
import deleteIcon from "../../assets/icons/delete.svg";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-content">
          <span className="cart-empty-icon">
            <img src={cartIcon} alt="סל" className="cart-empty-svg" />
          </span>
          <h2>הסל שלך ריק</h2>
          <p>הוסיפי מוצרים מהחנות שלנו</p>
          <button onClick={() => navigate("/home/products")}>לחנות</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
    <div className="cart-container">
      <h1>
        <img src={cartIcon} alt="" className="cart-title-icon" />
        הסל שלי
      </h1>

      <div className="cart-content">
        <div className="cart-items">
          {items.map(({ product, quantity }) => {
            const pid = product._id || product.id;
            return (
            <div key={pid} className="cart-item">
              <img src={product.image} alt={product.name} />
              <div className="cart-item-info">
                <h3>{product.name}</h3>
                <p className="cart-item-price">₪{product.price} ליחידה</p>
              </div>
              <div className="cart-item-controls">
                <button onClick={() => updateQuantity(pid, quantity - 1)}>−</button>
                <span>{quantity}</span>
                <button onClick={() => updateQuantity(pid, quantity + 1)}>+</button>
              </div>
              <p className="cart-item-total">₪{product.price * quantity}</p>
              <button className="cart-item-remove" onClick={() => removeFromCart(pid)} title="הסר מהסל">
                <img src={deleteIcon} alt="הסר" />
              </button>
            </div>
            );
          })}
        </div>

        <div className="cart-summary">
          <h2>סיכום הזמנה</h2>
          <div className="cart-summary-rows">
            {items.map(({ product, quantity }) => (
              <div key={product._id || product.id} className="summary-row">
                <span>{product.name} x{quantity}</span>
                <span>₪{product.price * quantity}</span>
              </div>
            ))}
          </div>
          <div className="cart-total">
            <span>סה"כ לתשלום:</span>
            <span>₪{totalPrice}</span>
          </div>
          <button className="checkout-btn" onClick={() => navigate("/home/checkout")}>לתשלום</button>
          <button className="continue-btn" onClick={() => navigate("/home/products")}>המשך קנייה</button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Cart;
