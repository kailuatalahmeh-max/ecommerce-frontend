import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminOrders.module.css";
import { useEffect } from "react";
import { useAdminStore } from "../../context/useAdminStore";

export default function AdminOrders() {
  const getOrdersData = useAdminStore((state) => state.getOrdersData);
  const ordersData = useAdminStore((state) => state.ordersData);
  const updateOrderStatus = useAdminStore((state) => state.updateOrderStatus);

  useEffect(() => {
    getOrdersData();
  }, [getOrdersData]);

  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = ordersData?.filter((order) => {
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phoneNumber.includes(searchTerm) ||
      order.region.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const pendingCount =
    ordersData?.filter((o) => o.status === "Pending").length || 0;
  const acceptedCount =
    ordersData?.filter((o) => o.status === "Accepted").length || 0;
  const deliveredCount =
    ordersData?.filter((o) => o.status === "Delivered").length || 0;
  const cancelledCount =
    ordersData?.filter((o) => o.status === "Cancelled").length || 0;

  return (
    <div className={styles.adminPage}>
      <header className={styles.headerSection}>
        <div>
          <h1 className={styles.titlePage}>لوحة إدارة الطلبات</h1>
          <p className={styles.subTitle}>متابعة وتحديث طلبات الزبائن</p>
        </div>

        <button
          type="button"
          className={`btn-global ${styles.btnBack}`}
          onClick={() => navigate("/admin/control-items")}
        >
          ← العودة للوحة التحكم
        </button>
      </header>

      <section className={styles.statsContainer}>
        <div className={`${styles.statCard} ${styles.pendingBorder}`}>
          <span className={styles.statTitle}>قيد الانتظار</span>
          <span className={styles.statValue}>{pendingCount}</span>
        </div>
        <div className={`${styles.statCard} ${styles.acceptedBorder}`}>
          <span className={styles.statTitle}>مقبولة</span>
          <span className={styles.statValue}>{acceptedCount}</span>
        </div>
        <div className={`${styles.statCard} ${styles.deliveredBorder}`}>
          <span className={styles.statTitle}>تم التوصيل</span>
          <span className={styles.statValue}>{deliveredCount}</span>
        </div>
        <div className={`${styles.statCard} ${styles.cancelledBorder}`}>
          <span className={styles.statTitle}>تم الإلغاء</span>
          <span className={styles.statValue}>{cancelledCount}</span>
        </div>
      </section>

      <section className={styles.controlsSection}>
        <input
          type="text"
          placeholder="ابحث باسم الزبون، الرقم، أو المنطقة..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />

        <div className={styles.selectWrapper}>
          <select
            className={styles.select}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">جميع الحالات</option>
            <option value="Pending">Pending (معلق)</option>
            <option value="Accepted">Accepted (مقبول)</option>
            <option value="Delivered">Delivered (تم التوصيل)</option>
            <option value="Cancelled">Cancelled (ملغى)</option>
          </select>
        </div>
      </section>

      <main className={styles.mainSection}>
        {!filteredOrders || filteredOrders.length === 0 ? (
          <div className={styles.emptyState}>لا توجد طلبات مطابقة للبحث.</div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order._id} className={styles.orderCard}>
              <div className={styles.cardHeader}>
                <div className={styles.customerDetails}>
                  <h3 className={styles.customerName}>{order.customerName}</h3>
                  <span className={styles.customerInfo}>
                    📞 {order.phoneNumber}
                  </span>
                  <span className={styles.customerInfo}>📍 {order.region}</span>
                </div>

                <div className={styles.orderMeta}>
                  <span className={styles.orderDate}>
                    📅{" "}
                    {new Date(order.createdAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>

                  <select
                    className={`${styles.statusSelect} ${styles[order.status.toLowerCase()]}`}
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus({
                        orderId: order._id,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className={styles.cardBody}>
                <p className={styles.itemsTitle}>عناصر الطلب:</p>
                <ul className={styles.itemsList}>
                  {order.items.map((item) => (
                    <li
                      key={item._id || item.itemId}
                      className={styles.itemRow}
                    >
                      <span className={styles.itemName}>{item.itemName}</span>
                      <span className={styles.itemQty}>
                        الكمية: {item.quantity}
                      </span>
                      <span className={styles.itemPrice}>
                        ${item.itemPrice * item.quantity}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.cardFooter}>
                <span className={styles.totalLabel}>المبلغ الإجمالي:</span>
                <span className={styles.totalPrice}>${order.totalPrice}</span>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
