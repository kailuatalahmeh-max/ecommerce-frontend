import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./BackButton.module.css";

// زر رجوع عائم يظهر في كل الصفحات ما عدا الصفحة الرئيسية
export default function BackButton() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useTranslation();

  if (pathname === "/") return null;

  function handleBack() {
    // React Router يحفظ رقم الصفحة في history.state.idx
    // إذا فتح المستخدم الصفحة مباشرة (بدون صفحة سابقة) نرجعه للرئيسية
    const idx = window.history.state?.idx ?? 0;
    if (idx > 0) {
      navigate(-1);
    } else {
      navigate("/", { replace: true });
    }
  }

  return (
    <button
      type="button"
      className={styles.backBtn}
      onClick={handleBack}
      aria-label={t("common.backAria")}
    >
      <svg
        className={styles.icon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
      <span>{t("common.back")}</span>
    </button>
  );
}
