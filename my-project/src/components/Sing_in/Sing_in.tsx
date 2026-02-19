import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "./Sing_in.scss";

const Sing_in: React.FC = () => {
  const navigate = useNavigate();
  const [sing_inError, setSing_inError] = useState("");
  const [sing_inSuccess, setSing_inSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string().required("שדה חובה"),
    email: Yup.string().email("כתובת אימייל לא חוקית").required("שדה חובה"),
    password: Yup.string()
      .min(6, "לפחות 6 תווים")
      .matches(/[A-Z]/, "חייב לכלול אות גדולה")
      .matches(/[0-9]/, "חייב לכלול מספר")
      .matches(/[!@#$%^&*]/, "חייב לכלול תו מיוחד")
      .required("שדה חובה"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), undefined], "הסיסמאות לא תואמות")
      .required("שדה חובה"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.get("http://localhost:3000/users");
        const users = response.data;

        const existingUser = users.find((u: any) => u.email === values.email);
        if (existingUser) {
          setSing_inError("אימייל כבר קיים במערכת");
          return;
        }

        const maxId = users.length > 0 ? Math.max(...users.map((u: any) => Number(u.id))) : 0;

        const newUser = {
          id: String(maxId + 1),
          name: values.name,
          email: values.email,
          password: values.password,
          isAdmin: false,
        };

        await axios.post("http://localhost:3000/users", newUser);

        setSing_inSuccess("הרשמה הצליחה! ניתן להתחבר עכשיו");
        setTimeout(() => navigate("/"), 2000);
      } catch (error) {
        console.error(error);
        setSing_inError("שגיאה בשרת, נסה שוב מאוחר יותר");
      }
    },
  });

  return (
    <div className="singin-page">
      <div className="singin-card">
        <h1>הרשמה לאתר העוגות שלנו</h1>

        {sing_inError && <div className="error singin-error">{sing_inError}</div>}
        {sing_inSuccess && <div className="success">{sing_inSuccess}</div>}

        <form onSubmit={formik.handleSubmit} className="singin-form">
          <label htmlFor="name">שם מלא</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="שם מלא"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name && (
            <div className="error">{formik.errors.name}</div>
          )}

          <label htmlFor="email">אימייל</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="example@mail.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="error">{formik.errors.email}</div>
          )}

          <label htmlFor="password">סיסמה</label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder="••••••"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="error">{formik.errors.password}</div>
          )}

          <label htmlFor="confirmPassword">אישור סיסמה</label>
          <input
            type={showPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            placeholder="••••••"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <div className="error">{formik.errors.confirmPassword}</div>
          )}
          
          <label className="show-password">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
            />
            הצג סיסמה
          </label>

          <button type="submit">הרשמה</button>
        </form>

        <p className="login-link">
          כבר יש לך חשבון? <Link to="/">התחבר כאן</Link>
        </p>
      </div>
    </div>
  );
};

export default Sing_in;
