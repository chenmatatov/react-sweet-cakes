import React, { useEffect, useState } from "react";
import "./Profile.scss";
import axios from "axios";
import type { User } from "../../models/user";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import API_URL from "../../api";

const Profile = () => {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("currentUser");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  const [user, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/users/${Number(currentUser.id)}`);

        setUser(res.data);
        if (!editing) {
          setName(res.data.name);
          setEmail(res.data.email);
          setPhone(res.data.phone || "");
          setCity(res.data.city || "");
        }
      } catch (err) {
        console.log("שגיאה בטעינת משתמש", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [currentUser, navigate, editing]);

  const saveChanges = async () => {
    if (!user) return;

    const updatedUser = {
      ...user,
      name,
      email,
      phone,
      city,
      ...(password && { password }),
    };

    try {
      await axios.put(`${API_URL}/users/${user.id}`, updatedUser);
      setUser(updatedUser);
      setPassword("");
      setEditing(false);

      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    } catch (err) {
      console.log("שגיאה בעדכון משתמש", err);
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    setPassword("");
    setName(user?.name || "");
    setEmail(user?.email || "");
    setPhone((user as any)?.phone || "");
    setCity((user as any)?.city || "");
  };

  const { clearCart } = useCart();
  const { clearFavorites } = useFavorites();

  const logout = () => {
    localStorage.removeItem("currentUser");
    clearCart();
    clearFavorites();
    navigate("/");
  };

  if (loading) return <p className="profile-loading">טוען...</p>;
  if (!user) return null;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-description">
          <h2>פרופיל משתמש</h2>
          <p>צפיה ועריכת פרטים אישיים</p>
        </div>

        {!editing ? (
          <>
            <div className="profile-row">
              <span className="profile-label">שם</span>
              <span className="profile-value">{user.name}</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">אימייל</span>
              <span className="profile-value">{user.email}</span>
            </div>
            {(user as any).phone && (
              <div className="profile-row">
                <span className="profile-label">טלפון</span>
                <span className="profile-value">{(user as any).phone}</span>
              </div>
            )}
            {(user as any).city && (
              <div className="profile-row">
                <span className="profile-label">עיר</span>
                <span className="profile-value">{(user as any).city}</span>
              </div>
            )}
            <div className="profile-row">
              <span className="profile-label">הרשאה</span>
              <span className="profile-value">{user.isAdmin ? "מנהל" : "משתמש רגיל"}</span>
            </div>

            <div className="buttons">
              <button onClick={() => {
              setName(user.name);
                setEmail(user.email);
                setPhone((user as any).phone || "");
                setCity((user as any).city || "");
                setPassword("");
                setEditing(true);
              }}>עריכת פרטים</button>
              <button className="logout" onClick={logout}>
                התנתקות
              </button>
            </div>
          </>
        ) : (
          <>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="שם מלא" className="profile-input" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="אימייל" className="profile-input" />
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="טלפון" className="profile-input" />
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="עיר" className="profile-input" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="סיסמה חדשה (אופציונלי)" className="profile-input" />

            <div className="buttons">
              <button onClick={saveChanges}>שמור</button>
              <button
                className="cancel" onClick={cancelEdit}>ביטול</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;