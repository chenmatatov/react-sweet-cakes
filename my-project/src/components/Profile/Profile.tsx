import React, { useEffect, useState } from "react";
import "./Profile.scss";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import api from "../../api";

const Profile = () => {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("currentUser");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(true);
  const { clearCart } = useCart();
  const { clearFavorites } = useFavorites();

  useEffect(() => {
    if (!currentUser) { navigate("/"); return; }
    api.get("/auth/me")
      .then(({ data }) => {
        setUser(data);
        if (!editing) { setName(data.name); setEmail(data.email); setPhone(data.phone || ""); setCity(data.city || ""); }
      })
      .catch((err) => { if (err?.response?.status === 401) { logout(); } })
      .finally(() => setLoading(false));
  }, [editing]);

  const saveChanges = async () => {
    if (!user) return;
    try {
      const { data } = await api.put("/auth/me", { name, email, phone, city, ...(password && { password }) });
      setUser(data);
      setPassword("");
      setEditing(false);
      localStorage.setItem("currentUser", JSON.stringify(data));
    } catch (err) {
      console.log("שגיאה בעדכון משתמש", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
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
            <div className="profile-row"><span className="profile-label">שם</span><span className="profile-value">{user.name}</span></div>
            <div className="profile-row"><span className="profile-label">אימייל</span><span className="profile-value">{user.email}</span></div>
            {user.phone && <div className="profile-row"><span className="profile-label">טלפון</span><span className="profile-value">{user.phone}</span></div>}
            {user.city && <div className="profile-row"><span className="profile-label">עיר</span><span className="profile-value">{user.city}</span></div>}
            <div className="profile-row"><span className="profile-label">הרשאה</span><span className="profile-value">{user.isAdmin ? "מנהל" : "משתמש רגיל"}</span></div>
            <div className="buttons">
              <button onClick={() => { setName(user.name); setEmail(user.email); setPhone(user.phone || ""); setCity(user.city || ""); setPassword(""); setEditing(true); }}>עריכת פרטים</button>
              <button className="logout" onClick={logout}>התנתקות</button>
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
              <button className="cancel" onClick={() => { setEditing(false); setPassword(""); setName(user.name); setEmail(user.email); setPhone(user.phone || ""); setCity(user.city || ""); }}>ביטול</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
