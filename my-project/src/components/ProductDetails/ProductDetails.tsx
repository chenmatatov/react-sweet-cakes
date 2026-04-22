import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductDetails.scss";
import type { Product } from "../../models/product";
import type { Review } from "../../models/review";
import { useCart } from "../../context/CartContext";
import deleteIcon from "../../assets/icons/delete.svg";
import cartIcon from "../../assets/icons/cart.svg";
import api from "../../api";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<any>(null);

  const storedUser = localStorage.getItem("currentUser");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const { addToCart, items, updateQuantity } = useCart();
  const cartItem = items.find(i => (i.product._id || i.product.id) === id);
  const isAdmin = currentUser?.isAdmin;

  const fetchReviews = async () => {
    const { data } = await api.get(`/reviews?productId=${id}`);
    setReviews(data);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes] = await Promise.all([
          api.get(`/products/${id}`),
        ]);
        setProduct(productRes.data);
        await fetchReviews();
      } catch (err) {
        console.log("שגיאה בטעינת הנתונים", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      const { data } = await api.patch(`/products/${id}/buycount`, {});
      setProduct({ ...product, buyCount: data.buyCount });
    } catch (err) { console.log("שגיאה בעדכון buyCount", err); }
    addToCart(product);
  };

  const deleteReview = async () => {
    if (!reviewToDelete) return;
    try {
      await api.delete(`/reviews/${reviewToDelete}`);
      await fetchReviews();
      setShowDeleteModal(false);
      setReviewToDelete(null);
    } catch (err) { console.log("שגיאה במחיקת תגובה", err); }
  };

  const addReview = async () => {
    if (!comment.trim() || rating === 0) return;
    try {
      await api.post("/reviews", { productId: id, rating, comment });
      await fetchReviews();
      setComment(""); setRating(0); setShowForm(false);
    } catch (err: any) {
      alert(err.response?.data?.message || "שגיאה בהוספת ביקורת");
    }
  };

  if (loading) return <p>טוען...</p>;
  if (!product) return <p>מוצר לא נמצא</p>;

  const productId = product._id || product.id;

  return (
    <>
      <div className="product-details-container">
        <div className="product-info">
          <h1>{product.name}</h1>
          <img src={product.image} alt={product.name} className="product-image" />
          <p className="price">מחיר: ₪{product.price}</p>
          <p className="buy-count">מוצר זה נרכש <strong>{product.buyCount}</strong> פעמים</p>
          <p className="description">תיאור המוצר: {product.description}</p>
          <div className="cart-controls">
            {!cartItem ? (
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                הוסף לסל <img src={cartIcon} alt="סל" className="cart-btn-icon" />
              </button>
            ) : (
              <div className="quantity-controls">
                <button onClick={() => updateQuantity(productId, cartItem.quantity - 1)}>−</button>
                <span>{cartItem.quantity}</span>
                <button onClick={() => updateQuantity(productId, cartItem.quantity + 1)}>+</button>
              </div>
            )}
          </div>
        </div>

        <div className="reviews-container">
          <h2>חוות דעת</h2>
          {reviews.length === 0 && <p>אין חוות דעת עדיין</p>}
          {reviews.map((r: any) => (
            <div key={r._id} className="review">
              <div className="review-author">👤 {r.userId?.name || "משתמש"}</div>
              <div className="stars">{"⭐".repeat(r.rating)}</div>
              <p>{r.comment}</p>
              {(r.userId?._id === currentUser?.id || isAdmin) && (
                <button className="delete-review-btn" onClick={() => { setReviewToDelete(r._id); setShowDeleteModal(true); }} title="מחק תגובה">
                  <img src={deleteIcon} alt="מחק" />
                </button>
              )}
            </div>
          ))}

          {!isAdmin && currentUser && (
            <button className="add-review-btn" onClick={() => setShowForm(true)}>הוסף חוות דעת</button>
          )}

          {showForm && (
            <div className="review-form">
              <h3>הוספת חוות דעת</h3>
              <div className="rating-select">
                {[1, 2, 3, 4, 5].map(num => (
                  <span key={num} className={rating >= num ? "active" : ""} onClick={() => setRating(num)}>⭐</span>
                ))}
              </div>
              <textarea placeholder="כתוב חוות דעת..." value={comment} onChange={e => setComment(e.target.value)} />
              <div className="form-actions">
                <button onClick={addReview}>שלח</button>
                <button onClick={() => setShowForm(false)}>ביטול</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>אישור מחיקה</h3>
            <p>האם את בטוחה שברצונך למחוק את התגובה?</p>
            <div className="modal-buttons">
              <button onClick={deleteReview} className="confirm-btn">כן, מחק</button>
              <button onClick={() => setShowDeleteModal(false)} className="cancel-btn">ביטול</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetails;
