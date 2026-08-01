import styles from "./Cart.module.css";
import { useCartStore } from "../../context/useCartStore";

import { useState } from "react";

import CompleteOrder from "../completeOrder/CompleteOrder";

export default function Cart({ onClose }) {
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
    <div className={styles.bodyPage} onClick={onClose}>
      {openCompleted && (
        <CompleteOrder
          onClose={handleClose}
          itemId={itemsId}
          purchaseType={"cart"}
        >
          {" "}
        </CompleteOrder>
      )}
      <div className={styles.modalBody} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={styles.closeModal} onClick={onClose}>
          ❌
        </button>
        <h2 className={styles.CartTitle}>Shopping Cart🛒</h2>
        {cartData.length === 0 ? (
          <main
            style={{
              width: "90%",
              maxWidth: "500px",
              minHeight: "300px",
              margin: "40px auto",
              padding: "30px",
              borderRadius: "16px",
              backgroundColor: "#fff",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              gap: "20px",
            }}
          >
            <h2
              style={{
                fontSize: "28px",
                margin: 0,
              }}
            >
              Your cart is empty 🛒{" "}
            </h2>

            <p
              style={{
                color: "#666",
                fontSize: "18px",
                margin: 0,
              }}
            >
              You have not added any products yet.{" "}
            </p>

            <button
              type="button"
              onClick={() => {
                onClose();
              }}
              style={{
                padding: "12px 30px",
                border: "none",
                borderRadius: "10px",
                backgroundColor: "#222",
                color: "#fff",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              Start shopping{" "}
            </button>
          </main>
        ) : (
          cartData.map((item) => {
            return (
              <main key={item._id} className={styles.mainCart}>
                <div className={styles.itemDetails}>
                  <img
                    className={styles.itemImage}
                    src={item.itemId?.imageURL}
                    alt="صورة المنتج"
                  />
                  <div className={styles.itemNameAndPrice}>
                    <p className={styles.itemName}>{item.itemId?.itemName}</p>
                    <p className={styles.itemPrice}>
                      Price:
                      {" " + item.itemId?.itemPrice}$
                    </p>
                    <textarea
                      className={styles.textArea}
                      placeholder="Write your note"
                    ></textarea>
                  </div>
                </div>
                <div className={styles.itemManagement}>
                  <div className={styles.quantitySelector}>
                    <button
                      type="button"
                      className={styles.globalBtn}
                      onClick={() => {
                        reducingQuantity(item._id);
                      }}
                    >
                      -
                    </button>
                    <p className={styles.quantity}>{item.quantity} </p>
                    <button
                      type="button"
                      className={styles.globalBtn}
                      onClick={() => {
                        addQuantity(item._id);
                      }}
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    className={styles.drobFromCart}
                    onClick={() => {
                      deleteItem(item._id);
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </main>
            );
          })
        )}

        <hr className={styles.hr} />
        <div className={styles.footerSection}>
          <p className={styles.CartDetails}>
            <span className={styles.spanQuantity}>{cartData?.length}</span>item
            In your cart{" "}
            <span className={styles.spanQuantity}>{totalPrice()}$</span>
          </p>
          <button
            type="button"
            className={styles.deleteAllBtn}
            onClick={() => {
              clearCart();
            }}
          >
            Delete All{" "}
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
            Add other products{" "}
          </button>
          <button
            type="button"
            className={styles.completingYourOrderBtn}
            onClick={() => {
              setOpenCompleted(true);
            }}
            disabled={cartData.length === 0}
          >
            Completing your order{" "}
          </button>
        </div>
      </div>
    </div>
  );
}
