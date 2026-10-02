import styles from "./itemList.module.css";
import { Link } from "react-router-dom";

import { getFirstImageUrl } from "../../utils/getFirstImageUrl";

export default function ItemList({
  _id,
  imageURL,
  images,
  itemName,
  itemPrice,
  itemQuantity,
}) {
  const isOutOfStock = itemQuantity === 0;

  return (
    <Link to={`/itemDetails/${_id}`} className={styles.itemCard}>
      <img src={getFirstImageUrl({ imageURL, images })} alt={itemName} />{" "}
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
