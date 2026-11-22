import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import styles from "./MyOrders.module.css";
import { useOrderStore } from "../../context/useOrderStore";
import { useNavigate } from "react-router-dom";
import { getDateLocale } from "../../i18n";

const STATUSES = ["Pending", "Accepted", "Delivered", "Cancelled"];

export default function MyOrders() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState("");

  const myOrderData = useOrderStore((state) => state.myOrderData);
  const myOrdersLoading = useOrderStore((state) => state.myOrdersLoading);
  const fetchOrdersByToken = useOrderStore(
    (state) => state.fetchOrdersByToken,
  );

  // يُقرأ في كل render: بعد 401 يحذف الـ store التوكن، فتظهر رسالة "أدخل رقمك"
  const hasToken = !!localStorage.getItem("guestToken");

  // عند فتح الصفحة أو عمل refresh: نجلب الطلبات من جديد بالتوكن المحفوظ
  // (وهكذا تظهر أيضاً آخر حالة للطلب إذا غيّرها الأدمن)
  useEffect(() => {
    if (!localStorage.getItem("guestToken")) return;

    fetchOrdersByToken().catch((err) => {
      toast.error(err.response?.data?.message || t("myOrders.fetchFailed"));
    });
    // t يتغير مع اللغة؛ لا نريد إعادة الجلب عند تغيير اللغة
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchOrdersByToken]);

  const filteredOrders = myOrderData?.filter((order) => {
    if (!statusFilter) return true;

    return order.status === statusFilter;
  });

  let totalPrice = 0;
  filteredOrders?.forEach((order) => {
    totalPrice += order.totalPrice;
  });

  // لا يوجد توكن (أو انتهى): المستخدم يحتاج إدخال رقمه من الصفحة الرئيسية
  if (!hasToken) {
    return (
      <div className={styles.myPage}>
        <div className={styles.stateBox}>
          <div className={styles.stateIcon}>📱</div>
          <h2 className={styles.stateTitle}>{t("myOrders.enterNumberTitle")}</h2>
          <p className={styles.stateText}>{t("myOrders.enterNumberText")}</p>
          <button
            type="button"
            className={`btn-global ${styles.BtnBack}`}
            onClick={() => navigate("/")}
          >
            {t("myOrders.home")}
          </button>
        </div>
      </div>
    );
  }

  // أول تحميل بعد refresh (لا توجد بيانات بعد)
  if (myOrdersLoading && myOrderData.length === 0) {
    return (
      <div className={styles.myPage}>
        <div className={styles.stateBox}>
          <span className={styles.spinner} aria-hidden="true" />
          <p className={styles.stateText}>{t("myOrders.loadingOrders")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.myPage}>
      <header className={styles.headerSection}>
        <h1 className={styles.titlePage}>{t("myOrders.title")}</h1>
        <div className={styles.selectWrapper}>
          <select
            className={styles.select}
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
            }}
          >
            <option value="">{t("myOrders.allOrders")}</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {t(`status.${status}`)}
              </option>
            ))}
          </select>
        </div>
      </header>

      <main className={styles.mainSection}>
        <div className={styles.orderCard}>
          <div className={styles.cardBody}>
            <p className={styles.itemsTitle}>{t("myOrders.itemsSummary")}</p>
            {filteredOrders?.length === 0 && (
              <p className={styles.stateText}>{t("myOrders.noneWithStatus")}</p>
            )}
            {filteredOrders?.map((order) => {
              return (
                <div key={order._id} className={styles.orderCard}>
                  <span className={styles.spanDate}>
                    📅{" "}
                    {new Date(order.createdAt).toLocaleString(getDateLocale(), {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })}
                  </span>
                  <span className={styles.spanStatus}>
                    {t(`status.${order.status}`, order.status)}
                  </span>
                  <ul>
                    {order.items.map((item) => (
                      <li key={item._id}>
                        <span>{item.itemName}</span>
                        <span>{t("myOrders.qty", { count: item.quantity })}</span>
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
              <span className={styles.totalLabel}>
                {t("myOrders.totalAmount")}
              </span>
              <span className={styles.totalPrice}>${totalPrice}</span>
            </div>

            <button
              type="button"
              className={`btn-global ${styles.BtnBack}`}
              onClick={() => navigate("/")}
            >
              {t("myOrders.continueShopping")}
            </button>
          </div>
        </div>
      </main>

      <footer className={styles.footerSection}>
        <div className={styles.supportDetails}>
          <h3 className={styles.supportContactDetails}>
            {t("myOrders.supportTitle")}
          </h3>
          <div className={styles.contactGrid}>
            <p className={styles.supportEmail}>📧 support@myshop.com</p>
            <p className={styles.supportPhoneNumber} dir="ltr">
              📞 +970 000 000 000
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
