import React, { useState } from "react";
import "./AddProduct.scss";
import axios from "axios";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [category, setCategory] = useState<number>(1);
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const storedUser = localStorage.getItem("currentUser");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await axios.get("http://localhost:3000/products");
    const products = res.data;
    if (!currentUser) {
      setError("משתמש לא מחובר");
      return;
    }

    try {
      const newProduct = {
        id: String(products.length + 1),
        userId: String(currentUser.id),
        name,
        categoryId: category,
        price,
        image: "/images/defultCake.png",
        description,
        buyCount: 0
      };

      await axios.post(
        "http://localhost:3000/products",
        newProduct
      );

      setSuccess("המוצר נוסף בהצלחה!");
      setError("");

      setName("");
      setPrice(0);
      setCategory(1);
      setDescription("");

    } catch (err) {
      console.log("שגיאה בהוספת מוצר", err);
      setError("אירעה שגיאה בהוספת המוצר");
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
        <input
          type="text"
          placeholder="שם מוצר"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="מחיר"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          required
        />
        <textarea
          placeholder="תיאור המוצר"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(Number(e.target.value))}>
          <option value={1}>עוגות</option>
          <option value={2}>עוגות קומות</option>
          <option value={3}>עוגות מספרים</option>
          <option value={4}>קינוחים</option>
          <option value={5}>עוגיות</option>
          <option value={6}>פאי</option>
        </select>

        <button type="submit">הוסף מוצר</button>
      </form>
    </div>
  );
};

export default AddProduct;
