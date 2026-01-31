// import React, { useEffect, useState } from "react";
// import "./Profile.scss";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import type { User } from "../../models/user";

// const Profile = () => {
//   const navigate = useNavigate();
//   const storedUser = localStorage.getItem("currentUser");
//   const currentUser = storedUser ? JSON.parse(storedUser) : null;

//   const [user, setUser] = useState<User | null>(null);
//   const [editing, setEditing] = useState(false);
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState(""); // סיסמה לעריכה
//   const [loading, setLoading] = useState(true);

//   // Fetch user details from server
//   useEffect(() => {
//     if (!currentUser) return;

//     const fetchUser = async () => {
//       try {
//         const res = await axios.get(
//           `http://localhost:3000/users/${currentUser.id}`
//         );
//         setUser(res.data);
//         setName(res.data.name);
//         setEmail(res.data.email);
//         setPassword(res.data.password || ""); // אם יש סיסמה בשרת
//       } catch (err) {
//         console.log("שגיאה בטעינת פרטי משתמש", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, [currentUser]);

//   const saveChanges = async () => {
//     if (!user) return;
//     try {
//       const updatedUser = { ...user, name, email, password };
//       await axios.put(`http://localhost:3000/users/${user.id}`, updatedUser);
//       setUser(updatedUser);
//       setEditing(false);
//     } catch (err) {
//       console.log("שגיאה בעדכון פרטי משתמש", err);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("currentUser");
//     navigate("/"); // נשלח לדף לוגין
//   };

//   if (loading) return <p>טוען פרטי משתמש...</p>;
//   if (!user) return <p>משתמש לא נמצא</p>;

//   return (
//     <div className="profile-container">
//       <div className="profile-card">
//         {/* <img
//           src={user.avatar || "/default-avatar.png"}
//           alt={user.name}
//           className="avatar"
//         /> */}

//         {!editing ? (
//           <>
//             <h2>{user.name}</h2>
//             <p>{user.email}</p>
//             <p>סטטוס: {user.isAdmin ? "אדמין" : "משתמש רגיל"}</p>

//             <div className="buttons">
//               <button onClick={() => setEditing(true)}>ערוך פרטים</button>
//               <button onClick={logout}>התנתק</button>
//             </div>
//           </>
//         ) : (
//           <>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="שם מלא"
//               className="profile-input"
//             />

//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="דוא״ל"
//               className="profile-input"
//             />

//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="סיסמה"
//               className="profile-input"
//             />


//             <div className="buttons">
//               <button onClick={saveChanges}>שמור</button>
//               <button onClick={() => setEditing(false)}>ביטול</button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Profile;
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
        console.log("currentUser from localStorage:", currentUser);
        
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
  }, []);

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

      // עדכון גם בלוקל סטורג'
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    } catch (err) {
      console.log("שגיאה בעדכון משתמש", err);
    }
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
          <p>כאן תוכל לצפות ולערוך את הפרטים האישיים שלך.</p>
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
              <button onClick={() => setEditing(true)}>ערוך פרטים</button>
              <button className="logout" onClick={logout}>
                התנתק
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
                onClick={() => {
                  setEditing(false);
                  setPassword("");
                }}
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
