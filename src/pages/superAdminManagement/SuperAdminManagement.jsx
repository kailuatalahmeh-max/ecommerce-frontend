import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./SuperAdminManagement.module.css";
import { useAdminStore } from "../../context/useAdminStore";
import { useAuthStore } from "../../context/useAuthStore";
import { useNavigate } from "react-router-dom";
import { confirmDialog } from "../../context/useConfirmStore";
import { getDateLocale } from "../../i18n";

export const SuperAdminManagement = () => {
  const { t } = useTranslation();
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
    const disabling = admin.isActive;
    const actionText = disabling
      ? t("adminsPage.disable")
      : t("adminsPage.enable");

    confirmDialog({
      title: t("adminsPage.confirmTitle", { action: actionText }),
      message: t("adminsPage.confirmMessage", {
        action: actionText.toLowerCase(),
        name: admin.firstName,
      }),
      confirmText: actionText,
      variant: disabling ? "danger" : "success",
      onConfirm: () =>
        disabling
          ? disableAdmin({ adminId: admin._id })
          : enableAdmin({ adminId: admin._id }),
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t("adminsPage.title")}</h1>
        <button
          type="button"
          className={`btn-global ${styles.btnBack}`}
          onClick={() => navigate("/admin/control-items")}
        >
          {t("common.backToDashboard")}
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t("adminsPage.name")}</th>
              <th>{t("adminsPage.email")}</th>
              <th>{t("adminsPage.role")}</th>
              <th>{t("adminsPage.status")}</th>
              <th>{t("adminsPage.lastActivity")}</th>
              <th>{t("adminsPage.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {adminsData.map((admin) => {
              const isActivity = admin.lastActivityAt
                ? new Date() - new Date(admin.lastActivityAt) < 10 * 60 * 1000
                : false;

              const lastActivity = admin.lastActivityAt
                ? new Date(admin.lastActivityAt).toLocaleTimeString(
                    getDateLocale(),
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )
                : t("adminsPage.neverLoggedIn");

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
                      {isActivity
                        ? t("adminsPage.online")
                        : t("adminsPage.offline")}
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
                        title={isSelf ? t("adminsPage.cantDisableSelf") : ""}
                      >
                        {admin.isActive
                          ? t("adminsPage.disable")
                          : t("adminsPage.enable")}
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
