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

const getTimeUntilFriday = () => {
  const now = new Date();
  const target = new Date();
  const day = now.getDay();
  const daysUntilFriday = day <= 5 ? 5 - day : 6;
  target.setDate(now.getDate() + daysUntilFriday);
  target.setHours(18, 0, 0, 0);
  if (now >= target) target.setDate(target.getDate() + 7);
  const diff = target.getTime() - now.getTime();
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
};

const Home = () => {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [countdown, setCountdown] = useState(getTimeUntilFriday());
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCountdown(getTimeUntilFriday()), 1000);
    return () => clearInterval(timer);
  }, []);

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
          setCurrent(c => { const next = (c + 1) % slides.length; setAnimKey(k => k + 1); return next; });
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

      {/* ── COUNTDOWN ── */}
      <section className="countdown-section">
        <div className="countdown-text">
          <h2>הזמיני עד יום שישי 18:00</h2>
          <p>לקבלת העוגה שלך בסוף השבוע</p>
        </div>
        <div className="countdown-timer">
          {[{ val: countdown.seconds, label: 'שניות' }, { val: countdown.minutes, label: 'דקות' }, { val: countdown.hours, label: 'שעות' }, { val: countdown.days, label: 'ימים' }].map(({ val, label }) => (
            <div key={label} className="countdown-unit">
              <span className="countdown-num">{String(val).padStart(2, '0')}</span>
              <span className="countdown-label">{label}</span>
            </div>
          ))}
        </div>
        <Link to="/home/products" className="countdown-btn">להזמנה עכשיו</Link>
      </section>

      {/* ── FEATURES ── */}
      <section className="features-section">
        <div className="section-header">
          <h2>כלים שיעזרו לך</h2>
          <p>תכנני את העוגה המושלמת לאירוע שלך</p>
        </div>
        <div className="features-grid">
          <Link to="/home/calculator" className="feature-card">
            <div className="feature-icon">🧮</div>
            <h3>מחשבון מחיר</h3>
            <p>קבלי הצעת מחיר מיידית לפי גודל, קומות וקישוטים</p>
            <span className="feature-arrow">לחישוב עכשיו ←</span>
          </Link>
          <Link to="/home/booking" className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>בדיקת זמינות</h3>
            <p>בדקי אילו תאריכים פנויים וקבעי את האירוע שלך</p>
            <span className="feature-arrow">לבדיקה עכשיו ←</span>
          </Link>
          <Link to="/home/products" className="feature-card">
            <div className="feature-icon">🎂</div>
            <h3>קטלוג מוצרים</h3>
            <p>גלישי בין עשרות עוגות ומתוקים מעוצבים</p>
            <span className="feature-arrow">לקטלוג עכשיו ←</span>
          </Link>
        </div>
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
