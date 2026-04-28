import { useEffect, useState } from "react";
import "./Products.scss";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../models/product";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import deleteIcon from "../../assets/icons/delete.svg";
import { useFavorites } from "../../context/FavoritesContext";
import api from "../../api";

const PRODUCTS_PER_PAGE = 20;

const Products = () => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [searchName, setSearchName] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const { toggleFavorite, isFavorite } = useFavorites();
  const [showFilters, setShowFilters] = useState(false);
  const storedUser = localStorage.getItem("currentUser");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const isAdmin = user?.isAdmin;

  useEffect(() => {
    api.get("/categories").then(({ data }) => setCategories(data)).catch(console.log);
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (selectedCategoryId) params.categoryId = selectedCategoryId;
      if (searchName.trim()) params.search = searchName.trim();
      if (sortBy) params.sortBy = sortBy;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      const { data } = await api.get("/products", { params });
      setAllProducts(data);
    } catch {
      setError("שגיאה בטעינת המוצרים");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => setSearchName(searchInput), 500);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    const t = setTimeout(() => setMinPrice(minPriceInput), 600);
    return () => clearTimeout(t);
  }, [minPriceInput]);

  useEffect(() => {
    const t = setTimeout(() => setMaxPrice(maxPriceInput), 600);
    return () => clearTimeout(t);
  }, [maxPriceInput]);

  useEffect(() => { setCurrentPage(1); fetchProducts(); }, [selectedCategoryId, searchName, sortBy, minPrice, maxPrice]);

  const filtered = allProducts;
  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);
  const currentProducts = filtered.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);

  const handlePageChange = (page: number) => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const deleteProduct = async () => {
    if (!productToDelete) return;
    try {
      await api.delete(`/products/${productToDelete._id || productToDelete.id}`);
      fetchProducts();
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (err) { console.log("שגיאה במחיקה", err); }
  };

  if (loading && allProducts.length === 0) return <LoadingSpinner />;
  if (error) return <p>{error}</p>;

  return (
    <div className="products-container">
      <h1>המוצרים שלנו</h1>

      <button className="filters-toggle" onClick={() => setShowFilters(f => !f)}>
        {showFilters ? "סגור סננים ↑" : "סננים ▼"}
      </button>

      <div className={`filters-bar ${showFilters ? "open" : ""}`}>
        <input type="text" placeholder="חיפוש לפי שם..." value={searchInput} onChange={e => setSearchInput(e.target.value)} className="search-input" />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="sort-select">
          <option value="">מיין לפי...</option>
          <option value="price_asc">מחיר: נמוך לגבוה</option>
          <option value="price_desc">מחיר: גבוה לנמוך</option>
          <option value="buyCount_desc">הכי פופולריים</option>
          <option value="name_asc">שם: א-ת</option>
          <option value="name_desc">שם: ת-א</option>
        </select>
        <div className="price-filter">
          <input type="number" placeholder="מינימום" value={minPriceInput} onChange={e => setMinPriceInput(e.target.value)} className="price-input" />
          <span>-</span>
          <input type="number" placeholder="מקסימום" value={maxPriceInput} onChange={e => setMaxPriceInput(e.target.value)} className="price-input" />
        </div>
        <button className="reset-btn" onClick={() => { setSearchInput(""); setSearchName(""); setSortBy(""); setMinPriceInput(""); setMaxPriceInput(""); setMinPrice(""); setMaxPrice(""); setSelectedCategoryId(""); }}>נקה סננים</button>
      </div>

      <div className="categories">
        <button className={selectedCategoryId === "" ? "active" : ""} onClick={() => setSelectedCategoryId("")}>הכל</button>
        {categories.map(cat => (
          <button key={cat._id} className={selectedCategoryId === cat._id ? "active" : ""} onClick={() => setSelectedCategoryId(cat._id)}>{cat.name}</button>
        ))}
      </div>

      {filtered.length === 0 && !loading && <p className="no-results">לא נמצאו מוצרים תואמים</p>}

      <div className="products-grid">
        {currentProducts.map(p => (
          <div className="product-card" key={p._id || p.id} onClick={() => navigate(`/home/products/${p._id || p.id}`)}>
            <div style={{ position: "relative" }}>
              <img src={p.image} alt={p.name} className="product-image" />
              <div className="overlay"><h3>{p.name}</h3></div>
              <button className={`favorite-btn ${isFavorite(p._id || p.id) ? "active" : ""}`}
                onClick={e => { e.stopPropagation(); toggleFavorite(p); }} title="מועדפים">
                {isFavorite(p._id || p.id) ? "❤️" : "🤍"}
              </button>
            </div>
            <div className="product-info">
              <span className="price">₪{p.price}</span>
              {isAdmin && (
                <button className="btn-delete" onClick={e => { e.stopPropagation(); setProductToDelete(p); setShowDeleteModal(true); }} title="מחק">
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
            <button key={i + 1} className={currentPage === i + 1 ? "active" : ""} onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
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
