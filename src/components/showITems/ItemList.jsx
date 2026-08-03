import { Link } from "react-router-dom";
import styles from "./itemList.module.css";

export default function ItemList({
  _id,
  imageURL,
  itemName,
  itemPrice,
  itemQuantity,
}) {
  const isOutOfStock = itemQuantity === 0;

  return (
    <Link to={`/itemDetails/${_id}`} className={styles.itemCard}>
      <img src={imageURL} alt={itemName} />
      <span className={styles.itemName}>{itemName}</span>
      <span className={styles.itemPrice}>{itemPrice}$</span>
      <span
        className={styles.stockBadge}
        style={{
          color: isOutOfStock
            ? "#dc2626"
            : itemQuantity <= 5
              ? "#dc2626"
              : "#16a34a",
        }}
      >
        {isOutOfStock
          ? "نفذت الكمية"
          : itemQuantity <= 5
            ? `متبقي ${itemQuantity} فقط`
            : "متوفر"}
      </span>
    </Link>
  );
}
