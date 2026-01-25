import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "./Login.scss";

interface LoginValues {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const initialValues: LoginValues = { email: "", password: "" };

  const validationSchema = Yup.object({
    email: Yup.string().email("כתובת אימייל לא חוקית").required("שדה חובה"),
    password: Yup.string()
      .min(6, "לפחות 6 תווים")
      .required("שדה חובה"),
  });

  const handleSubmit = async (values: LoginValues) => {
    try {
      // קריאה לשרת JSON
      const response = await axios.get("http://localhost:3000/users");
      const users = response.data;

      // חיפוש משתמש עם אימייל וסיסמה
      const user = users.find(
        (u: any) => u.email === values.email && u.password === values.password
      );

      if (!user) {
        setLoginError("אימייל או סיסמה לא נכונים");
        return;
      }

      // שמירת המשתמש ב-localStorage
      localStorage.setItem("currentUser", JSON.stringify(user));

      // ניתוב לדף הבית
      navigate("/home");
    } catch (error) {
      console.error(error);
      setLoginError("שגיאה בשרת, נסי שוב מאוחר יותר");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>כניסה לאתר העוגות שלנו</h1>
        {loginError && <div className="error login-error">{loginError}</div>}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="login-form">
            <label htmlFor="email">אימייל</label>
            <Field
              type="email"
              id="email"
              name="email"
              placeholder="example@mail.com"
            />
            <ErrorMessage name="email" component="div" className="error" />

            <label htmlFor="password">סיסמה</label>
            <Field
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="••••••"
            />
            <ErrorMessage name="password" component="div" className="error" />
            
            <label className="show-password">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
              הצג סיסמה
            </label>

            <button type="submit">התחבר</button>
          </Form>
        </Formik>

        <p className="register-link">
          אין לך חשבון? <Link to="/register">הרשמי כאן</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

