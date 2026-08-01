import { useContext, useState } from "react";
import styles from "./CompleteOrder.module.css";
import { useOrderStore } from "../../context/useOrderStore";
import { ItemContext } from "../../context/ItemContext";

const countryCode = [
  { value: "+970", label: "Palestine" },
  { value: "+972", label: "Israel" },
];

export default function CompleteOrder({
  onClose,
  itemId,
  quantity,
  purchaseType,
  totalPrice,
}) {
  const setDirectPurchaseData = useOrderStore(
    (state) => state.setDirectPurchaseData,
  );
  const setCartPurchaseData = useOrderStore(
    (state) => state.setCartPurchaseData,
  );

  const { setItemsData } = useContext(ItemContext);

  const [formData, setFormData] = useState({
    fullName: "",
    countryCode: "+970",
    phoneNumber: "",
    region: "",
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (purchaseType === "direct") {
      setDirectPurchaseData({
        purchaseDetails: formData,
        itemId: itemId,
        quantity: quantity,
        setItemsData: setItemsData,
      });
    } else if (purchaseType === "cart") {
      setCartPurchaseData({ purchaseDetails: formData, itemId: itemId });
    }
    onClose();
  }
  return (
    <div
      className={styles.bodyPage}
      onClick={() => {
        onClose();
      }}
    >
      <form
        className={styles.formPage}
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <button
          type="button"
          className={styles.closeModal}
          onClick={() => {
            onClose();
          }}
        >
          ❌
        </button>
        <h2 className={styles.titleForm}>Complete Order</h2>
        <hr className={styles.hr} />
        <label className={styles.label}>
          Your full name:{" "}
          <input
            className={styles.input}
            type="text"
            required
            placeholder="Two-part name"
            value={formData.fullName}
            onChange={(e) => {
              setFormData((p) => ({ ...p, fullName: e.target.value }));
            }}
          />
        </label>

        <label className={styles.label}>
          Your phone number:{" "}
          <div className={styles.phoneContainer}>
            <select
              name="countryCode"
              className={styles.selectSection}
              value={formData.countryCode}
              onChange={(e) =>
                setFormData((p) => ({ ...p, countryCode: e.target.value }))
              }
            >
              {countryCode.map((CC) => (
                <option
                  key={CC.value}
                  value={CC.value}
                  className={styles.optionsSection}
                >
                  {CC.label}
                </option>
              ))}
            </select>
            <input
              className={styles.inputPhone}
              type="tel"
              required
              placeholder="A phone number to contact you"
              value={formData.phoneNumber}
              onChange={(e) => {
                setFormData((p) => ({ ...p, phoneNumber: e.target.value }));
              }}
            />
          </div>
        </label>
        <label className={styles.label}>
          Region:{" "}
          <input
            className={styles.input}
            type="text"
            required
            placeholder="The area where you want to receive the delivery"
            value={formData.region}
            onChange={(e) => {
              setFormData((p) => ({ ...p, region: e.target.value }));
            }}
          />
        </label>

        {totalPrice && (
          <div className={styles.summaryBox}>
            <span>total price: </span>
            <strong>{totalPrice} ₪</strong>
          </div>
        )}

        <hr className={styles.hr} />
        <button
          type="submit"
          className={styles.btnSubmit}
          disabled={
            !formData.fullName || !formData.phoneNumber || !formData.region
          }
        >
          completion{" "}
        </button>
      </form>
    </div>
  );
}
