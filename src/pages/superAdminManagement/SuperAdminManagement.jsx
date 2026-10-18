import { useEffect } from "react";
import styles from "./SuperAdminManagement.module.css";
import { useAdminStore } from "../../context/useAdminStore";
import { useAuthStore } from "../../context/useAuthStore";
import { useNavigate } from "react-router-dom";

export const SuperAdminManagement = () => {
  const adminsData = useAdminStore((state) => state.adminsData);
  const getAdminsData = useAdminStore((state) => state.getAdminsData);
  const disableAdmin = useAdminStore((state) => state.disableAdmin);
  const enableAdmin = useAdminStore((state) => state.enableAdmin);
  const adminId = useAuthStore((state) => state.adminId);

  const navigate = useNavigate();

  useEffect(() => {
    getAdminsData();
  }, [getAdminsData]);

  function handleSubmit(admin) {
    if (
      window.confirm(
        `هل أنت متأكد أنك تريد ${admin.isActive ? "تعطيل" : "تفعيل"} حساب الأدمن؟`,
      )
    ) {
      if (admin.isActive) {
        disableAdmin({ adminId: admin._id });
      } else {
        enableAdmin({ adminId: admin._id });
      }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>إدارة حسابات المسؤولين</h1>
        <button
          type="button"
          className={`btn-global ${styles.btnBack}`}
          onClick={() => navigate("/admin/control-items")}
        >
          ← العودة للوحة التحكم
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>الاسم</th>
              <th>البريد الإلكتروني</th>
              <th>الرتبة</th>
              <th>حالة الحساب</th>
              <th>آخر نشاط</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {adminsData.map((admin) => {
              const isActivity = admin.lastActivityAt
                ? new Date() - new Date(admin.lastActivityAt) < 10 * 60 * 1000
                : false;

              const lastActivity = admin.lastActivityAt
                ? new Date(admin.lastActivityAt).toLocaleTimeString("en", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "لم يسجل دخول بعد";

              const isSelf = admin._id === adminId;

              return (
                <tr key={admin._id}>
                  <td>{admin.firstName}</td>
                  <td>{admin.email}</td>
                  <td>
                    <span className={styles.roleBadge}>{admin.role}</span>
                  </td>
                  <td>
                    <span
                      className={`${styles.badge} ${
                        isActivity ? styles.active : styles.inactive
                      }`}
                    >
                      {isActivity ? "متصل" : "غير متصل"}
                    </span>
                  </td>
                  <td>{lastActivity}</td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={`${styles.btn} ${
                          admin.isActive
                            ? styles.btnDeactivate
                            : styles.btnActivate
                        }`}
                        onClick={() => handleSubmit(admin)}
                        disabled={isSelf}
                        title={isSelf ? "لا يمكنك تعطيل حسابك بنفسك" : ""}
                      >
                        {admin.isActive ? "تعطيل" : "تفعيل"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
