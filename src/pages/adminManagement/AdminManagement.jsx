import { useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import styles from "./AdminManagement.module.css";
import { useAdminStore } from "../../context/useAdminStore";

export default function AdminManagement() {
  const { t } = useTranslation();
  const createAdminAccount = useAdminStore((state) => state.createAdminAccount);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "admin",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password) {
      return toast.error(t("createAdmin.fillAll"));
    }

    setLoading(true);

    createAdminAccount({
      setFormData: setFormData,
      formData: formData,
      setLoading: setLoading,
    });
  };

  return (
    <div className={styles.managementContainer}>
      <div>
        <div className={styles.managementHeader}>
          <h2>{t("createAdmin.title")}</h2>
          <p>{t("createAdmin.subtitle")}</p>
        </div>

        <div className={styles.contentGrid}>
          <section className={styles.formCard}>
            <h3>{t("createAdmin.formTitle")}</h3>
            <form onSubmit={handleSubmit} className={styles.adminForm}>
              <label className={styles.inputGroup}>
                <span>{t("createAdmin.fullName")}</span>
                <input
                  type="text"
                  name="fullName"
                  placeholder={t("createAdmin.fullNamePlaceholder")}
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </label>

              <label className={styles.inputGroup}>
                <span>{t("createAdmin.email")}</span>
                <input
                  type="email"
                  name="email"
                  placeholder="employee@company.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </label>

              <label className={styles.inputGroup}>
                <span>{t("createAdmin.password")}</span>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </label>

              <label className={styles.inputGroup}>
                <span>{t("createAdmin.role")}</span>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="admin">{t("createAdmin.roleAdmin")}</option>
                  <option value="moderator">
                    {t("createAdmin.roleModerator")}
                  </option>
                  <option value="super_admin">
                    {t("createAdmin.roleSuperAdmin")}
                  </option>
                </select>
              </label>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? t("createAdmin.submitting") : t("createAdmin.submit")}
              </button>
            </form>
          </section>

          <section className={styles.infoCard}>
            <h3>{t("createAdmin.securityTitle")}</h3>
            <ul className={styles.infoList}>
              <li>{t("createAdmin.tip1")}</li>
              <li>{t("createAdmin.tip2")}</li>
              <li>{t("createAdmin.tip3")}</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
