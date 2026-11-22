import styles from "./AdminItemCard.module.css";
import { useTranslation } from "react-i18next";
import { getFirstImageUrl } from "../../utils/getFirstImageUrl";

export default function AdminItemCard({ item, onDelete, openEditing }) {
  const { t } = useTranslation();
  const quantity = item.itemQuantity ?? 0;

  let stockClass = styles.inStock;
  let stockText = t("stock.available", { count: quantity });
  if (quantity === 0) {
    stockClass = styles.outOfStock;
    stockText = t("stock.out");
  } else if (quantity <= 5) {
    stockClass = styles.lowStock;
    stockText = t("stock.left", { count: quantity });
  }

  return (
    <div className={styles.itemCard}>
      <div className={styles.imageWrapper}>
        <img src={getFirstImageUrl(item)} alt={item.itemName} />
      </div>

      <div className={styles.itemInfo}>
        <h4 title={item.itemName}>{item.itemName}</h4>
        <span className={styles.itemPrice}>{item.itemPrice}$</span>
        <span className={`${styles.stockBadge} ${stockClass}`}>
          {stockText}
        </span>
      </div>

      <div className={styles.cardActions}>
        <button
          type="button"
          onClick={() => {
            openEditing(item);
          }}
          className={styles.editBtn}
        >
          {t("admin.edit")}
        </button>
        <button
          type="button"
          onClick={() => onDelete(item._id)}
          className={styles.deleteBtn}
        >
          {t("admin.delete")}
        </button>
      </div>
    </div>
  );
}
