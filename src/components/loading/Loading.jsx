// Loading.jsx
import { useTranslation } from "react-i18next";
import styles from "./Loading.module.css";

function Loading() {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <p className={styles.loading}>{t("common.loading")}</p>
    </div>
  );
}

export default Loading;
