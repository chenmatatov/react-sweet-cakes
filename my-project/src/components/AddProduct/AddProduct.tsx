import React, { useEffect, useState } from "react";
import "./AddProduct.scss";
import api from "../../api";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);

  useEffect(() => {
    api.get("/categories").then(({ data }) => { setCategories(data); if (data.length) setCategoryId(data[0]._id); });
  }, []);

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/products", { name, categoryId, price, image: image || "/images/defultCake.png", description, buyCount: 0 });
      setSuccess("המוצר נוסף בהצלחה!");
      setError("");
      setName(""); setPrice(0); setDescription(""); setImage("");
    } catch (err: any) {
      setError(err.response?.data?.message || "אירעה שגיאה בהוספת המוצר");
      setSuccess("");
    }
  };

  return (
    <div className="addproduct-container">
      <h1>הוספת מוצר חדש</h1>
      <p>טופס להוספת מוצר חדש לחנות</p>

      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}

      <form onSubmit={addProduct}>
        <input type="text" placeholder="שם מוצר" value={name} onChange={e => setName(e.target.value)} required />
        <input type="number" placeholder="מחיר" value={price} onChange={e => setPrice(Number(e.target.value))} required />
        <input type="url" placeholder="קישור לתמונה (URL)" value={image} onChange={e => setImage(e.target.value)} />
        <textarea placeholder="תיאור המוצר" value={description} onChange={e => setDescription(e.target.value)} />
        <select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <button type="submit">הוסף מוצר</button>
      </form>
    </div>
  );
};

export default AddProduct;
