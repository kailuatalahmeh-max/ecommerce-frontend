import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./AdminOrders.module.css";
import { useEffect } from "react";
import { useAdminStore } from "../../context/useAdminStore";
import { getDateLocale } from "../../i18n";
import { formatPrice } from "../../utils/formatPrice";

const STATUSES = ["Pending", "Accepted", "Delivered", "Cancelled"];

export default function AdminOrders() {
  const { t } = useTranslation();
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
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phoneNumber?.includes(searchTerm) ||
      order.region?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const countByStatus = (status) =>
    ordersData?.filter((o) => o.status === status).length || 0;

  return (
    <div className={styles.adminPage}>
      <header className={styles.headerSection}>
        <div>
          <h1 className={styles.titlePage}>{t("adminOrders.title")}</h1>
          <p className={styles.subTitle}>{t("adminOrders.subtitle")}</p>
        </div>

        <button
          type="button"
          className={`btn-global ${styles.btnBack}`}
          onClick={() => navigate("/admin/control-items")}
        >
          {t("common.backToDashboard")}
        </button>
      </header>

      <section className={styles.statsContainer}>
        <div className={`${styles.statCard} ${styles.pendingBorder}`}>
          <span className={styles.statTitle}>{t("status.Pending")}</span>
          <span className={styles.statValue}>{countByStatus("Pending")}</span>
        </div>
        <div className={`${styles.statCard} ${styles.acceptedBorder}`}>
          <span className={styles.statTitle}>{t("status.Accepted")}</span>
          <span className={styles.statValue}>{countByStatus("Accepted")}</span>
        </div>
        <div className={`${styles.statCard} ${styles.deliveredBorder}`}>
          <span className={styles.statTitle}>{t("status.Delivered")}</span>
          <span className={styles.statValue}>{countByStatus("Delivered")}</span>
        </div>
        <div className={`${styles.statCard} ${styles.cancelledBorder}`}>
          <span className={styles.statTitle}>{t("status.Cancelled")}</span>
          <span className={styles.statValue}>{countByStatus("Cancelled")}</span>
        </div>
      </section>

      <section className={styles.controlsSection}>
        <input
          type="text"
          placeholder={t("adminOrders.search")}
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
            <option value="">{t("adminOrders.allStatuses")}</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {t(`status.${status}`)}
              </option>
            ))}
          </select>
        </div>
      </section>

      <main className={styles.mainSection}>
        {!filteredOrders || filteredOrders.length === 0 ? (
          <div className={styles.emptyState}>{t("adminOrders.empty")}</div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order._id} className={styles.orderCard}>
              <div className={styles.cardHeader}>
                <div className={styles.customerDetails}>
                  <h3 className={styles.customerName}>{order.customerName}</h3>
                  <span className={styles.customerInfo} dir="ltr">
                    📞 {order.phoneNumber}
                  </span>
                  <span className={styles.customerInfo}>
                    📍 {t(`regions.${order.region}`, order.region)}
                  </span>
                </div>

                <div className={styles.orderMeta}>
                  <span className={styles.orderDate}>
                    📅{" "}
                    {new Date(order.createdAt).toLocaleString(getDateLocale(), {
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
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {t(`status.${status}`)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.cardBody}>
                <p className={styles.itemsTitle}>{t("adminOrders.items")}</p>
                <ul className={styles.itemsList}>
                  {order.items.map((item) => (
                    <li
                      key={item._id || item.itemId}
                      className={styles.itemRow}
                    >
                      <span className={styles.itemName}>{item.itemName}</span>
                      <span className={styles.itemQty}>
                        {t("adminOrders.qty", { count: item.quantity })}
                      </span>
                      <span className={styles.itemPrice}>
                        {formatPrice(item.itemPrice * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.cardFooter}>
                <span className={styles.totalLabel}>
                  {t("adminOrders.total")}
                </span>
                <span className={styles.totalPrice}>{formatPrice(order.totalPrice)}</span>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
