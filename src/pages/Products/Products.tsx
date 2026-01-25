import React, { useEffect, useState } from "react";
import "./Products.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import type { Product } from "../../models/product";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

const PRODUCTS_PER_PAGE = 20;

const Products = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const storedUser = localStorage.getItem("currentUser");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const isAdmin = user?.isAdmin;

  useEffect(() => {
    axios
      .get("http://localhost:3000/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.log("Error fetching categories:", err));
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setCurrentPage(1);

    const url =
      selectedCategoryId === 0
        ? "http://localhost:3000/products"
        : `http://localhost:3000/products?categoryId=${selectedCategoryId}`;

    try {
      const res = await axios.get(url);
      setProducts(res.data);
    } catch (err) {
      console.log("Error fetching products:", err);
      setError("שגיאה בטעינת המוצרים");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategoryId]);

  const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToDetails = (p: Product) => {
    navigate(`/home/products/${p.id}`);
  };
  
  const deleteProduct = async (p: Product) => {
    const isConfirmed = window.confirm("האם את בטוחה שברצונך למחוק מוצר זה?");

    if (!isConfirmed)
      return;

    try {
      await axios.delete(`http://localhost:3000/products/${p.id}`);
      fetchProducts();
    } catch (err) {
      console.log("שגיאה במחיקת מוצר:", err);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p>{error}</p>;

  return (
    <div className="products-container">
      <h1>המוצרים שלנו</h1>

      <div className="categories">
        <button
          className={selectedCategoryId === 0 ? "active" : ""}
          onClick={() => setSelectedCategoryId(0)}
        >
          הכל
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            className={selectedCategoryId === cat.id ? "active" : ""}
            onClick={() => setSelectedCategoryId(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>
      <div className="products-grid">
        {currentProducts.map((p) => (
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
                    deleteProduct(p);
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
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
