import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "./Register.scss";

interface RegisterValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const initialValues: RegisterValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

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
      .oneOf([Yup.ref("password"), null], "הסיסמאות לא תואמות")
      .required("שדה חובה"),
  });

  const handleSubmit = async (values: RegisterValues) => {
    try {
      const response = await axios.get("http://localhost:3000/users");
      const users = response.data;

      const existingUser = users.find((u: any) => u.email === values.email);
      if (existingUser) {
        setRegisterError("אימייל כבר קיים במערכת");
        return;
      }

      const newUser = {
        id: String(users.length + 1),
        name: values.name,
        email: values.email,
        password: values.password,
        isAdmin: false,
      };

      await axios.post("http://localhost:3000/users", newUser);

      setRegisterSuccess("הרשמה הצליחה! ניתן להתחבר עכשיו");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error(error);
      setRegisterError("שגיאה בשרת, נסי שוב מאוחר יותר");
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h1>הרשמה לאתר העוגות שלנו</h1>

        {registerError && <div className="error register-error">{registerError}</div>}
        {registerSuccess && <div className="success">{registerSuccess}</div>}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="register-form">
            <label htmlFor="name">שם מלא</label>
            <Field type="text" id="name" name="name" placeholder="שם מלא" />
            <ErrorMessage name="name" component="div" className="error" />

            <label htmlFor="email">אימייל</label>
            <Field type="email" id="email" name="email" placeholder="example@mail.com" />
            <ErrorMessage name="email" component="div" className="error" />

            <label htmlFor="password">סיסמה</label>
            <Field type={showPassword ? "text" : "password"} id="password" name="password" placeholder="••••••" />
            <ErrorMessage name="password" component="div" className="error" />

            <label htmlFor="confirmPassword">אישור סיסמה</label>
            <Field type={showPassword ? "text" : "password"} id="confirmPassword" name="confirmPassword" placeholder="••••••" />
            <ErrorMessage name="confirmPassword" component="div" className="error" />
            
            <label className="show-password">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
              הצג סיסמה
            </label>

            <button type="submit">הרשמה</button>
          </Form>
        </Formik>

        <p className="login-link">
          כבר יש לך חשבון? <Link to="/">התחבר כאן</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
