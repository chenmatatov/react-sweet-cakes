import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.scss";

const slides = [
  { img: "/images/heart-cake.jpg",                        title: "באהבה",             sub: "עוגות לב מעוצבות לרגעים הכי מיוחדים" },
  { img: "/images/Numbercake18.jpg",                      title: "עוגות מספרים",      sub: "מותאמות אישית לכל גיל ואירוע" },
  { img: "/images/tiered-wedding-cake.jpg",               title: "עוגות קומות",       sub: "מרשימות, גבוהות ומלאות טעם" },
  { img: "/images/tiered-fruit-cake.jpg",                 title: "עוגת פירות",        sub: "טריות, צבעוניות ומלאות טעם" },
  { img: "/images/luxury-tiered-cake.jpg",                title: "עוגת יוקרה",         sub: "עוגות קומות מפוארות לאירועים בלתי נשכחים" },
  { img: "/images/macarons.jpg",                         title: "מקרונים",           sub: "פריכים מבחוץ, רכים מבפנים ומלאי טעם" },
  { img: "/images/tiered-belgian-chocolate-cake.jpg",     title: "עוגות שוקולד",      sub: "עשירות, מפנקות ובלתי נשכחות" },
];

const categories = [
  { img: "/images/tiered-chocolate-nut-cake.jpg",  label: "עוגות שוקולד" },
  { img: "/images/cheesecake.jpg",                 label: "עוגות גבינה" },
  { img: "/images/pistachio-macarons.jpg",          label: "מקרונים" },
  { img: "/images/dessert_box.jpg",                label: "מארזי מתוקים" },
  { img: "/images/raspberry-pie.jpg",              label: "פאי ומאפים" },
  { img: "/images/tiramisu.jpg",                   label: "קינוחים" },
];

const Home = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="home-wrapper" dir="rtl">

      {/* ── SLIDESHOW ── */}
      <section className="slideshow">
        {slides.map((s, i) => (
          <div key={i} className={`slide ${i === current ? "active" : ""}`}>
            <img src={s.img} alt={s.title} />
            <div className="slide-overlay" />
          </div>
        ))}

        <div className="slide-content">
          <p className="slide-brand">Sweet Cakes 🍰</p>
          <h1 className="slide-title">{slides[current].title}</h1>
          <p className="slide-sub">{slides[current].sub}</p>
          <Link to="/home/products" className="slide-btn">לקנייה עכשיו</Link>
        </div>

        <div className="slide-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === current ? "active" : ""}`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>

        <button className="slide-arrow right" onClick={() => setCurrent(p => (p - 1 + slides.length) % slides.length)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
        <button className="slide-arrow left" onClick={() => setCurrent(p => (p + 1) % slides.length)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="categories-section">
        <h2>הקטגוריות שלנו</h2>
        <div className="categories-grid">
          {categories.map((c, i) => (
            <Link to="/home/products" key={i} className="category-card">
              <img src={c.img} alt={c.label} />
              <div className="category-label">{c.label}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── BANNER ── */}
      <section className="banner">
        <div className="banner-text">
          <h2>הזמיני עוגה מותאמת אישית ✨</h2>
          <p>כל עוגה נאפית בהזמנה עם חומרים טריים ואהבה אמיתית</p>
          <Link to="/home/products" className="banner-btn">לכל המוצרים</Link>
        </div>
      </section>

    </div>
  );
};

export default Home;
