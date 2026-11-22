import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useConfirmStore, answerConfirm } from "../../context/useConfirmStore";
import styles from "./ConfirmDialog.module.css";

const ICONS = {
  danger: "⚠️",
  primary: "❓",
  success: "✅",
};

// يُوضع مرة واحدة في App.jsx
export default function ConfirmDialog() {
  const { t } = useTranslation();
  const dialog = useConfirmStore((state) => state.dialog);
  const loading = useConfirmStore((state) => state.loading);
  const cancelRef = useRef(null);
  const { pathname } = useLocation();

  // التركيز على زر الإلغاء (الخيار الآمن) عند الفتح
  useEffect(() => {
    if (dialog) cancelRef.current?.focus();
  }, [dialog]);

  // Escape = إلغاء
  useEffect(() => {
    if (!dialog) return;
    function handleKey(e) {
      if (e.key === "Escape") answerConfirm(false);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [dialog]);

  // تغيير الصفحة (مثلاً زر الرجوع في الهاتف) = إلغاء
  useEffect(() => {
    answerConfirm(false);
  }, [pathname]);

  if (!dialog) return null;

  const variant = ICONS[dialog.variant] ? dialog.variant : "primary";
  const icon = dialog.icon || ICONS[variant];

  return createPortal(
    <div
      className={styles.overlay}
      onClick={() => answerConfirm(false)}
    >
      <div
        className={styles.box}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`${styles.iconCircle} ${styles[variant]}`}>{icon}</div>

        <h2 id="confirm-title" className={styles.title}>
          {dialog.title || t("common.confirmTitle")}
        </h2>
        <p id="confirm-message" className={styles.message}>
          {dialog.message || t("common.confirmMessage")}
        </p>

        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.btn} ${styles.confirmBtn} ${styles[variant]}`}
            onClick={() => answerConfirm(true)}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <span className={styles.spinner} aria-hidden="true" />
                {t("common.processing")}
              </>
            ) : (
              dialog.confirmText || t("common.confirm")
            )}
          </button>
          <button
            ref={cancelRef}
            type="button"
            className={`${styles.btn} ${styles.cancelBtn}`}
            onClick={() => answerConfirm(false)}
            disabled={loading}
          >
            {dialog.cancelText || t("common.cancel")}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
