import { useContext, useState } from "react";
import { ItemContext } from "../../context/ItemContext";
import styles from "./ViewItemDetails.module.css";
import { useParams } from "react-router-dom";
import { useCartStore } from "../../context/useCartStore";
import CompleteOrder from "../../components/completeOrder/CompleteOrder";
import toast from "react-hot-toast";
export default function ViewItemDetails() {
  const { id } = useParams();
  const { itemsData } = useContext(ItemContext);
  const thisItem = itemsData?.find((item) => item._id === id);
  const addToCart = useCartStore((state) => state.addToCart);

  const [quantity, setQuantity] = useState(1);
  const [openCompleted, setOpenCompleted] = useState(false);

  if (!itemsData || itemsData.length === 0) {
    return (
      <div className={styles.bodyPage}>
        <p>Loading data center...</p>
      </div>
    );
  }

  if (!thisItem) {
    return (
      <div className={styles.bodyPage}>
        <p>Sorry, product not found!</p>{" "}
      </div>
    );
  }

  const totalPrice = thisItem ? Number(quantity) * thisItem.itemPrice : 0;
  const isOutOfStock = thisItem?.itemQuantity === 0;

  function handleAddToCart() {
    if (isOutOfStock || quantity <= 0 || quantity > thisItem.itemQuantity) {
      toast.error("الكمية المطلوبة غير متوفرة");
      return;
    }

    addToCart(thisItem, quantity);
  }

  function handleBuyNow() {
    if (isOutOfStock || quantity <= 0 || quantity > thisItem.itemQuantity) {
      toast.error("الكمية المطلوبة غير متوفرة");
      return;
    }
    setOpenCompleted(true);
  }

  function onClose() {
    setOpenCompleted(false);
  }

  return (
    <div className={styles.bodyPage}>
      {openCompleted && (
        <CompleteOrder
          onClose={onClose}
          itemId={thisItem._id}
          quantity={quantity}
          purchaseType={"direct"}
          totalPrice={totalPrice}
        ></CompleteOrder>
      )}
      <div className={`${styles.productCard} ${styles.imageRight}`}>
        {" "}
        <div className={styles.imageSection}>
          <img
            src={thisItem.imageURL}
            alt={thisItem.itemName}
            className={styles.imgItem}
          />
          <span className={styles.favorites}>❤️</span>
        </div>
        <div className={styles.itemDetails}>
          <h2 className={styles.itemName}>{thisItem.itemName}</h2>
          <div className={styles.priceSection}>
            <p className={styles.priceWord}>Price:</p>
            <span className={styles.lastPrice}>{thisItem.itemPrice}$</span>

            <p className={styles.priceWord}>total Price:</p>
            <span className={styles.lastPrice}>{totalPrice.toFixed(2)}$</span>
          </div>

          <p className={styles.p_availableQuantity}>
            Available Quantity:{" "}
            <span
              className={styles.span_availableQuantity}
              style={{
                backgroundColor:
                  thisItem.itemQuantity <= 5 ? "#fee2e2" : "#f3f4f6",
                color: thisItem.itemQuantity <= 5 ? "#dc2626" : "#1f2937",
                borderColor: thisItem.itemQuantity <= 5 ? "#fca5a5" : "#e5e7eb",
              }}
            >
              {thisItem.itemQuantity}
            </span>
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className={styles.quantityForm}
          >
            <label>
              Select Quantity{" "}
              <span className={styles.maximumQuantity}>
                Max quantity available ({thisItem.itemQuantity}){" "}
              </span>
              <input
                type="number"
                min="1"
                max={thisItem.itemQuantity}
                required
                value={quantity}
                onChange={(e) => {
                  const val = Math.max(
                    1,
                    Math.min(
                      Number(e.target.value),
                      thisItem?.itemQuantity || 1,
                    ),
                  );
                  setQuantity(val);
                }}
              />
            </label>
            <div className={styles.actionsContainer}>
              <button
                disabled={isOutOfStock}
                type="button"
                className="btn-success btn-global"
                onClick={() => {
                  handleBuyNow();
                }}
              >
                {isOutOfStock ? "Out of stock" : "Buy this item"}
              </button>
              <button
                disabled={isOutOfStock}
                type="button"
                onClick={() => {
                  handleAddToCart();
                }}
                className={`${styles.btnSecondary} btn-global`}
              >
                🛒 Add to cart
              </button>
            </div>
          </form>
          <h5 className={styles.codTitle}>Cash on Delivery</h5>
          <p className={styles.desc}>
            We deliver straight to your doorstep. Pay on delivery.
          </p>
        </div>
      </div>
    </div>
  );
}
