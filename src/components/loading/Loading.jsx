// Loading.jsx
import styles from "./Loading.module.css";

function Loading() {
  return (
    <div className={styles.page}>
      <p className={styles.loading}>جاري التحميل...</p>
    </div>
  );
}

export default Loading;