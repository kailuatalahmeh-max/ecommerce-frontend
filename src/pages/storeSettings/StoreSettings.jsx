import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./StoreSettings.module.css";
import { useAdminStore } from "../../context/useAdminStore";
import Loading from "../../components/loading/Loading";
import { COUNTRY_CODES } from "../../utils/constants";
import { getDateLocale } from "../../i18n";

// نفس تنظيف الباك إند: نحذف المسافات و - والأقواس والنقاط، وصفراً واحداً في البداية
function cleanLocal(input) {
  return input.replace(/[\s\-().]/g, "").replace(/^0/, "");
}

/*
  إعدادات المتجر (super_admin فقط): رقم واتساب المتجر.
  الزبائن يرسلون رمز تأكيد الطلب لهذا الرقم، وبدونه الشراء متوقف.
  الباك إند: GET / PUT /api/store-settings
*/
export default function StoreSettings() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const storeSettings = useAdminStore((state) => state.storeSettings);
  const loading = useAdminStore((state) => state.storeSettingsLoading);
  const getStoreSettings = useAdminStore((state) => state.getStoreSettings);
  const saveStoreWhatsApp = useAdminStore((state) => state.saveStoreWhatsApp);

  const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0].value);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getStoreSettings();
  }, [getStoreSettings]);

  const local = cleanLocal(phoneNumber);
  const isValid = /^\d{9}$/.test(local);
  const fullNumber = `${countryCode}${local}`;
  const current = storeSettings?.whatsappNumber || null;
  const isSame = isValid && fullNumber === current;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValid || isSame || saving) return;

    setSaving(true);
    const saved = await saveStoreWhatsApp(fullNumber);
    setSaving(false);
    if (saved) setPhoneNumber("");
  }

  if (loading && !storeSettings) {
    return <Loading />;
  }

  return (
    <div className={styles.adminPage}>
      <header className={styles.headerSection}>
        <div>
          <h1 className={styles.titlePage}>{t("storeSettings.title")}</h1>
          <p className={styles.subTitle}>{t("storeSettings.subtitle")}</p>
        </div>

        <button
          type="button"
          className={`btn-global ${styles.btnBack}`}
          onClick={() => navigate("/admin/control-items")}
        >
          {t("common.backToDashboard")}
        </button>
      </header>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>💬 {t("storeSettings.whatsappTitle")}</h2>
        <p className={styles.cardText}>{t("storeSettings.whatsappText")}</p>

        {/* الرقم الحالي */}
        {current ? (
          <div className={styles.currentBox}>
            <span className={styles.currentLabel}>{t("storeSettings.current")}</span>
            <strong className={styles.currentNumber} dir="ltr">
              {current}
            </strong>
            {storeSettings?.updatedAt && (
              <span className={styles.updatedText}>
                {t("storeSettings.updated", {
                  date: new Date(storeSettings.updatedAt).toLocaleString(
                    getDateLocale(),
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  ),
                  name: storeSettings.updatedBy || "—",
                })}
              </span>
            )}
          </div>
        ) : (
          <div className={styles.warningBox}>⚠️ {t("storeSettings.noNumber")}</div>
        )}

        {/* رقم جديد */}
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.fieldLabel} htmlFor="storeWhatsApp">
            {current ? t("storeSettings.newNumber") : t("storeSettings.addNumber")}
          </label>
          <div className={styles.phoneRow}>
            <select
              aria-label={t("trackOrder.countryCode")}
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
              id="storeWhatsApp"
              type="tel"
              inputMode="numeric"
              autoComplete="off"
              placeholder="059 XXXXXXX"
              maxLength={14}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={styles.input}
            />
          </div>

          {phoneNumber.trim() && !isValid && (
            <p className={styles.hint}>{t("storeSettings.phoneHint")}</p>
          )}
          {isSame && <p className={styles.hint}>{t("storeSettings.sameNumber")}</p>}
          {isValid && !isSame && (
            <p className={styles.preview}>
              {t("storeSettings.willSave")} <strong dir="ltr">{fullNumber}</strong>
            </p>
          )}

          <button
            type="submit"
            className={styles.saveBtn}
            disabled={!isValid || isSame || saving}
          >
            {saving ? t("common.processing") : t("storeSettings.save")}
          </button>
        </form>
      </section>
    </div>
  );
}
