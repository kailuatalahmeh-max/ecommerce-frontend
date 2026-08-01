import { useNavigate } from "react-router-dom";
import { useOrderStore } from "../../context/useOrderStore";
import styles from "./PhoneCheck.module.css";
import { useState } from "react";

export default function PhoneCheck({ handleClose }) {
  const getMyOrder = useOrderStore((state) => state.getMyOrder);
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    getMyOrder({ phoneNumber: phoneNumber, navigate: navigate });
  }

  return (
    <div
      className={styles.page}
      onClick={() => {
        handleClose();
      }}
    >
      <form
        onSubmit={handleSubmit}
        className={styles.form}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className={styles.iconContainer}>📱</div>

        <h2 className={styles.title}>التحقق من رقم الهاتف</h2>
        <p className={styles.subtitle}>
          أدخل رقم هاتفك لنتمكن من العثور على طلباتك وتأمين حسابك.
        </p>

        <div className={styles.inputWrapper}>
          <input
            type="tel"
            required
            placeholder="059 XXXXXXX"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className={styles.input}
          />
          <span className={styles.inputFocusLine}></span>
        </div>

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={!phoneNumber.trim()}
        >
          إرسال كود التحقق ←
        </button>
        <button
          className={styles.backBtn}
          onClick={() => {
            handleClose();
          }}
        >
          إغلاق
        </button>
      </form>
    </div>
  );
}
