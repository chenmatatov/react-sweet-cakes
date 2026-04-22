import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "./Sing_in.scss";
import API_URL from "../../api";

const Sing_in: React.FC = () => {
  const navigate = useNavigate();
  const [sing_inError, setSing_inError] = useState("");
  const [sing_inSuccess, setSing_inSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string().required("שדה חובה"),
    email: Yup.string().email("כתובת אימייל לא חוקית").required("שדה חובה"),
    phone: Yup.string().matches(/^0[0-9]{9}$/, "מספר טלפון לא תקין").required("שדה חובה"),
    city: Yup.string().required("שדה חובה"),
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
    initialValues: { name: "", email: "", phone: "", city: "", password: "", confirmPassword: "" },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.get(`${API_URL}/users`);
        const users = response.data;

        const existingUser = users.find((u: any) => u.email === values.email);
        if (existingUser) { setSing_inError("אימייל כבר קיים במערכת"); return; }

        const maxId = users.length > 0 ? Math.max(...users.map((u: any) => Number(u.id))) : 0;

        await axios.post(`${API_URL}/users`, {
          id: String(maxId + 1),
          name: values.name,
          email: values.email,
          phone: values.phone,
          city: values.city,
          password: values.password,
          isAdmin: false,
        });

        setSing_inSuccess("הרשמה הצליחה! ניתן להתחבר עכשיו");
        setTimeout(() => navigate("/"), 2000);
      } catch (error) {
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
          <input type="text" id="name" name="name" placeholder="שם מלא"
            value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} />
          {formik.touched.name && formik.errors.name && <div className="error">{formik.errors.name}</div>}

          <label htmlFor="email">אימייל</label>
          <input type="email" id="email" name="email" placeholder="example@mail.com"
            value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} />
          {formik.touched.email && formik.errors.email && <div className="error">{formik.errors.email}</div>}

          <div className="form-row">
            <div className="form-col">
              <label htmlFor="phone">טלפון</label>
              <input type="tel" id="phone" name="phone" placeholder="05XXXXXXXX"
                value={formik.values.phone} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              {formik.touched.phone && formik.errors.phone && <div className="error">{formik.errors.phone}</div>}
            </div>
            <div className="form-col">
              <label htmlFor="city">עיר</label>
              <input type="text" id="city" name="city" placeholder="תל אביב"
                value={formik.values.city} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              {formik.touched.city && formik.errors.city && <div className="error">{formik.errors.city}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <label htmlFor="password">סיסמה</label>
              <input type={showPassword ? "text" : "password"} id="password" name="password" placeholder="••••••"
                value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              {formik.touched.password && formik.errors.password && <div className="error">{formik.errors.password}</div>}
            </div>
            <div className="form-col">
              <label htmlFor="confirmPassword">אישור סיסמה</label>
              <input type={showPassword ? "text" : "password"} id="confirmPassword" name="confirmPassword" placeholder="••••••"
                value={formik.values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && <div className="error">{formik.errors.confirmPassword}</div>}
            </div>
          </div>

          <label className="show-password">
            <input type="checkbox" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} />
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
