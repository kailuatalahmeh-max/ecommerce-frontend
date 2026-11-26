import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import styles from "./TrackOrder.module.css";
import { useOrderStore } from "../../context/useOrderStore";
import { COUNTRY_CODES } from "../../utils/constants";
import { getDateLocale } from "../../i18n";
import { formatPrice } from "../../utils/formatPrice";
import { getSavedOrders, saveOrder } from "../../utils/savedOrders";

// نفس حروف رمز التأكيد في الباك إند (بدون 0 O 1 I L)
const CODE_REGEX = /^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{6}$/;

// pending انتهى وقته = expired (حتى لو السيرفر لسا ما حدّثه)
function getConfirmState(confirmation) {
  const { status, expiresAt } = confirmation;
  if (status === "pending" && new Date(expiresAt) < new Date()) {
    return "expired";
  }
  return status;
}

/*
  تتبّع طلب برمز التأكيد (من شاشة واتساب بعد الشراء) + رقم الهاتف.
  الباك إند يطلب الاثنين معاً: POST /api/orders/track
*/
export default function TrackOrder({ handleClose }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const trackOrder = useOrderStore((state) => state.trackOrder);
  const cancelOrder = useOrderStore((state) => state.cancelOrder);

  const [code, setCode] = useState("");
  const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0].value);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  // الرقم الكامل الذي وجدنا به الطلب (نحتاجه للإلغاء)
  const [foundPhone, setFoundPhone] = useState("");
  // عدد الطلبات المحفوظة في هذا المتصفح (localStorage)، لزر "مشاهدة الطلبات المحفوظة"
  const [savedCount] = useState(() => getSavedOrders().length);

  // حروف كبيرة وبدون مسافات: "k7p 2xm" ← "K7P2XM"
  const cleanCode = code.replace(/\s/g, "").toUpperCase();
  const codeIsValid = CODE_REGEX.test(cleanCode);

  // إلغاء الطلب المعروض (فقط Pending)
  async function handleCancel() {
    const code = order.confirmation?.code || cleanCode;
    const result = await cancelOrder({ code, phoneNumber: foundPhone });
    if (result?.order) {
      setOrder(result.order);
    } else if (result?.failed) {
      // مثلاً المتجر قبل الطلب قبل قليل: نعرض الحالة الجديدة
      trackOrder({ code, phoneNumber: foundPhone })
        .then((fresh) => fresh && setOrder(fresh))
        .catch(() => {});
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading || !codeIsValid || !phoneNumber.trim()) return;

    try {
      setLoading(true);
      // نفس شكل الشراء: كود الدولة + الرقم (مثال: +970599123456)
      const fullPhone = `${countryCode}${phoneNumber.trim()}`;
      const found = await trackOrder({ code: cleanCode, phoneNumber: fullPhone });
      // نحفظه في هذا المتصفح، فيظهر في "طلباتي" (مفيد على جهاز جديد)
      saveOrder({ code: cleanCode, phoneNumber: fullPhone });
      setFoundPhone(fullPhone);
      setOrder(found);
    } catch (err) {
      toast.error(err.response?.data?.message || t("trackOrder.notFound"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page} onClick={handleClose}>
      {order ? (
        <div className={styles.form} onClick={(e) => e.stopPropagation()}>
          <div className={styles.iconContainer}>📦</div>
          <h2 className={styles.title}>{t("trackOrder.resultTitle")}</h2>

          <div className={styles.result}>
            <div className={styles.resultRow}>
              <span className={styles.resultLabel}>{t("trackOrder.code")}</span>
              <strong className={styles.resultCode} dir="ltr">
                {order.confirmation?.code || cleanCode}
              </strong>
            </div>

            <div className={styles.resultRow}>
              <span className={styles.resultLabel}>
                {t("trackOrder.orderStatus")}
              </span>
              <span className={styles.statusBadge}>
                {t(`status.${order.status}`, order.status)}
              </span>
            </div>

            {order.confirmation && (
              <div className={styles.resultRow}>
                <span className={styles.resultLabel}>
                  {t("trackOrder.confirmation")}
                </span>
                <span
                  className={`${styles.confirmBadge} ${
                    styles[`confirm_${getConfirmState(order.confirmation)}`]
                  }`}
                >
                  {t(
                    `trackOrder.confirmState.${getConfirmState(order.confirmation)}`,
                  )}
                </span>
              </div>
            )}

            <div className={styles.resultRow}>
              <span className={styles.resultLabel}>{t("trackOrder.date")}</span>
              <span>
                {new Date(order.createdAt).toLocaleString(getDateLocale(), {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <ul className={styles.itemsList}>
              {order.items?.map((item) => (
                <li key={item._id || item.itemId} className={styles.itemRow}>
                  <span className={styles.itemName}>{item.itemName}</span>
                  <span className={styles.itemQty}>
                    {t("myOrders.qty", { count: item.quantity })}
                  </span>
                </li>
              ))}
            </ul>

            <div className={`${styles.resultRow} ${styles.totalRow}`}>
              <span>{t("myOrders.totalAmount")}</span>
              <strong>{formatPrice(order.totalPrice)}</strong>
            </div>
          </div>

          <p className={styles.savedNote}>{t("trackOrder.savedNote")}</p>

          {/* الإلغاء فقط قبل أن يقبل المتجر الطلب */}
          {order.status === "Pending" && (
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={handleCancel}
            >
              ✖ {t("myOrders.cancelButton")}
            </button>
          )}

          <button
            type="button"
            className={styles.submitBtn}
            onClick={() => navigate("/my-orders")}
          >
            {t("trackOrder.seeAllOrders")}
          </button>
          <button
            type="button"
            className={styles.backBtn}
            onClick={() => setOrder(null)}
          >
            {t("trackOrder.searchAgain")}
          </button>
          <button
            type="button"
            className={styles.backBtn}
            onClick={handleClose}
          >
            {t("trackOrder.close")}
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className={styles.form}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.iconContainer}>🔎</div>

          <h2 className={styles.title}>{t("trackOrder.title")}</h2>
          <p className={styles.subtitle}>{t("trackOrder.subtitle")}</p>

          {/* يظهر فقط إذا يوجد طلبات محفوظة على هذا الجهاز */}
          {savedCount > 0 && (
            <>
              <button
                type="button"
                className={styles.savedBtn}
                onClick={() => navigate("/my-orders")}
              >
                📋 {t("trackOrder.viewSaved")}
                <span className={styles.savedCount}>{savedCount}</span>
              </button>
              <p className={styles.divider}>{t("trackOrder.orTrackNew")}</p>
            </>
          )}

          <label className={styles.fieldLabel} htmlFor="trackCode">
            {t("trackOrder.code")}
          </label>
          <div className={styles.inputWrapper}>
            <input
              id="trackCode"
              type="text"
              dir="ltr"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              maxLength={8}
              required
              placeholder="K7P2XM"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className={`${styles.input} ${styles.codeInput}`}
            />
          </div>
          {cleanCode.length > 0 && !codeIsValid && (
            <p className={styles.hint}>{t("trackOrder.codeHint")}</p>
          )}

          <label className={styles.fieldLabel} htmlFor="trackPhone">
            {t("trackOrder.phone")}
          </label>
          <div className={`${styles.inputWrapper} ${styles.phoneRow}`}>
            <select
              name="countryCode"
              aria-label={t("trackOrder.countryCode")}
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className={styles.select}
            >
              {COUNTRY_CODES.map((cc) => (
                <option key={cc.value} value={cc.value}>
                  {t(cc.labelKey)}
                </option>
              ))}
            </select>
            <input
              id="trackPhone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              required
              placeholder="059 XXXXXXX"
              maxLength={11}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={styles.input}
            />
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading || !codeIsValid || !phoneNumber.trim()}
          >
            {loading ? t("trackOrder.searching") : t("trackOrder.submit")}
          </button>
          <button
            type="button"
            className={styles.backBtn}
            onClick={handleClose}
          >
            {t("trackOrder.close")}
          </button>
        </form>
      )}
    </div>
  );
}
