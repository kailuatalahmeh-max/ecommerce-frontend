import { useState } from "react";
import styles from "./NewAdminLogIn.module.css";
import toast from "react-hot-toast";
import axios from "axios";
import { useTranslation } from "react-i18next";

import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../context/useAuthStore";

export default function NewAdminLogIn() {
  const { t } = useTranslation();
  const apiUrl = import.meta.env.VITE_API_URL;
  const login = useAuthStore((state) => state.login);

  const [adminData, setAdminData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    const invalid =
      adminData.email.trim().length === 0 ||
      adminData.password.trim().length === 0;

    if (invalid) {
      toast.error(t("login.fillAll"));
      return;
    }

    axios
      .post(`${apiUrl}/api/auth/login`, adminData)
      .then((response) => {
        login(response.data.token);
        navigate("/admin/control-items");
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message || t("login.serverError");
        toast.error(errorMessage);
      });
  }

  return (
    <div className={styles.page}>
      <section className={styles.infoCard}>
        <h3>{t("login.infoTitle")}</h3>
        <ul className={styles.infoList}>
          <li>{t("login.info1")}</li>
          <li>{t("login.info2")}</li>
        </ul>
      </section>
      <form onSubmit={handleSubmit} className={styles.newAdminForm}>
        <label className={styles.inputField}>
          <span>{t("login.email")}</span>
          <input
            type="email"
            placeholder="example@gmail.com"
            value={adminData.email}
            onChange={(e) => {
              setAdminData((p) => ({
                ...p,
                email: e.target.value,
              }));
            }}
          />
        </label>

        <label className={styles.inputField}>
          <span>{t("login.password")}</span>
          <input
            type="password"
            placeholder="••••••••"
            value={adminData.password}
            onChange={(e) => {
              setAdminData((p) => ({
                ...p,
                password: e.target.value,
              }));
            }}
          />
        </label>

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={
            adminData.email.trim().length === 0 ||
            adminData.password.trim().length === 0
          }
        >
          {t("login.submit")}
        </button>
      </form>
    </div>
  );
}
