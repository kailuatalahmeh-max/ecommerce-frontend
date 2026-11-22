import { Link } from "react-router-dom";
import styles from "./AdminController.module.css";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ItemContext } from "../../context/ItemContext";
import AdminItemCard from "../../components/adminItemCard/AdminItemCard";
import axios from "axios";
import EditItemData from "../../components/editItemData/EditItemData";
import { useAuthStore } from "../../context/useAuthStore";
import { useAdminStore } from "../../context/useAdminStore";

const apiUrl = import.meta.env.VITE_API_URL;

export default function AdminController() {
  const { t } = useTranslation();
  const { role } = useAuthStore();

  const { itemsData, setItemsData } = useContext(ItemContext);
  const handleDeleteItem = useAdminStore((state) => state.handleDeleteItem);
  const [editingItem, setEditingItem] = useState(null);

  // "checking" | "online" | "offline" (النص من ملفات الترجمة admin.server.*)
  const [serverStatus, setServerStatus] = useState("checking");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems =
    itemsData?.filter((item) =>
      item.itemName?.toLowerCase().includes(searchTerm.toLowerCase().trim()),
    ) || [];

  useEffect(() => {
    const controller = new AbortController();

    axios
      .get(`${apiUrl}/health`, {
        signal: controller.signal,
      })
      .then(() => {
        setServerStatus("online");
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;

        setServerStatus("offline");
      });

    return () => {
      controller.abort();
    };
  }, []);

  /*<---- HANDLE FUNCTIONS ----> */
  function handleSubmit(id) {
    handleDeleteItem({
      id: id,
      setItemsData: setItemsData,
    });
  }

  function openEditing(item) {
    setEditingItem(item);
  }

  function onClose() {
    setEditingItem(null);
  }

  /*<----> HANDLE FUNCTIONS <----> */

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h3>{t("admin.panelTitle")}</h3>
          <span className={styles.adminBadge}>
            {role || t("admin.defaultRole")}
          </span>
        </div>

        <nav className={styles.sidebarNav}>
          <Link to="/admin/analytics">
            <span className={styles.navIcon}>📊</span>
            <span>{t("admin.nav.analytics")}</span>
          </Link>
          <Link to="/admin/management">
            <span className={styles.navIcon}>👤</span>
            <span>{t("admin.nav.createAdmin")}</span>
          </Link>
          <Link to="/admin/admins-management">
            <span className={styles.navIcon}>👥</span>
            <span>{t("admin.nav.manageAdmins")}</span>
          </Link>
          <Link to="/admin/control-items/add">
            <span className={styles.navIcon}>➕</span>
            <span>{t("admin.nav.addProduct")}</span>
          </Link>
          <Link to="/admin/orders-management">
            <span className={styles.navIcon}>📜</span>
            <span>{t("admin.nav.orders")}</span>
          </Link>
        </nav>
        <div className={styles.sidebarFooter}>
          <Link to="/" className={styles.backHomeBtn}>
            {t("admin.backHome")}
          </Link>
        </div>
      </aside>

      <div className={styles.pageContent}>
        <header className={styles.topHeader}>
          <div className={styles.headerSection}>
            <div className={styles.welcomeText}>
              <h4>{t("admin.welcome")}</h4>
              <p>{t("admin.welcomeText")}</p>
            </div>
            <div className={styles.serverStatus}>
              <span
                className={styles.statusDot}
                style={{
                  backgroundColor:
                    serverStatus === "online" ? "#10b981" : "#ef4444",
                }}
              ></span>

              {t(`admin.server.${serverStatus}`)}
            </div>
          </div>
        </header>
        <main className={styles.mainContent}>
          <div className={styles.toolbar}>
            <h2 className={styles.sectionTitle}>
              {t("admin.products")}
              <span className={styles.countBadge}>{itemsData?.length || 0}</span>
            </h2>
            <input
              type="search"
              placeholder={t("admin.searchProducts")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {filteredItems.length > 0 ? (
            <div className={styles.cardSiction}>
              {filteredItems.map((product) => (
                <AdminItemCard
                  key={product._id}
                  item={product}
                  onDelete={handleSubmit}
                  openEditing={openEditing}
                />
              ))}
            </div>
          ) : (
            <p className={styles.emptyState}>{t("admin.noProducts")}</p>
          )}
        </main>
      </div>

      {editingItem && (
        <EditItemData onClose={onClose} item={editingItem}></EditItemData>
      )}
    </div>
  );
}
