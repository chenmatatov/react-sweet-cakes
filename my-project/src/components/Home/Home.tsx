import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Home.scss";

const slides = [
  { img: "/images/heart-cake.jpg",                      title: "באהבה",           sub: "עוגות לב מעוצבות לרגעים הכי מיוחדים" },
  { img: "/images/Numbercake18.jpg",                    title: "עוגות מספרים",    sub: "מותאמות אישית לכל גיל ואירוע" },
  { img: "/images/tiered-wedding-cake.jpg",             title: "עוגות קומות",     sub: "מרשימות, גבוהות ומלאות טעם" },
  { img: "/images/tiered-fruit-cake.jpg",               title: "עוגת פירות",      sub: "טריות, צבעוניות ומלאות טעם" },
  { img: "/images/luxury-tiered-cake.jpg",              title: "עוגת יוקרה",      sub: "עוגות קומות מפוארות לאירועים בלתי נשכחים" },
  { img: "/images/macarons.jpg",                        title: "מקרונים",         sub: "פריכים מבחוץ, רכים מבפנים ומלאי טעם" },
  { img: "/images/tiered-belgian-chocolate-cake.jpg",   title: "עוגות שוקולד",    sub: "עשירות, מפנקות ובלתי נשכחות" },
];

const categories = [
  { img: "/images/tiered-chocolate-nut-cake.jpg",  label: "עוגות שוקולד" },
  { img: "/images/cheesecake.jpg",                 label: "עוגות גבינה" },
  { img: "/images/pistachio-macarons.jpg",         label: "מקרונים" },
  { img: "/images/dessert_box.jpg",                label: "מארזי מתוקים" },
  { img: "/images/raspberry-pie.jpg",              label: "פאי ומאפים" },
  { img: "/images/tiramisu.jpg",                   label: "קינוחים" },
];

const INTERVAL = 4000;

const Home = () => {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (i: number) => {
    setCurrent(i);
    setAnimKey(k => k + 1);
    setProgress(0);
  };

  useEffect(() => {
    setProgress(0);
    if (progressRef.current) clearInterval(progressRef.current);

    const step = 100 / (INTERVAL / 50);
    progressRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          setCurrent(c => {
            const next = (c + 1) % slides.length;
            setAnimKey(k => k + 1);
            return next;
          });
          return 0;
        }
        return p + step;
      });
    }, 50);

    return () => { if (progressRef.current) clearInterval(progressRef.current); };
  }, [current]);

  return (
    <div className="home-wrapper" dir="rtl">

      {/* ── SLIDESHOW ── */}
      <section className="slideshow">

        {/* תמונות */}
        {slides.map((s, i) => (
          <div key={i} className={`slide ${i === current ? "active" : ""}`}>
            <img src={s.img} alt={s.title} />
            <div className="slide-overlay" />
          </div>
        ))}

        {/* progress bar */}
        <div className="slide-progress">
          <div className="slide-progress-bar" style={{ width: `${progress}%` }} />
        </div>

        {/* תוכן */}
        <div className="slide-content" key={animKey}>
          <h1 className="slide-title">{slides[current].title}</h1>
          <p className="slide-sub">{slides[current].sub}</p>
          <Link to="/home/products" className="slide-btn">
            לקנייה עכשיו
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </Link>
        </div>

        {/* thumbnails */}
        <div className="slide-thumbs">
          {slides.map((s, i) => (
            <button key={i} className={`thumb ${i === current ? "active" : ""}`} onClick={() => goTo(i)}>
              <img src={s.img} alt={s.title} />
              {i === current && <div className="thumb-progress" style={{ width: `${progress}%` }} />}
            </button>
          ))}
        </div>

        <button className="slide-arrow right" onClick={() => goTo((current - 1 + slides.length) % slides.length)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
        <button className="slide-arrow left" onClick={() => goTo((current + 1) % slides.length)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="categories-section">
        <div className="section-header">
          <h2>הקטגוריות שלנו</h2>
          <p>בחרי את הקטגוריה המועדפת עליך</p>
        </div>
        <div className="categories-grid">
          {categories.map((c, i) => (
            <Link to="/home/products" key={i} className="category-card">
              <img src={c.img} alt={c.label} />
              <div className="category-overlay" />
              <div className="category-label">
                <span>{c.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;
