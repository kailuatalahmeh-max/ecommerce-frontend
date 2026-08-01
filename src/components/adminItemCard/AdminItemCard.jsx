import styles from "./AdminItemCard.module.css";

export default function AdminItemCard({ item, onDelete, openEditing }) {
  return (
    <div className={styles.itemCard}>
      <div className={styles.imageWrapper}>
        <img
          src={item.imageURL || "https://via.placeholder.com/150"}
          alt={item.itemName}
        />
      </div>

      <div className={styles.itemInfo}>
        <h4>{item.itemName}</h4>
        <span className={styles.itemPrice}>{item.itemPrice}$</span>
      </div>

      <div className={styles.cardActions}>
        <button onClick={() => onDelete(item._id)} className={styles.deleteBtn}>
          🗑️ حذف المنتج
        </button>
        <button
          onClick={() => {
            openEditing(item);
          }}
          className={styles.editBtn}
        >
          تعديل
        </button>
      </div>
    </div>
  );
}
