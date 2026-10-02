import { useContext, useState } from "react";
import styles from "./CompleteOrder.module.css";
import { useOrderStore } from "../../context/useOrderStore";
import { ItemContext } from "../../context/ItemContext";

const countryCode = [
  { value: "+970", label: "Palestine" },
  { value: "+972", label: "Israel" },
];

const regions = [
  { value: "hebron", label: "الخليل" },
  { value: "dura", label: "دورا" },
  { value: "al-fawwar", label: "الفوار" },
  { value: "bani-naim", label: "بني نعيم" },
  { value: "yatta", label: "يطا" },
  { value: "halhul", label: "حلحول" },
  { value: "beit-ummur", label: "بيت أمر" },
  { value: "al-dhaheriyeh", label: "الظاهرية" },
  { value: "as-samu", label: "السموع" },
  { value: "sa-ir", label: "سعير" },
  { value: "surif", label: "صوريف" },
  { value: "tarqumiyah", label: "ترقوميا" },
  { value: "idhna", label: "إذنا" },
  { value: "beit-kahil", label: "بيت كاحل" },
  { value: "beit-awwa", label: "بيت عوا" },
  { value: "al-arrub", label: "مخيم العروب" },
  { value: "kharas", label: "خاراس" },
  { value: "nuba", label: "نوبا" },
  { value: "ash-shuyukh", label: "الشيوخ" },
  { value: "taffuh", label: "تفوح" },
  { value: "deir-sammit", label: "دير سامت" },
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
          <select
            className={styles.input}
            required
            value={formData.region}
            onChange={(e) =>
              setFormData((p) => ({ ...p, region: e.target.value }))
            }
          >
            <option value="" disabled>
              select region
            </option>
            {regions.map((r) => (
              <option
                key={r.value}
                value={r.value}
                className={styles.selectRegion}
              >
                {r.label}
              </option>
            ))}
          </select>
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
            !formData.fullName.trim() ||
            !formData.phoneNumber.trim() ||
            !formData.region.trim() ||
            submitting
          }
        >
          {submitting ? "جاري الإرسال..." : "completion"}
        </button>
      </form>
    </div>
  );
}
