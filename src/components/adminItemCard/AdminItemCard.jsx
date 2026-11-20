import styles from "./AdminItemCard.module.css";
import { getFirstImageUrl } from "../../utils/getFirstImageUrl";

export default function AdminItemCard({ item, onDelete, openEditing }) {
  const quantity = item.itemQuantity ?? 0;

  let stockClass = styles.inStock;
  let stockText = `متوفر: ${quantity}`;
  if (quantity === 0) {
    stockClass = styles.outOfStock;
    stockText = "نفذت الكمية";
  } else if (quantity <= 5) {
    stockClass = styles.lowStock;
    stockText = `متبقي ${quantity}`;
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
          ✏️ تعديل
        </button>
        <button
          type="button"
          onClick={() => onDelete(item._id)}
          className={styles.deleteBtn}
        >
          🗑️ حذف
        </button>
      </div>
    </div>
  );
}
