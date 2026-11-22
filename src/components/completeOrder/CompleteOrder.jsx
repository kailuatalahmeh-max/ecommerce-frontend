import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./CompleteOrder.module.css";
import { useOrderStore } from "../../context/useOrderStore";
import { ItemContext } from "../../context/ItemContext";
import { COUNTRY_CODES, REGIONS } from "../../utils/constants";

export default function CompleteOrder({
  onClose,
  itemId,
  quantity,
  purchaseType,
  totalPrice,
}) {
  const { t } = useTranslation();
  const setDirectPurchaseData = useOrderStore(
    (state) => state.setDirectPurchaseData,
  );
  const setCartPurchaseData = useOrderStore(
    (state) => state.setCartPurchaseData,
  );

  const { setItemsData } = useContext(ItemContext);

  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    countryCode: "+970",
    phoneNumber: "",
    region: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (purchaseType === "direct") {
        await setDirectPurchaseData({
          purchaseDetails: formData,
          itemId: itemId,
          quantity: quantity,
          setItemsData: setItemsData,
        });
      } else if (purchaseType === "cart") {
        await setCartPurchaseData({ purchaseDetails: formData });
      }
      onClose();
    } catch {
      // تم التعامل مع الخطأ في المخزن
    } finally {
      setSubmitting(false);
    }
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
          aria-label={t("common.close")}
          onClick={() => {
            onClose();
          }}
        >
          ❌
        </button>
        <h2 className={styles.titleForm}>{t("checkout.title")}</h2>
        <hr className={styles.hr} />
        <label className={styles.label}>
          {t("checkout.fullName")}
          <input
            className={styles.input}
            type="text"
            required
            placeholder={t("checkout.fullNamePlaceholder")}
            value={formData.fullName}
            onChange={(e) => {
              setFormData((p) => ({ ...p, fullName: e.target.value }));
            }}
          />
        </label>

        <label className={styles.label}>
          {t("checkout.phone")}
          <div className={styles.phoneContainer}>
            <select
              name="countryCode"
              className={styles.selectSection}
              value={formData.countryCode}
              onChange={(e) =>
                setFormData((p) => ({ ...p, countryCode: e.target.value }))
              }
            >
              {COUNTRY_CODES.map((CC) => (
                <option
                  key={CC.value}
                  value={CC.value}
                  className={styles.optionsSection}
                >
                  {t(CC.labelKey)}
                </option>
              ))}
            </select>
            <input
              className={styles.inputPhone}
              type="tel"
              required
              placeholder={t("checkout.phonePlaceholder")}
              value={formData.phoneNumber}
              onChange={(e) => {
                setFormData((p) => ({ ...p, phoneNumber: e.target.value }));
              }}
            />
          </div>
        </label>
        <label className={styles.label}>
          {t("checkout.region")}
          <select
            className={styles.input}
            required
            value={formData.region}
            onChange={(e) =>
              setFormData((p) => ({ ...p, region: e.target.value }))
            }
          >
            <option value="" disabled>
              {t("checkout.selectRegion")}
            </option>
            {REGIONS.map((region) => (
              <option
                key={region}
                value={region}
                className={styles.selectRegion}
              >
                {t(`regions.${region}`)}
              </option>
            ))}
          </select>
        </label>

        {totalPrice && (
          <div className={styles.summaryBox}>
            <span>{t("checkout.totalPrice")} </span>
            <strong>{totalPrice} ₪</strong>
          </div>
        )}

        <hr className={styles.hr} />
        <button
          type="submit"
          className={styles.btnSubmit}
          disabled={
            !formData.fullName.trim() ||
            !formData.phoneNumber.trim() ||
            !formData.region.trim() ||
            submitting
          }
        >
          {submitting ? t("checkout.submitting") : t("checkout.submit")}
        </button>
      </form>
    </div>
  );
}
