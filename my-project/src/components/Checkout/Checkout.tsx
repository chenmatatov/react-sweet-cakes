import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./Checkout.scss";
import api from "../../api";

const SHIPPING = 29;

const steps = ["פרטי משלוח", "פרטי תשלום", "אישור הזמנה"];

type ShippingErrors = Partial<Record<"firstName"|"lastName"|"email"|"phone"|"address"|"city"|"zip", string>>;
type PaymentErrors = Partial<Record<"cardNumber"|"cardName"|"expiry"|"cvv", string>>;

const validateShipping = (s: typeof initialShipping): ShippingErrors => {
  const e: ShippingErrors = {};
  if (!s.firstName.trim()) e.firstName = "שדה חובה";
  if (!s.lastName.trim()) e.lastName = "שדה חובה";
  if (!s.email.trim()) e.email = "שדה חובה";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email)) e.email = "אימייל לא תקין";
  if (!s.phone.trim()) e.phone = "שדה חובה";
  else if (!/^0[0-9]{9}$/.test(s.phone)) e.phone = "טלפון לא תקין";
  if (!s.address.trim()) e.address = "שדה חובה";
  if (!s.city.trim()) e.city = "שדה חובה";
  if (!s.zip.trim()) e.zip = "שדה חובה";
  else if (!/^[0-9]{5,7}$/.test(s.zip)) e.zip = "מיקוד לא תקין";
  return e;
};

const validatePayment = (p: typeof initialPayment): PaymentErrors => {
  const e: PaymentErrors = {};
  if (!p.cardNumber.trim()) e.cardNumber = "שדה חובה";
  else if (!/^[0-9]{16}$/.test(p.cardNumber.replace(/\s/g, ""))) e.cardNumber = "מספר כרטיס לא תקין";
  if (!p.cardName.trim()) e.cardName = "שדה חובה";
  if (!p.expiry.trim()) e.expiry = "שדה חובה";
  else if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(p.expiry)) e.expiry = "פורמט MM/YY";
  if (!p.cvv.trim()) e.cvv = "שדה חובה";
  else if (!/^[0-9]{3,4}$/.test(p.cvv)) e.cvv = "CVV לא תקין";
  return e;
};

const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
const nameParts = (currentUser.name || "").split(" ");

const initialShipping = {
  firstName: nameParts[0] || "",
  lastName: nameParts.slice(1).join(" ") || "",
  email: currentUser.email || "",
  phone: currentUser.phone || "",
  address: currentUser.address || "",
  city: currentUser.city || "",
  zip: currentUser.zip || "",
};

