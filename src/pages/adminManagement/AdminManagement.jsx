import { useState } from "react";
import { toast } from "react-hot-toast";
import styles from "./AdminManagement.module.css";
import { useAdminStore } from "../../context/useAdminStore";

export default function AdminManagement() {
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
      return toast.error("يرجى ملء جميع الحقول المطلوبة!");
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
          <h2>👥 إدارة شؤون الموظفين والصلاحيات</h2>
          <p>بصفتك مديراً عاماً، يمكنك إنشاء حسابات جديدة وتعيين الأدوار.</p>
        </div>

        <div className={styles.contentGrid}>
          <section className={styles.formCard}>
            <h3>➕ إنشاء حساب إداري جديد</h3>
            <form onSubmit={handleSubmit} className={styles.adminForm}>
              <label className={styles.inputGroup}>
                <span>الاسم الكامل</span>
                <input
                  type="text"
                  name="fullName"
                  placeholder="أدخل اسم الموظف الثنائي"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </label>

              <label className={styles.inputGroup}>
                <span>البريد الإلكتروني الرسمي</span>
                <input
                  type="email"
                  name="email"
                  placeholder="employee@company.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </label>

              <label className={styles.inputGroup}>
                <span>كلمة المرور المؤقتة</span>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </label>

              <label className={styles.inputGroup}>
                <span>تحديد مستوى الصلاحية (Role)</span>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="admin">أدمن عادي (إدارة منتجات وطلبات)</option>
                  <option value="moderator">مشرف محتوى (تعديل طفيف)</option>
                  <option value="super_admin">
                    مدير عام (صلاحيات كاملة للموقع)
                  </option>
                </select>
              </label>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? "جاري الإنشاء..." : "🚀 تفعيل الحساب فوراً"}
              </button>
            </form>
          </section>

          <section className={styles.infoCard}>
            <h3>🔒 إرشادات الأمان للمدير العام</h3>
            <ul className={styles.infoList}>
              <li>لا تقم بمشاركة هذا الرابط مع جهات خارجية.</li>
              <li>يجب تعيين كلمة مرور معقدة تحتوي على رموز وأرقام.</li>
              <li>
                صلاحية الـ <b>Super Admin</b> تمنح الحساب قدرات كاملة، فاحذر لمن
                تعطيها.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
