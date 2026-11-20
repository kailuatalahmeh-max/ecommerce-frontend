import { useNavigate } from "react-router-dom";
import { useOrderStore } from "../../context/useOrderStore";
import styles from "./PhoneCheck.module.css";
import { useState } from "react";
import { COUNTRY_CODES } from "../../utils/constants";

export default function PhoneCheck({ handleClose }) {
  const getMyOrder = useOrderStore((state) => state.getMyOrder);
  const navigate = useNavigate();

  const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0].value);
  const [phoneNumber, setPhoneNumber] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    // نرسل الرقم بنفس شكل الشراء: كود الدولة + الرقم (مثال: +970599123456)
    getMyOrder({
      phoneNumber: `${countryCode}${phoneNumber.trim()}`,
      navigate: navigate,
    });
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

        <div className={`${styles.inputWrapper} ${styles.phoneRow}`}>
          <select
            name="countryCode"
            aria-label="كود الدولة"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className={styles.select}
          >
            {COUNTRY_CODES.map((cc) => (
              <option key={cc.value} value={cc.value}>
                {cc.label}
              </option>
            ))}
          </select>
          <input
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
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
          type="button"
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
