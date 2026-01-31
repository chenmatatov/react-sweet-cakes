import React from "react";
import { Link } from "react-router-dom";
import "./Home.scss";

const Home = () => {
  return (
    <div className="home-container">
      <img
        src="public/images/designer-cakes-to-order.jpg"
        alt="Designer Cakes"
        className="home-image"
      />
      <div className="home-text">
        <h1>ברוכים הבאים</h1>
        <h1>Sweet Cakes</h1>
        <p>
          החנות הכי מתוקה <br />
          עוגות מעוצבות<br />
         מארזים מתוקים וקינוחים<br />
          הכל זמין להזמנה באתר
        </p>
        <Link to="/home/products" className="home-button">
          הצג את המוצרים שלנו
        </Link>
      </div>
    </div>
  );
};

export default Home;
