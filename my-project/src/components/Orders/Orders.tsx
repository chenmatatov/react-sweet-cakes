import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "./Orders.scss";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  shipping: { firstName: string; lastName: string; address: string; city: string };
  totalPrice: number;
  status: string;
  createdAt: string;
}

const statusMap: Record<string, string> = {
  pending: "ממתינה לאישור",
  confirmed: "אושרה",
  shipped: "בדרך אליך",
  delivered: "נמסרה",
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/orders/my")
      .then(({ data }) => setOrders(data))
      .catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="orders-loading">טוען הזמנות...</p>;

  return (
    <div className="orders-container">
      <h1>ההזמנות שלי</h1>

      {orders.length === 0 ? (
        <div className="orders-empty">
          <span>📋</span>
          <p>אין הזמנות עדיין</p>
          <button onClick={() => navigate("/home/products")}>לחנות</button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-date">
                  {new Date(order.createdAt).toLocaleDateString("he-IL")}
                </div>
                <span className={`order-status status-${order.status}`}>
                  {statusMap[order.status] || order.status}
                </span>
              </div>

              <div className="order-items">
                {order.items.map((item, i) => (
                  <div key={i} className="order-item">
                    <span className="item-name">{item.name}</span>
                    <span className="item-qty">x{item.quantity}</span>
                    <span className="item-price">₪{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <span className="order-address">
                  📍 {order.shipping.address}, {order.shipping.city}
                </span>
                <span className="order-total">סה"כ: ₪{order.totalPrice}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
