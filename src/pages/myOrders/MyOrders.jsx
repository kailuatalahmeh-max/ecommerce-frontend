import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import styles from "./MyOrders.module.css";
import { useOrderStore } from "../../context/useOrderStore";
import { useNavigate } from "react-router-dom";
import { getDateLocale } from "../../i18n";
import { formatPrice } from "../../utils/formatPrice";
import { getSavedOrders } from "../../utils/savedOrders";

const STATUSES = ["Pending", "Accepted", "Delivered", "Cancelled"];

const apiUrl = import.meta.env.VITE_API_URL;

// "+970599111222" ← "+970 599 111 222" (أسهل للقراءة)
function formatPhone(phone) {
  const local = phone.slice(-9);
  const code = phone.slice(0, -9);
  return `${code} ${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`;
}

// pending انتهى وقته = expired (حتى لو السيرفر لسا ما حدّثه)
function getConfirmState(confirmation) {
  const { status, expiresAt } = confirmation;
  if (status === "pending" && new Date(expiresAt) < new Date()) {
    return "expired";
  }
  return status;
}

const CONFIRM_CLASSES = {
  pending: styles.confirmPending,
  confirmed: styles.confirmConfirmed,
  expired: styles.confirmExpired,
};

/*
  "طلباتي": الطلبات المحفوظة في هذا المتصفح فقط (utils/savedOrders.js).
  كل مرة تُفتح الصفحة (أو refresh) نجيب البيانات الجديدة من السيرفر
  بطلب واحد: POST /api/orders/track-many
*/
export default function MyOrders() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState("");
  // رقم واتساب المتجر من إعدادات المتجر (GET /api/store-settings/public)
  const [supportPhone, setSupportPhone] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get(`${apiUrl}/api/store-settings/public`, { signal: controller.signal })
      .then((res) => setSupportPhone(res.data?.data?.whatsappNumber || null))
      .catch(() => {
        // بدون رقم: قسم الدعم لا يظهر (ليس خطأً مهماً للزبون)
      });
    return () => controller.abort();
  }, []);

  const myOrderData = useOrderStore((state) => state.myOrderData);
  const myOrdersLoading = useOrderStore((state) => state.myOrdersLoading);
  const fetchSavedOrders = useOrderStore((state) => state.fetchSavedOrders);
  const removeOrderFromDevice = useOrderStore(
    (state) => state.removeOrderFromDevice,
  );
  const clearAllOrdersFromDevice = useOrderStore(
    (state) => state.clearAllOrdersFromDevice,
  );
  const cancelOrder = useOrderStore((state) => state.cancelOrder);

  useEffect(() => {
    fetchSavedOrders().catch((err) => {
      toast.error(err.response?.data?.message || t("myOrders.fetchFailed"));
    });
    // t يتغير مع اللغة؛ لا نريد إعادة الجلب عند تغيير اللغة
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchSavedOrders]);

  // الطلبات الموجودة تُفلتر بالحالة؛ "غير موجود" يظهر فقط مع "كل الطلبات"
  const visible = myOrderData.filter((entry) => {
    if (entry.status !== "found") return !statusFilter;
    return !statusFilter || entry.order.status === statusFilter;
  });

  // الطلبات الملغية لا تدخل في الإجمالي
  const totalPrice = visible.reduce(
    (sum, entry) =>
      entry.status === "found" && entry.order.status !== "Cancelled"
        ? sum + entry.order.totalPrice
        : sum,
    0,
  );

  // لا يوجد أي طلب محفوظ في هذا المتصفح
  if (!myOrdersLoading && getSavedOrders().length === 0) {
    return (
      <div className={styles.myPage}>
        <div className={styles.stateBox}>
          <div className={styles.stateIcon}>📦</div>
          <h2 className={styles.stateTitle}>{t("myOrders.emptyTitle")}</h2>
          <p className={styles.stateText}>{t("myOrders.emptyText")}</p>
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

  // أول تحميل (لا توجد بيانات بعد)
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
        <div className={styles.headerActions}>
          <div className={styles.selectWrapper}>
            <select
              className={styles.select}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">{t("myOrders.allOrders")}</option>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {t(`status.${status}`)}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            className={styles.clearAllBtn}
            onClick={clearAllOrdersFromDevice}
          >
            {t("myOrders.clearAll")}
          </button>
        </div>
      </header>

      <p className={styles.deviceNote}>{t("myOrders.deviceNote")}</p>

      <main className={styles.mainSection}>
        <div className={styles.orderCard}>
          <div className={styles.cardBody}>
            <p className={styles.itemsTitle}>{t("myOrders.itemsSummary")}</p>
            {visible.length === 0 && (
              <p className={styles.stateText}>{t("myOrders.noneWithStatus")}</p>
            )}

            {visible.map((entry) => {
              const removeButton = (
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => removeOrderFromDevice(entry.code)}
                  aria-label={t("myOrders.removeButton")}
                  title={t("myOrders.removeButton")}
                >
                  🗑️
                </button>
              );

              // الطلب لم يعد موجوداً (أو بيانات محفوظة تالفة)
              if (entry.status !== "found") {
                return (
                  <div
                    key={entry.code || entry.phoneNumber}
                    className={`${styles.savedOrder} ${styles.missingOrder}`}
                  >
                    <div className={styles.orderTop}>
                      <strong className={styles.missingTitle}>
                        ⚠️ {t("myOrders.notFoundTitle")}
                      </strong>
                      {removeButton}
                    </div>
                    <span className={styles.orderCode} dir="ltr">
                      {entry.code}
                    </span>
                    <p className={styles.missingText}>
                      {t("myOrders.notFoundText")}
                    </p>
                  </div>
                );
              }

              const { order } = entry;
              return (
                <div key={entry.code} className={styles.savedOrder}>
                  <div className={styles.orderTop}>
                    <span className={styles.orderDate}>
                      📅{" "}
                      {new Date(order.createdAt).toLocaleString(
                        getDateLocale(),
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        },
                      )}
                    </span>
                    {removeButton}
                  </div>

                  <div className={styles.badges}>
                    <span className={styles.orderStatus}>
                      {t(`status.${order.status}`, order.status)}
                    </span>
                    {order.confirmation && (
                      <span
                        className={`${styles.confirmBadge} ${
                          CONFIRM_CLASSES[getConfirmState(order.confirmation)]
                        }`}
                      >
                        {t(
                          `myOrders.confirm.${getConfirmState(order.confirmation)}`,
                          { code: order.confirmation.code },
                        )}
                      </span>
                    )}
                  </div>

                  <ul className={styles.orderItems}>
                    {order.items.map((item) => (
                      <li key={item._id || item.itemId}>
                        <span>{item.itemName}</span>
                        <span>{t("myOrders.qty", { count: item.quantity })}</span>
                      </li>
                    ))}
                  </ul>
                  <span className={styles.orderPrice}>
                    {formatPrice(order.totalPrice)}
                  </span>

                  {/* الإلغاء فقط قبل أن يقبل المتجر الطلب */}
                  {order.status === "Pending" && (
                    <button
                      type="button"
                      className={styles.cancelBtn}
                      onClick={() =>
                        cancelOrder({
                          code: entry.code,
                          phoneNumber: entry.phoneNumber,
                        })
                      }
                    >
                      ✖ {t("myOrders.cancelButton")}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className={styles.cardFooter}>
            <div className={styles.priceContainer}>
              <span className={styles.totalLabel}>
                {t("myOrders.totalAmount")}
              </span>
              <span className={styles.totalPrice}>{formatPrice(totalPrice)}</span>
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

      {/* الدعم: رقم واتساب المتجر من الإعدادات. بدون رقم لا يظهر هذا القسم */}
      {supportPhone && (
        <footer className={styles.footerSection}>
          <div className={styles.supportDetails}>
            <h3 className={styles.supportContactDetails}>
              {t("myOrders.supportTitle")}
            </h3>
            <div className={styles.contactGrid}>
              <a
                className={styles.supportLink}
                href={`https://wa.me/${supportPhone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                💬 {t("myOrders.supportWhatsApp")}
              </a>
              <a
                className={styles.supportLink}
                href={`tel:${supportPhone}`}
                dir="ltr"
              >
                📞 {formatPhone(supportPhone)}
              </a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
