import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PriceCalculator.scss";

const cakeTypes = [
  { id: "tiered", label: "עוגת קומות", base: 180 },
  { id: "number", label: "עוגת מספר", base: 170 },
  { id: "regular", label: "עוגה רגילה", base: 80 },
  { id: "pie", label: "פאי / טארט", base: 90 },
  { id: "cookies", label: "עוגיות (תריסר)", base: 40 },
];

const flavors = [
  { id: "vanilla", label: "וניל", price: 0 },
  { id: "chocolate", label: "שוקולד", price: 10 },
  { id: "cheesecake", label: "גבינה", price: 15 },
  { id: "redvelvet", label: "רד וולווט", price: 20 },
  { id: "caramel", label: "קרמל מלוח", price: 20 },
  { id: "pistachio", label: "פיסטוק", price: 25 },
];

const decorations = [
  { id: "none", label: "ללא קישוטים", price: 0 },
  { id: "flowers", label: "פרחי סוכר", price: 30 },
  { id: "macarons", label: "מקרונים", price: 45 },
  { id: "gold", label: "גימור זהב", price: 60 },
  { id: "custom", label: "עיצוב מותאם אישית", price: 80 },
];

const PriceCalculator = () => {
  const navigate = useNavigate();
  const [type, setType] = useState(cakeTypes[0]);
  const [tiers, setTiers] = useState(1);
  const [servings, setServings] = useState(10);
  const [flavor, setFlavor] = useState(flavors[0]);
  const [decoration, setDecoration] = useState(decorations[0]);
  const [calculated, setCalculated] = useState(false);

  const isTiered = type.id === "tiered";

  const total = Math.round(
    type.base +
    (isTiered ? (tiers - 1) * 60 : 0) +
    (servings / 10) * 20 +
    flavor.price +
    decoration.price
  );

  return (
    <div className="calc-page">
      <div className="calc-container">
        <button className="calc-back" onClick={() => navigate("/home")}>→ חזרה לדף הבית</button>
        <h1>מחשבון מחיר</h1>
        <p className="calc-subtitle">קבלי הצעת מחיר מיידית לעוגה המושלמת שלך</p>

        <div className="calc-content">
          <div className="calc-form">

            <div className="calc-section">
              <h3>סוג עוגה</h3>
              <div className="calc-options">
                {cakeTypes.map(t => (
                  <button key={t.id} className={`calc-option ${type.id === t.id ? "active" : ""}`}
                    onClick={() => { setType(t); setCalculated(false); }}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {isTiered && (
              <div className="calc-section">
                <h3>מספר קומות</h3>
                <div className="calc-stepper">
                  <button onClick={() => setTiers(t => Math.max(1, t - 1))}>−</button>
                  <span>{tiers}</span>
                  <button onClick={() => setTiers(t => Math.min(5, t + 1))}>+</button>
                </div>
              </div>
            )}

            <div className="calc-section">
              <h3>מספר מנות: <span>{servings}</span></h3>
              <input type="range" min={5} max={60} step={5} value={servings}
                onChange={e => { setServings(Number(e.target.value)); setCalculated(false); }} />
              <div className="calc-range-labels"><span>5</span><span>60</span></div>
            </div>

            <div className="calc-section">
              <h3>טעם קרם</h3>
              <div className="calc-options">
                {flavors.map(f => (
                  <button key={f.id} className={`calc-option ${flavor.id === f.id ? "active" : ""}`}
                    onClick={() => { setFlavor(f); setCalculated(false); }}>
                    {f.label} {f.price > 0 && <span>+₪{f.price}</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="calc-section">
              <h3>קישוטים</h3>
              <div className="calc-options">
                {decorations.map(d => (
                  <button key={d.id} className={`calc-option ${decoration.id === d.id ? "active" : ""}`}
                    onClick={() => { setDecoration(d); setCalculated(false); }}>
                    {d.label} {d.price > 0 && <span>+₪{d.price}</span>}
                  </button>
                ))}
              </div>
            </div>

            <button className="calc-submit" onClick={() => setCalculated(true)}>
              חשבי לי את המחיר
            </button>
          </div>

          <div className={`calc-result ${calculated ? "visible" : ""}`}>
            <div className="result-card">
              <div className="result-icon">🎂</div>
              <h2>הצעת המחיר שלך</h2>
              <div className="result-breakdown">
                <div className="result-row"><span>בסיס {type.label}</span><span>₪{type.base}</span></div>
                {isTiered && tiers > 1 && <div className="result-row"><span>{tiers} קומות</span><span>+₪{(tiers - 1) * 60}</span></div>}
                <div className="result-row"><span>{servings} מנות</span><span>+₪{Math.round((servings / 10) * 20)}</span></div>
                {flavor.price > 0 && <div className="result-row"><span>קרם {flavor.label}</span><span>+₪{flavor.price}</span></div>}
                {decoration.price > 0 && <div className="result-row"><span>{decoration.label}</span><span>+₪{decoration.price}</span></div>}
              </div>
              <div className="result-total">
                <span>סה"כ משוער</span>
                <span className="result-price">₪{total}</span>
              </div>
              <p className="result-note">* המחיר הסופי נקבע לאחר שיחה אישית</p>
              <button className="result-order-btn" onClick={() => navigate("/home/products")}>
                לקטלוג המוצרים
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceCalculator;
