import { useNavigate } from "react-router-dom";
import "./OrderSuccess.scss";

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="order-success-container">
      <div className="order-success-card">
        <div className="success-icon">🎂</div>
        <h1>הזמנתך התקבלה בהצלחה!</h1>
        <p>תודה על הזמנתך, נשמח לשלוח לך את המתוקים בהקדם 🍰</p>
        <button onClick={() => navigate("/home/products")}>המשך לקנות</button>
      </div>
    </div>
  );
};

export default OrderSuccess;
