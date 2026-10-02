import { useState } from "react";
import styles from "./MyOrders.module.css";
import { useOrderStore } from "../../context/useOrderStore";
import { useNavigate } from "react-router-dom";

export default function MyOrders() {
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState("");

  const myOrderData = useOrderStore((state) => state.myOrderData);

  const filteredOrders = myOrderData?.filter((order) => {
    if (!statusFilter) return true;

    return order.status === statusFilter;
  });

  let totalPrice = 0;
  filteredOrders?.forEach((order) => {
    totalPrice += order.totalPrice;
  });

  return (
    <div className={styles.myPage}>
      <header className={styles.headerSection}>
        <h1 className={styles.titlePage}>My Orders</h1>
        <div className={styles.selectWrapper}>
          <select
            className={styles.select}
            onChange={(e) => {
              setStatusFilter(e.target.value);
            }}
          >
            <option value="">All Orders</option>
            <option value="Pending">Pending</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </header>

      <main className={styles.mainSection}>
        <div className={styles.orderCard}>
          <div className={styles.cardBody}>
            <p className={styles.itemsTitle}>Items Summary</p>
            {filteredOrders?.map((order) => {
              return (
                <div key={order._id} className={styles.orderCard}>
                  <span className={styles.spanDate}>
                    📅{" "}
                    {new Date(order.createdAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })}
                  </span>
                  <span className={styles.spanStatus}>{order.status}</span>
                  <ul>
                    {order.items.map((item) => (
                      <li key={item._id}>
                        <span>{item.itemName}</span>
                        <span>Qty: {item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                  <span>{order.totalPrice}$</span>
                </div>
              );
            })}
          </div>

          <div className={styles.cardFooter}>
            <div className={styles.priceContainer}>
              <span className={styles.totalLabel}>Total Amount:</span>
              <span className={styles.totalPrice}>${totalPrice}</span>
            </div>

            <button
              type="button"
              className={`btn-global ${styles.BtnBack}`}
              onClick={() => navigate("/")}
            >
              Continue Shopping →
            </button>
          </div>
        </div>
      </main>

      <footer className={styles.footerSection}>
        <div className={styles.supportDetails}>
          <h3 className={styles.supportContactDetails}>
            Need Help? Contact Support
          </h3>
          <div className={styles.contactGrid}>
            <p className={styles.supportEmail}>📧 support@myshop.com</p>
            <p className={styles.supportPhoneNumber}>📞 +970 000 000 000</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
