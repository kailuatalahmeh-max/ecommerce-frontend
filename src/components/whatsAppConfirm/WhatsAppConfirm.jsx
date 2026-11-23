import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import styles from "./WhatsAppConfirm.module.css";
import { useOrderStore } from "../../context/useOrderStore";
import { getDateLocale } from "../../i18n";

// كل كم ثانية نسأل السيرفر عن حالة التأكيد
const POLL_MS = 5000;

/*
  خطوة ما بعد الشراء: الزبون يرسل رمز التأكيد للمتجر على واتساب.
  confirmation = { orderId, confirmCode, expiresAt, whatsappUrl } (من رد الشراء)
  phoneNumber = رقم الزبون الكامل (مثل +970599123456) لفتح "طلباتي"
*/
export default function WhatsAppConfirm({ confirmation, phoneNumber, onClose }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const getOrderConfirmation = useOrderStore(
    (state) => state.getOrderConfirmation,
  );
  const getMyOrder = useOrderStore((state) => state.getMyOrder);

  const { orderId, confirmCode, expiresAt, whatsappUrl } = confirmation;

  const [status, setStatus] = useState("pending");
  const [checking, setChecking] = useState(false);

  const checkStatus = useCallback(async () => {
    try {
      setChecking(true);
      const newStatus = await getOrderConfirmation(orderId);
      setStatus(newStatus);
    } catch {
      // خطأ شبكة: نحاول مرة ثانية في الدورة القادمة
    } finally {
      setChecking(false);
    }
  }, [getOrderConfirmation, orderId]);

  // ما دام الطلب pending: نسأل كل 5 ثواني، وفوراً لما يرجع الزبون من واتساب
  useEffect(() => {
    if (status !== "pending") return;

    const timer = setInterval(checkStatus, POLL_MS);
    function onVisible() {
      if (document.visibilityState === "visible") checkStatus();
    }
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [status, checkStatus]);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(confirmCode);
      toast.success(t("confirmOrder.copied"));
    } catch {
      // بعض المتصفحات تمنع النسخ (مثلاً بدون https)
      toast.error(t("confirmOrder.copyFailed"));
    }
  }

  const expiresTime = new Date(expiresAt).toLocaleTimeString(getDateLocale(), {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (status === "confirmed") {
    return (
      <div className={styles.box}>
        <div className={styles.bigIcon}>✅</div>
        <h2 className={styles.title}>{t("confirmOrder.confirmedTitle")}</h2>
        <p className={styles.text}>{t("confirmOrder.confirmedText")}</p>
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

  if (status === "expired") {
    return (
      <div className={styles.box}>
        <div className={styles.bigIcon}>⌛</div>
        <h2 className={styles.title}>{t("confirmOrder.expiredTitle")}</h2>
        <p className={styles.text}>{t("confirmOrder.expiredText")}</p>
        <button type="button" className={styles.secondaryBtn} onClick={onClose}>
          {t("common.close")}
        </button>
      </div>
    );
  }

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

      <div className={styles.waiting}>
        <span className={styles.spinner} aria-hidden="true" />
        <span>{t("confirmOrder.waiting")}</span>
      </div>

      <button
        type="button"
        className={styles.secondaryBtn}
        onClick={checkStatus}
        disabled={checking}
      >
        {checking ? t("common.loading") : t("confirmOrder.checkNow")}
      </button>
    </div>
  );
}
