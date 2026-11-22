import styles from "./Cart.module.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { formatPrice } from "../../utils/formatPrice";
import { useCartStore } from "../../context/useCartStore";

import CompleteOrder from "../completeOrder/CompleteOrder";
import Portal from "../Portal/Portal";
import CartItem from "./CartItem";

export default function Cart({ onClose }) {
  const { t } = useTranslation();
  const cartData = useCartStore((state) => state.cartData);
  const deleteItem = useCartStore((state) => state.deleteItem);
  const addQuantity = useCartStore((state) => state.addQuantity);
  const reducingQuantity = useCartStore((state) => state.reducingQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalPrice = useCartStore((state) => state.totalPrice);

  const [openCompleted, setOpenCompleted] = useState(false);

  function handleClose() {
    setOpenCompleted(false);
  }

  const itemsId = cartData?.map((item) => item?.itemId?._id) || [];
  return (
    <Portal>
      <div className={styles.bodyPage} onClick={onClose}>
        <div className={styles.modalBody} onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className={styles.closeModal}
            onClick={onClose}
            aria-label={t("common.close")}
          >
            ❌
          </button>
          <h2 className={styles.CartTitle}>{t("cart.title")}</h2>
          {cartData?.length === 0 ? (
            <main className={styles.MainContainerCart}>
              <h2 className={styles.CartEmptyMessage}>
                {t("cart.emptyTitle")}
              </h2>

              <p className={styles.CartMainMessage}>{t("cart.emptyText")}</p>

              <button
                className={styles.StartShopBtn}
                type="button"
                onClick={() => {
                  onClose();
                }}
              >
                {t("cart.startShopping")}
              </button>
            </main>
          ) : (
            cartData.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                onReduce={() => reducingQuantity(item._id)}
                onAdd={() => addQuantity(item._id)}
                onDelete={() => deleteItem(item._id)}
              />
            ))
          )}

          <hr className={styles.hr} />
          <div className={styles.footerSection}>
            <p className={styles.CartDetails}>
              <span className={styles.spanQuantity}>{cartData?.length}</span>
              {t("cart.itemsInCart")}{" "}
              <span className={styles.spanQuantity}>
                {t("cart.total", { price: formatPrice(totalPrice()) })}
              </span>
            </p>
            <button
              type="button"
              className={styles.deleteAllBtn}
              onClick={() => {
                clearCart();
              }}
            >
              {t("cart.deleteAll")}
            </button>
          </div>
          <hr className={styles.hr} />
          <div className={styles.btnFooter}>
            <button
              type="button"
              className={styles.addOtherItemsBtn}
              onClick={() => {
                onClose();
              }}
            >
              {t("cart.addMore")}
            </button>
            <button
              type="button"
              className={styles.completingYourOrderBtn}
              onClick={() => {
                setOpenCompleted(true);
              }}
              disabled={cartData?.length === 0}
            >
              {t("cart.checkout")}
            </button>
          </div>
        </div>
        {openCompleted && (
          <CompleteOrder
            onClose={handleClose}
            itemId={itemsId}
            purchaseType={"cart"}
          >
            {" "}
          </CompleteOrder>
        )}
      </div>
    </Portal>
  );
}
