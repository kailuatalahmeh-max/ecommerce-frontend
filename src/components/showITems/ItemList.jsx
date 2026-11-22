import styles from "./itemList.module.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { getFirstImageUrl } from "../../utils/getFirstImageUrl";

export default function ItemList({
  _id,
  imageURL,
  images,
  itemName,
  itemPrice,
  itemQuantity,
}) {
  const { t } = useTranslation();
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
          ? t("stock.out")
          : itemQuantity <= 5
            ? t("stock.few", { count: itemQuantity })
            : t("stock.in")}
      </span>
    </Link>
  );
}
