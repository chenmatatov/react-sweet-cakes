import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductDetails.scss";
import axios from "axios";
import type { Product } from "../../models/product";
import type { Review } from "../../models/review";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<number | null>(null);

  const storedUser = localStorage.getItem("currentUser");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const isAdmin = currentUser?.isAdmin;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await axios.get(
          `http://localhost:3000/products/${productId}`
        );

        const reviewsRes = await axios.get(
          `http://localhost:3000/reviews?productId=${productId}`
        );

        setProduct(productRes.data);
        setReviews(reviewsRes.data);
      } catch (err) {
        console.log("שגיאה בטעינת הנתונים", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  const deleteReview = async () => {
    if (!reviewToDelete) return;

    try {
      await axios.delete(`http://localhost:3000/reviews/${reviewToDelete}`);
      setReviews((prev) => prev.filter((r) => r.id !== reviewToDelete));
      setShowDeleteModal(false);
      setReviewToDelete(null);
    } catch (err) {
      console.log("שגיאה במחיקת תגובה", err);
    }
  };

  const handleDeleteReview = (reviewId: number) => {
    setReviewToDelete(reviewId);
    setShowDeleteModal(true);
  };
  const addReview = async () => {
    const res = await axios.get("http://localhost:3000/reviews");
    const r = res.data;
    if (!comment.trim()) return;

    try {
      const newReview = {
        id: String(r.length + 2),
        productId,
        userId: currentUser.id,
        rating,
        comment,
      };

      const res = await axios.post(
        "http://localhost:3000/reviews",
        newReview
      );

      setReviews((prev) => [...prev, res.data]);
      setComment("");
      setRating(5);
      setShowForm(false);
    } catch (err) {
      console.log("שגיאה בהוספת חוות דעת", err);
    }
  };

  if (loading) return <p>טוען...</p>;
  if (!product) return <p>מוצר לא נמצא</p>;

  return (
    <>
    <div className="product-details-container">
      {/* צד ימין - פרטי מוצר */}
      <div className="product-info">
        <h1>{product.name}</h1>

        <img
          src={product.image}
          alt={product.name}
          className="product-image"
        />

        <p className="price">מחיר: ₪{product.price}</p>
        <p className="buy-count">
          מוצר זה נרכש <strong>{product.buyCount}</strong> פעמים
        </p>
        <p className="description">תיאור המוצר: {product.description}</p>
      </div>

      {/* צד שמאל - חוות דעת */}
      <div className="reviews-container">
        <h2>חוות דעת</h2>

        {reviews.length === 0 && <p>אין חוות דעת עדיין</p >}

        {reviews.map((r) => (
          <div key={r.id} className="review">
            <div className="stars">{"⭐".repeat(r.rating)}</div>
            <p>{r.comment}</p>

            {(r.userId === currentUser?.id || isAdmin) && (
              <button onClick={() => handleDeleteReview(r.id)}>מחק</button>
            )}
          </div>
        ))}

        {!isAdmin && currentUser && (
          <button className="add-review-btn" onClick={() => setShowForm(true)}>
            הוסף חוות דעת
          </button>
        )}

        {showForm && (
          <div className="review-form">
            <h3>הוספת חוות דעת</h3>

            <div className="rating-select">
              {[1, 2, 3, 4, 5].map((num) => (
                <span
                  key={num}
                  className={rating >= num ? "active" : ""}
                  onClick={() => setRating(num)}
                >
                  ⭐
                </span>
              ))}
            </div>

            <textarea
              placeholder="כתוב חוות דעת..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

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
