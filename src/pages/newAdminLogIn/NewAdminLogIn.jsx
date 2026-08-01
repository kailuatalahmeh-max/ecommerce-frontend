import { useState } from "react";
import styles from "./NewAdminLogIn.module.css";
import toast from "react-hot-toast";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../context/useAuthStore";

export default function NewAdminLogIn() {
  const apiUrl = import.meta.env.VITE_API_URL;

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
      toast.error("يرجى ملء جميع الحقول!");
      return;
    }

    axios
      .post(`${apiUrl}/api/admin/logIn`, adminData)
      .then((response) => {
        useAuthStore.getState().login(response.data.token);
        navigate("/admin/control-items");
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message || "خطأ غير متوقع في السيرفر";
        toast.error(errorMessage);
      });
  }

  return (
    <div className={styles.page}>
      <section className={styles.infoCard}>
        <h3>🔒 إرشادات تسجيل الدخول</h3>
        <ul className={styles.infoList}>
          <li>يجب إدخال اسم الأدمن والبريد الإلكتروني وكلمة المرور.</li>
          <li>يجب أن تكون هذه البيانات صادرة من المدير العام فقط.</li>
        </ul>
      </section>
      <form onSubmit={handleSubmit} className={styles.newAdminForm}>
        <label className={styles.inputField}>
          <span>البريد الإلكتروني الرسمي</span>
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
          <span>كلمة المرور </span>
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
          تسجيل دخول
        </button>
      </form>
    </div>
  );
}
