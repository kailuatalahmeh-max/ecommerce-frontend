import { Link } from "react-router-dom";
import styles from "./adminConroler.module.css";
import { useContext, useEffect, useState } from "react";
import { ItemContext } from "../../context/ItemContext";
import AdminItemCard from "../../components/adminItemCard/AdminItemCard";
import axios from "axios";
import EditItemData from "../../components/editItemData/EditItemData";
import { useAuthStore } from "../../context/useAuthStore";
import { useAdminStore } from "../../context/useAdminStore";

const apiUrl = import.meta.env.VITE_API_URL;

export default function AdminControler() {
  const { role } = useAuthStore();

  const { itemsData, setItemsData } = useContext(ItemContext);
  const handleDeleteItem = useAdminStore((state) => state.handleDeleteItem);
  const [editingItem, setEditingItem] = useState(null);

  const [serverStatus, setServerStatus] = useState("جاري التحقق...");
  const [isServerOnline, setIsServerOnline] = useState(false);

  useEffect(() => {
    axios
      .get(`${apiUrl}/health`)
      .then(() => {
        setServerStatus("الخادم متصل");

        setIsServerOnline(true);
      })
      .catch(() => {
        setServerStatus("الخادم غير متصل");
        setIsServerOnline(false);
      });
  }, []);

  /*<---- HANDLE FUNCTIONS ----> */
  function handleSubmit(id) {
    handleDeleteItem({
      id: id,
      setItemsData: setItemsData,
      itemsData: itemsData,
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
          <h3>لوحة التحكم 🛠️</h3>
          <span className={styles.adminBadge}>{role || "المدير العام"}</span>
        </div>

        <nav className={styles.sidebarNav}>
          <Link to="/admin/analytics">📊 الإحصائيات العامة</Link>
          <Link to="/admin/management">👤 أنشاء حساب أدمن</Link>
          <Link to="/admin/control-items/add">➕ إضافة منتج جديد</Link>
          <Link to="/admin/orders-management">📜 طلبات الشراء</Link>
        </nav>
        <div className={styles.sidebarFooter}>
          <Link to="/" className={styles.backHomeBtn}>
            🏠 العودة للموقع الرئيسي
          </Link>
        </div>
      </aside>

      <div className={styles.pageContent}>
        <header className={styles.topHeader}>
          <div className={styles.headerSection}>
            <div className={styles.welcomeText}>
              <h4>أهلاً بك مجدداً 👤</h4>
              <p>إليك نظرة سريعة على متجرك اليوم</p>
            </div>
            <div className={styles.serverStatus}>
              <span
                className={styles.statusDot}
                style={{
                  backgroundColor: isServerOnline ? "#10b981" : "#ef4444",
                }}
              ></span>

              {serverStatus || "الخادم غير متصل"}
            </div>
          </div>
        </header>
        <main className={styles.mainContent}>
          <div className={styles.cardSiction}>
            {itemsData?.map((product) => (
              <AdminItemCard
                key={product._id}
                item={product}
                onDelete={handleSubmit}
                openEditing={openEditing}
              />
            ))}
          </div>
        </main>
      </div>

      {editingItem && (
        <EditItemData onClose={onClose} item={editingItem}></EditItemData>
      )}
    </div>
  );
}
