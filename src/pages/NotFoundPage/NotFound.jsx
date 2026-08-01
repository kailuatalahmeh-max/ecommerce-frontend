import { Link } from "react-router-dom";
import styles from "./NotFound.module.css"; // التأكد من اسم ملف الستايل

// تغيير اسم الدالة إلى NotFound
const NotFound = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>عذراً، الصفحة غير موجودة!</h2>
        <p className={styles.text}>
          يبدو أن الرابط الذي حاولت الوصول إليه غير صحيح، أو أن الصفحة قد تم
          نقلها أو حذفها.
        </p>
        <Link to="/" className={styles.btn}>
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
};

// تغيير اسم التصدير ليتوافق مع الدالة
export default NotFound;
