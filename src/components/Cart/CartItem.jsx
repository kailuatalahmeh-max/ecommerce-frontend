import styles from "./Cart.module.css";
import { useTranslation } from "react-i18next";
import { getFirstImageUrl } from "../../utils/getFirstImageUrl";

export default function CartItem({ item, onReduce, onAdd, onDelete }) {
  const { t } = useTranslation();

  return (
    <main className={styles.mainCart}>
      <div className={styles.itemDetails}>
        <img
          className={styles.itemImage}
          src={getFirstImageUrl(item.itemId)}
          alt={t("cart.imageAlt")}
        />
        <div className={styles.itemNameAndPrice}>
          <p className={styles.itemName}>{item.itemId?.itemName}</p>
          <p className={styles.itemPrice}>
            {t("cart.itemPrice", { price: item.itemId?.itemPrice })}
          </p>
        </div>
      </div>
      <div className={styles.itemManagement}>
        <div className={styles.quantitySelector}>
          <button type="button" className={styles.globalBtn} onClick={onReduce}>
            -
          </button>
          <p className={styles.quantity}>{item.quantity} </p>
          <button type="button" className={styles.globalBtn} onClick={onAdd}>
            +
          </button>
        </div>
        <button
          type="button"
          className={styles.drobFromCart}
          onClick={onDelete}
        >
          🗑️
        </button>
      </div>
    </main>
  );
}
