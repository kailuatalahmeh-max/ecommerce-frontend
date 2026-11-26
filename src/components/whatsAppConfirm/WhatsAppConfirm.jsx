import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import styles from "./WhatsAppConfirm.module.css";
import { useOrderStore } from "../../context/useOrderStore";
import { getDateLocale } from "../../i18n";

/*
  خطوة ما بعد الشراء: الزبون يرسل رمز التأكيد للمتجر على واتساب.
  confirmation = { orderId, confirmCode, expiresAt, whatsappUrl } (من رد الشراء)
  phoneNumber = رقم الزبون الكامل (مثل +970599123456) لفتح "طلباتي"

  الشاشة لا تسأل السيرفر عن حالة التأكيد (المسار مقفل حتى يعمل بوت واتساب).
  الزبون يشوف الحالة في صفحة "طلباتي".
*/
export default function WhatsAppConfirm({ confirmation, phoneNumber, onClose }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const getMyOrder = useOrderStore((state) => state.getMyOrder);

  const { confirmCode, expiresAt, whatsappUrl } = confirmation;

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(confirmCode);
      toast.success(t("confirmOrder.copied"));
    } catch {
      // بعض المتصفحات تمنع النسخ (مثلاً بدون https)
      toast.error(t("confirmOrder.copyFailed"));
    }
  }

  // الوقت ممكن يكون بكرة (24 ساعة)، فنعرض التاريخ كمان
  const expiresTime = new Date(expiresAt).toLocaleString(getDateLocale(), {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={styles.box}>
      <div className={styles.bigIcon}>💬</div>
      <h2 className={styles.title}>{t("confirmOrder.title")}</h2>
      <p className={styles.text}>{t("confirmOrder.text")}</p>

      <div className={styles.codeBox}>
        <span className={styles.codeLabel}>{t("confirmOrder.yourCode")}</span>
        <div className={styles.codeRow}>
          <strong className={styles.code} dir="ltr">
            {confirmCode}
          </strong>
          <button type="button" className={styles.copyBtn} onClick={copyCode}>
            {t("confirmOrder.copy")}
          </button>
        </div>
        <span className={styles.expires}>
          {t("confirmOrder.expiresAt", { time: expiresTime })}
        </span>
      </div>

      <a
        className={styles.whatsappBtn}
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        {t("confirmOrder.openWhatsApp")}
      </a>

      <p className={styles.note}>{t("confirmOrder.afterSend")}</p>

      <button
        type="button"
        className={styles.primaryBtn}
        onClick={() => getMyOrder({ phoneNumber, navigate })}
      >
        {t("confirmOrder.myOrders")}
      </button>
      <button type="button" className={styles.secondaryBtn} onClick={onClose}>
        {t("confirmOrder.done")}
      </button>
    </div>
  );
}
