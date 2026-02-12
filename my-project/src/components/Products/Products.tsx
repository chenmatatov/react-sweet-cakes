import React, { useEffect, useState } from "react";
import "./Products.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import type { Product } from "../../models/product";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const PRODUCTS_PER_PAGE = 20;

const Products = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [totalItems, setTotalItems] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const storedUser = localStorage.getItem("currentUser");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const isAdmin = user?.isAdmin;

  useEffect(() => {
    axios
      .get("http://localhost:3000/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.log("שגיאה בטעינת קטגוריות", err));
  }, []);

  const fetchTotalCount = async () => {
    try {
      const url = selectedCategoryId === 0
        ? "http://localhost:3000/products"
        : `http://localhost:3000/products?categoryId=${selectedCategoryId}`;

      const res = await axios.get(url);
      setTotalItems(res.data.length);
    } catch (err) {
      console.log("שגיאה בחישוב כמות מוצרים", err);
    }
  };

  const fetchProductsByPage = async () => {
    setLoading(true);
    try {
      const baseUrl = "http://localhost:3000/products";
      const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
      const params = `_page=${currentPage}&_start=${start}&_limit=${PRODUCTS_PER_PAGE}`;
      const categoryFilter = selectedCategoryId !== 0 ? `&categoryId=${selectedCategoryId}` : "";

      const res = await axios.get(`${baseUrl}?${params}${categoryFilter}`);
      setProducts(res.data);
    } catch (err) {
      setError("שגיאה בטעינת המוצרים");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchTotalCount();
  }, [selectedCategoryId]);

  useEffect(() => {
    fetchProductsByPage();
  }, [currentPage, selectedCategoryId]);

  const totalPages = Math.ceil(totalItems / PRODUCTS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProduct = async () => {
    if (!productToDelete) return;
    try {
      await axios.delete(`http://localhost:3000/products/${productToDelete.id}`);
      fetchTotalCount();
      fetchProductsByPage();
      setShowDeleteModal(false);
    } catch (err) {
      console.log("שגיאה במחיקה", err);
    }
  };

  const goToDetails = (p: Product) => navigate(`/home/products/${p.id}`);

  if (loading && products.length === 0) return <LoadingSpinner />;
  if (error) return <p>{error}</p>;

  return (
    <div className="products-container">
      <h1>המוצרים שלנו</h1>

      <div className="categories">
        <button className={selectedCategoryId === 0 ? "active" : ""} onClick={() => setSelectedCategoryId(0)}>הכל</button>
        {categories.map((cat) => (
          <button key={cat.id} className={selectedCategoryId === cat.id ? "active" : ""} onClick={() => setSelectedCategoryId(cat.id)}>
            {cat.name}
          </button>
        ))}
      </div>
      <div className="products-grid">
        {products.map((p) => (
          <div
            className="product-card"
            key={p.id}
            onClick={() => goToDetails(p)}
          >
            <div style={{ position: "relative" }}>
              <img src={p.image} alt={p.name} className="product-image" />
              <div className="overlay">
                <h3>{p.name}</h3>
              </div>
            </div>

            <div className="product-info">
              <span className="price">₪{p.price}</span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToDetails(p);
                }}
              >
                לפרטים
              </button>

              {isAdmin && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setProductToDelete(p);
                    setShowDeleteModal(true);
                  }}
                >
                  מחק
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            הקודם
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            הבא
          </button>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>אישור מחיקה</h3>
            <p>למחוק את "{productToDelete?.name}"?</p>
            <div className="modal-buttons">              <button onClick={deleteProduct} className="confirm-btn">כן, מחק</button>
              <button onClick={() => setShowDeleteModal(false)} className="cancel-btn">ביטול</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;