const initialPayment = {
  cardNumber: "", cardName: currentUser.name || "", expiry: "", cvv: "",
};

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const [shipping, setShipping] = useState(initialShipping);
  const [payment, setPayment] = useState(initialPayment);
  const [shippingErrors, setShippingErrors] = useState<ShippingErrors>({});
  const [paymentErrors, setPaymentErrors] = useState<PaymentErrors>({});

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = { ...shipping, [e.target.name]: e.target.value };
    setShipping(updated);
    if (shippingErrors[e.target.name as keyof ShippingErrors])
      setShippingErrors({ ...shippingErrors, [e.target.name]: "" });
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = { ...payment, [e.target.name]: e.target.value };
    setPayment(updated);
    if (paymentErrors[e.target.name as keyof PaymentErrors])
      setPaymentErrors({ ...paymentErrors, [e.target.name]: "" });
  };

  const handleShippingNext = () => {
    const errors = validateShipping(shipping);
    if (Object.keys(errors).length > 0) { setShippingErrors(errors); return; }
    setStep(1);
  };

  const handlePaymentNext = () => {
    const errors = validatePayment(payment);
    if (Object.keys(errors).length > 0) { setPaymentErrors(errors); return; }
    setStep(2);
  };

  const handleOrder = async () => {
    try {
      await api.post("/orders", {
        items: items.map(({ product, quantity }) => ({
          productId: product._id || product.id,
          name: product.name,
          price: product.price,
          quantity,
        })),
        shipping,
        totalPrice: totalPrice + SHIPPING,
      });
    } catch (err) {
      console.log("שגיאה בשמירת הזמנה", err);
    }
    clearCart();
    navigate("/home/order-success");
  };

  const Summary = () => (
    <div className="checkout-summary">
      <h3>סיכום</h3>
      <div className="summary-items">
        {items.map(({ product, quantity }) => (
          <div key={product._id || product.id} className="summary-item">
            <img src={product.image} alt={product.name} />
            <span>{product.name} x{quantity}</span>
            <span>₪{product.price * quantity}</span>
          </div>
        ))}
      </div>
      <div className="summary-line"><span>משלוח</span><span>₪{SHIPPING}</span></div>
      <div className="summary-total"><span>סה"כ</span><span>₪{totalPrice + SHIPPING}</span></div>
    </div>
  );

  return (
    <div className="checkout-wrapper" dir="rtl">
      <h1>תשלום</h1>

      {/* Stepper */}
      <div className="stepper">
        {steps.map((label, i) => (
          <div key={i} className={`stepper-step ${i === step ? "active" : i < step ? "done" : ""}`}>
            <div className="stepper-circle">{i + 1}</div>
            <span>{label}</span>
            {i < steps.length - 1 && <div className="stepper-line" />}
          </div>
        ))}
      </div>

      <div className="checkout-content">

        {/* Step 1 - Shipping */}
        {step === 0 && (
          <div className="checkout-form-card">
            <h2>📦 פרטי משלוח</h2>
            <div className="form-row">
              <div className="form-group">
                <label>שם פרטי</label>
                <input name="firstName" value={shipping.firstName} onChange={handleShippingChange} className={shippingErrors.firstName ? "input-error" : ""} />
                {shippingErrors.firstName && <span className="field-error">{shippingErrors.firstName}</span>}
              </div>
              <div className="form-group">
                <label>שם משפחה</label>
                <input name="lastName" value={shipping.lastName} onChange={handleShippingChange} className={shippingErrors.lastName ? "input-error" : ""} />
                {shippingErrors.lastName && <span className="field-error">{shippingErrors.lastName}</span>}
              </div>
            </div>
            <div className="form-group">
              <label>אימייל</label>
              <input name="email" type="email" value={shipping.email} onChange={handleShippingChange} className={shippingErrors.email ? "input-error" : ""} />
              {shippingErrors.email && <span className="field-error">{shippingErrors.email}</span>}
            </div>
            <div className="form-group">
              <label>טלפון</label>
              <input name="phone" value={shipping.phone} onChange={handleShippingChange} className={shippingErrors.phone ? "input-error" : ""} />
              {shippingErrors.phone && <span className="field-error">{shippingErrors.phone}</span>}
            </div>
            <div className="form-group">
              <label>כתובת</label>
              <input name="address" value={shipping.address} onChange={handleShippingChange} className={shippingErrors.address ? "input-error" : ""} />
              {shippingErrors.address && <span className="field-error">{shippingErrors.address}</span>}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>עיר</label>
                <input name="city" value={shipping.city} onChange={handleShippingChange} className={shippingErrors.city ? "input-error" : ""} />
                {shippingErrors.city && <span className="field-error">{shippingErrors.city}</span>}
              </div>
              <div className="form-group">
                <label>מיקוד</label>
                <input name="zip" value={shipping.zip} onChange={handleShippingChange} className={shippingErrors.zip ? "input-error" : ""} />
                {shippingErrors.zip && <span className="field-error">{shippingErrors.zip}</span>}
              </div>
            </div>
            <button className="next-btn" onClick={handleShippingNext}>המשך ←</button>
          </div>
        )}

        {/* Step 2 - Payment */}
        {step === 1 && (
          <div className="checkout-form-card">
            <h2>💳 פרטי תשלום</h2>
            <div className="form-group">
              <label>מספר כרטיס</label>
              <input name="cardNumber" placeholder="0000 0000 0000 0000" value={payment.cardNumber} onChange={handlePaymentChange} className={paymentErrors.cardNumber ? "input-error" : ""} />
              {paymentErrors.cardNumber && <span className="field-error">{paymentErrors.cardNumber}</span>}
            </div>
            <div className="form-group">
              <label>שם בעל הכרטיס</label>
              <input name="cardName" value={payment.cardName} onChange={handlePaymentChange} className={paymentErrors.cardName ? "input-error" : ""} />
              {paymentErrors.cardName && <span className="field-error">{paymentErrors.cardName}</span>}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>תוקף</label>
                <input name="expiry" placeholder="MM/YY" value={payment.expiry} onChange={handlePaymentChange} className={paymentErrors.expiry ? "input-error" : ""} />
                {paymentErrors.expiry && <span className="field-error">{paymentErrors.expiry}</span>}
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input name="cvv" placeholder="123" value={payment.cvv} onChange={handlePaymentChange} className={paymentErrors.cvv ? "input-error" : ""} />
                {paymentErrors.cvv && <span className="field-error">{paymentErrors.cvv}</span>}
              </div>
            </div>
            <div className="btn-row">
              <button className="back-btn" onClick={() => setStep(0)}>← חזרה</button>
              <button className="next-btn" onClick={handlePaymentNext}>המשך ←</button>
            </div>
          </div>
        )}

        {/* Step 3 - Confirm */}
        {step === 2 && (
          <div className="checkout-form-card confirm-card">
            <h2>✅ אישור הזמנה</h2>
            <div className="confirm-section">
              <h4>פרטי משלוח</h4>
              <p>{shipping.firstName} {shipping.lastName}</p>
              <p>{shipping.address}, {shipping.city} {shipping.zip}</p>
              <p>{shipping.email} | {shipping.phone}</p>
            </div>
            <div className="confirm-section">
              <h4>פרטי תשלום</h4>
              <p>כרטיס המסתיים ב-{payment.cardNumber.slice(-4) || "****"}</p>
            </div>
            <div className="btn-row">
              <button className="back-btn" onClick={() => setStep(1)}>← חזרה</button>
              <button className="order-btn" onClick={handleOrder}>אישור והזמנה 🎂</button>
            </div>
          </div>
        )}

        <Summary />
      </div>
    </div>
  );
};

export default Checkout;
