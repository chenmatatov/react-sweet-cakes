import React, { useEffect, useState } from "react";
import "./Profile.scss";
import axios from "axios";
import type { User } from "../../models/user";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("currentUser");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  const [user, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/users/${Number(currentUser.id)}`);

        setUser(res.data);
        setName(res.data.name);
        setEmail(res.data.email);
      } catch (err) {
        console.log("שגיאה בטעינת משתמש", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [currentUser, navigate]);

  const saveChanges = async () => {
    if (!user) return;

    const updatedUser = {
      ...user,
      name,
      email,
      ...(password && { password }),
    };

    try {
      await axios.put(
        `http://localhost:3000/users/${user.id}`,
        updatedUser
      );
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
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
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
              <span>שם: {user.name}</span>
            </div>

            <div className="profile-row">
              <span>אימייל: {user.email}</span>
            </div>

            <div className="profile-row">
              <span>הרשאה: {user.isAdmin ? "מנהל" : "משתמש רגיל"}</span>
            </div>

            <div className="buttons">
              <button onClick={() => setEditing(true)}>עריכת פרטים</button>
              <button className="logout" onClick={logout}>
                התנתקות
              </button>
            </div>
          </>
        ) : (
          <>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="שם מלא"
              className="profile-input"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="אימייל"
              className="profile-input"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="סיסמה חדשה (אופציונלי)"
              className="profile-input"
            />

            <div className="buttons">
              <button onClick={saveChanges}>שמור</button>
              <button
                className="cancel"
                onClick={cancelEdit}
              >
                ביטול
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;