import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./NotFound.module.css";

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>{t("notFound.subtitle")}</h2>
        <p className={styles.text}>{t("notFound.text")}</p>
        <Link to="/" className={styles.btn}>
          {t("notFound.home")}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
