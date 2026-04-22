import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./Login.scss";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import api from "../../api";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { loadCart } = useCart();
  const { loadFavorites } = useFavorites();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("כתובת אימייל לא חוקית").required("שדה חובה"),
      password: Yup.string().min(6, "לפחות 6 תווים").required("שדה חובה"),
    }),
    onSubmit: async (values) => {
      try {
        const { data } = await api.post("/auth/login", values);
        localStorage.setItem("token", data.token);
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        loadCart(data.user.id);
        loadFavorites(data.user.id);
        navigate("/home");
      } catch (err: any) {
        setLoginError(err.response?.data?.message || "שגיאה בשרת, נסי שוב מאוחר יותר");
      }
    },
  });

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>כניסה לאתר העוגות שלנו</h1>
        {loginError && <div className="error login-error">{loginError}</div>}

        <form onSubmit={formik.handleSubmit} className="login-form">
          <label htmlFor="email">אימייל</label>
          <input type="email" id="email" name="email" placeholder="example@mail.com"
            value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} />
          {formik.touched.email && formik.errors.email && <div className="error">{formik.errors.email}</div>}

          <label htmlFor="password">סיסמה</label>
          <input type={showPassword ? "text" : "password"} id="password" name="password" placeholder="••••••"
            value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} />
          {formik.touched.password && formik.errors.password && <div className="error">{formik.errors.password}</div>}

          <label className="show-password">
            <input type="checkbox" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} />
            הצג סיסמה
          </label>

          <button type="submit">התחבר</button>
        </form>

        <p className="register-link">
          אין לך חשבון? <Link to="/signin">הרשם כאן</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
