import { Link } from "react-router-dom";
import styles from "./AdminControler.module.css";
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
        setServerStatus("الخادم متصل");
        setIsServerOnline(true);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;

        setServerStatus("الخادم غير متصل");
        setIsServerOnline(false);
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
          <h3>لوحة التحكم 🛠️</h3>
          <span className={styles.adminBadge}>{role || "المدير العام"}</span>
        </div>

        <nav className={styles.sidebarNav}>
          <Link to="/admin/analytics">
            <span className={styles.navIcon}>📊</span>
            <span>الإحصائيات العامة</span>
          </Link>
          <Link to="/admin/management">
            <span className={styles.navIcon}>👤</span>
            <span>إنشاء حساب أدمن</span>
          </Link>
          <Link to="/admin/admins-management">
            <span className={styles.navIcon}>👥</span>
            <span>إدارة حسابات الأدمن</span>
          </Link>
          <Link to="/admin/control-items/add">
            <span className={styles.navIcon}>➕</span>
            <span>إضافة منتج جديد</span>
          </Link>
          <Link to="/admin/orders-management">
            <span className={styles.navIcon}>📜</span>
            <span>طلبات الشراء</span>
          </Link>
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
          <div className={styles.toolbar}>
            <h2 className={styles.sectionTitle}>
              المنتجات
              <span className={styles.countBadge}>{itemsData?.length || 0}</span>
            </h2>
            <input
              type="search"
              placeholder="🔍 ابحث عن منتج..."
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
            <p className={styles.emptyState}>لا توجد منتجات</p>
          )}
        </main>
      </div>

      {editingItem && (
        <EditItemData onClose={onClose} item={editingItem}></EditItemData>
      )}
    </div>
  );
}
