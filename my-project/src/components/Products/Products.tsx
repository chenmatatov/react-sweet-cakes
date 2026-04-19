import React, { useEffect, useState } from "react";
import "./Products.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import type { Product } from "../../models/product";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import deleteIcon from "../../assets/icons/delete.svg";

const PRODUCTS_PER_PAGE = 20;

const Products = () => {
  const navigate = useNavigate();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
  const [searchName, setSearchName] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
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

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const url = selectedCategoryId === 0
        ? "http://localhost:3000/products"
        : `http://localhost:3000/products?categoryId=${selectedCategoryId}`;
      const res = await axios.get(url);
      setAllProducts(res.data);
    } catch (err) {
      setError("שגיאה בטעינת המוצרים");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchAllProducts();
  }, [selectedCategoryId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchName, sortBy, minPrice, maxPrice]);

  const getFilteredAndSorted = () => {
    let result = [...allProducts];

    if (searchName.trim())
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchName.toLowerCase())
      );

    if (minPrice !== "") result = result.filter((p) => p.price >= Number(minPrice));
    if (maxPrice !== "") result = result.filter((p) => p.price <= Number(maxPrice));

    if (sortBy === "price_asc") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price_desc") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "buyCount_desc") result.sort((a, b) => (b.buyCount || 0) - (a.buyCount || 0));
    else if (sortBy === "name_asc") result.sort((a, b) => a.name.localeCompare(b.name, "he"));
    else if (sortBy === "name_desc") result.sort((a, b) => b.name.localeCompare(a.name, "he"));

    return result;
  };

  const filtered = getFilteredAndSorted();
  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);
  const currentProducts = filtered.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProduct = async () => {
    if (!productToDelete) return;
    try {
      await axios.delete(`http://localhost:3000/products/${productToDelete.id}`);
      fetchAllProducts();
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (err) {
      console.log("שגיאה במחיקה", err);
    }
  };

  const goToDetails = (p: Product) => navigate(`/home/products/${p.id}`);

  if (loading && allProducts.length === 0) return <LoadingSpinner />;
  if (error) return <p>{error}</p>;

  return (
    <div className="products-container">
      <h1>המוצרים שלנו</h1>

      <div className="filters-bar">
        <input
          type="text"
          placeholder="חיפוש לפי שם..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="search-input"
        />

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
          <option value="">מיין לפי...</option>
          <option value="price_asc">מחיר: נמוך לגבוה</option>
          <option value="price_desc">מחיר: גבוה לנמוך</option>
          <option value="buyCount_desc">הכי פופולריים</option>
          <option value="name_asc">שם: א-ת</option>
          <option value="name_desc">שם: ת-א</option>
        </select>

        <div className="price-filter">
          <input
            type="number"
            placeholder="מחיר מינימום"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="price-input"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="מחיר מקסימום"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="price-input"
          />
        </div>

        <button className="reset-btn" onClick={() => {
          setSearchName("");
          setSortBy("");
          setMinPrice("");
          setMaxPrice("");
          setSelectedCategoryId(0);
        }}>נקה סננים</button>
      </div>

      <div className="categories">
        <button className={selectedCategoryId === 0 ? "active" : ""} onClick={() => setSelectedCategoryId(0)}>הכל</button>
        {categories.map((cat) => (
          <button key={cat.id} className={selectedCategoryId === cat.id ? "active" : ""} onClick={() => setSelectedCategoryId(cat.id)}>
            {cat.name}
          </button>
        ))}
      </div>

      {filtered.length === 0 && !loading && (
        <p className="no-results">לא נמצאו מוצרים תואמים</p>
      )}

      <div className="products-grid">
        {currentProducts.map((p) => (
          <div className="product-card" key={p.id} onClick={() => goToDetails(p)}>
            <div style={{ position: "relative" }}>
              <img src={p.image} alt={p.name} className="product-image" />
              <div className="overlay">
                <h3>{p.name}</h3>
              </div>
            </div>

            <div className="product-info">
              <span className="price">₪{p.price}</span>

              {isAdmin && (
                <button
                  className="btn-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    setProductToDelete(p);
                    setShowDeleteModal(true);
                  }}
                  title="מחק"
                >
                  <img src={deleteIcon} alt="מחק" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>הקודם</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i + 1} className={currentPage === i + 1 ? "active" : ""} onClick={() => handlePageChange(i + 1)}>
              {i + 1}
            </button>
          ))}
          <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>הבא</button>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>אישור מחיקה</h3>
            <p>למחוק את "{productToDelete?.name}"?</p>
            <div className="modal-buttons">
              <button onClick={deleteProduct} className="confirm-btn">כן, מחק</button>
              <button onClick={() => setShowDeleteModal(false)} className="cancel-btn">ביטול</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
