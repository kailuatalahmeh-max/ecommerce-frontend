import { useNavigate } from "react-router-dom";
import { useOrderStore } from "../../context/useOrderStore";
import styles from "./PhoneCheck.module.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { COUNTRY_CODES } from "../../utils/constants";

export default function PhoneCheck({ handleClose }) {
  const { t } = useTranslation();
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

        <h2 className={styles.title}>{t("phoneCheck.title")}</h2>
        <p className={styles.subtitle}>{t("phoneCheck.subtitle")}</p>

        <div className={`${styles.inputWrapper} ${styles.phoneRow}`}>
          <select
            name="countryCode"
            aria-label={t("phoneCheck.countryCode")}
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className={styles.select}
          >
            {COUNTRY_CODES.map((cc) => (
              <option key={cc.value} value={cc.value}>
                {t(cc.labelKey)}
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
          {t("phoneCheck.submit")}
        </button>
        <button
          type="button"
          className={styles.backBtn}
          onClick={() => {
            handleClose();
          }}
        >
          {t("phoneCheck.close")}
        </button>
      </form>
    </div>
  );
}
