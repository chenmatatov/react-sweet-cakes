import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BookingCalendar.scss";

const BUSY_DATES = ["2025-07-25", "2025-07-26", "2025-08-01", "2025-08-08", "2025-08-15", "2025-08-22"];

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDay = (year: number, month: number) => new Date(year, month, 1).getDay();

const MONTHS = ["ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"];
const DAYS = ["א","ב","ג","ד","ה","ו","ש"];

const BookingCalendar = () => {
  const navigate = useNavigate();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", event: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDay(year, month);

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const formatDate = (d: number) => `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const isPast = (d: number) => new Date(formatDate(d)) < new Date(today.toDateString());
  const isBusy = (d: number) => BUSY_DATES.includes(formatDate(d));
  const isSelected = (d: number) => selected === formatDate(d);
  const isToday = (d: number) => formatDate(d) === today.toISOString().split("T")[0];

  const handleSubmit = () => {
    if (!form.name || !form.phone) return;
    setSubmitted(true);
  };

  return (
    <div className="booking-page">
      <div className="booking-container">
        <button className="booking-back" onClick={() => navigate("/home")}>→ חזרה לדף הבית</button>
        <h1>בדיקת זמינות</h1>
        <p className="booking-subtitle">בחרי תאריך לאירוע שלך ושלחי בקשת הזמנה</p>

        <div className="booking-content">
          <div className="calendar-card">
            <div className="calendar-header">
              <button onClick={prevMonth}>‹</button>
              <span>{MONTHS[month]} {year}</span>
              <button onClick={nextMonth}>›</button>
            </div>

            <div className="calendar-days-header">
              {DAYS.map(d => <span key={d}>{d}</span>)}
            </div>

            <div className="calendar-grid">
              {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => (
                <button
                  key={d}
                  className={`cal-day ${isPast(d) ? "past" : ""} ${isBusy(d) ? "busy" : ""} ${isSelected(d) ? "selected" : ""} ${isToday(d) ? "today" : ""}`}
                  disabled={isPast(d) || isBusy(d)}
                  onClick={() => setSelected(formatDate(d))}
                >
                  {d}
                </button>
              ))}
            </div>

            <div className="calendar-legend">
              <span><span className="dot available" />זמין</span>
              <span><span className="dot busy" />תפוס</span>
              <span><span className="dot selected" />נבחר</span>
            </div>
          </div>

          <div className="booking-form-card">
            {!submitted ? (
              <>
                <h2>פרטי הזמנה</h2>
                {selected && <div className="selected-date">תאריך נבחר: <strong>{new Date(selected).toLocaleDateString("he-IL")}</strong></div>}

                <div className="booking-field">
                  <label>שם מלא</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="שם פרטי ומשפחה" />
                </div>
                <div className="booking-field">
                  <label>טלפון</label>
                  <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="050-0000000" />
                </div>
                <div className="booking-field">
                  <label>סוג האירוע</label>
                  <select value={form.event} onChange={e => setForm({ ...form, event: e.target.value })}>
                    <option value="">בחרי סוג אירוע</option>
                    <option>יום הולדת</option>
                    <option>חתונה</option>
                    <option>בר/בת מצווה</option>
                    <option>ברית / קידוש</option>
                    <option>אירוע עסקי</option>
                    <option>אחר</option>
                  </select>
                </div>
                <div className="booking-field">
                  <label>הערות</label>
                  <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="פרטים נוספים על העוגה הרצויה..." rows={3} />
                </div>

                <button
                  className="booking-submit"
                  disabled={!selected || !form.name || !form.phone}
                  onClick={handleSubmit}
                >
                  שלחי בקשת הזמנה
                </button>
              </>
            ) : (
              <div className="booking-success">
                <div className="success-icon">🎉</div>
                <h2>הבקשה נשלחה!</h2>
                <p>תודה {form.name}!</p>
                <p>נחזור אליך בהקדם לאישור ההזמנה לתאריך <strong>{new Date(selected!).toLocaleDateString("he-IL")}</strong></p>
                <button onClick={() => navigate("/home/products")}>לקטלוג המוצרים</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;
