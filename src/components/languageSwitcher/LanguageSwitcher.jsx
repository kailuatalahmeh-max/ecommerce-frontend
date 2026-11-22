import { useTranslation } from "react-i18next";
import styles from "./LanguageSwitcher.module.css";

// زر عائم لتبديل اللغة (عربي ⇄ English) — يظهر في كل الصفحات
export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const nextLanguage = i18n.language === "ar" ? "en" : "ar";

  return (
    <>
      <button
        type="button"
        className={styles.langBtn}
        onClick={() => i18n.changeLanguage(nextLanguage)}
        aria-label={t("language.aria")}
        lang={nextLanguage}
      >
        <span className={styles.globe} aria-hidden="true">
          🌐
        </span>
        <span>{t("language.switchTo")}</span>
      </button>
      {/* مساحة فارغة في آخر الصفحة حتى لا تغطي الأزرار العائمة آخر المحتوى */}
      <div className={styles.spacer} aria-hidden="true" />
    </>
  );
}
