import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminStore } from "../../context/useAdminStore";
import styles from "./AdminAnalytics.module.css";

export default function AdminAnalytics() {
  const navigate = useNavigate();

  const getAnalyticsData = useAdminStore((state) => state.getAnalyticsData);
  const analyticsData = useAdminStore((state) => state.analyticsData);

  useEffect(() => {
    getAnalyticsData();
  }, [getAnalyticsData]);

  const totalRevenue = analyticsData?.totalRevenue || 0;
  const totalOrders = analyticsData?.totalOrders || 0;
  const totalItems = analyticsData?.totalItems || 0;
  const activeCarts = analyticsData?.activeCarts || 0;

  const ordersByStatus = analyticsData?.ordersByStatus || {
    Pending: 0,
    Accepted: 0,
    Delivered: 0,
    Cancelled: 0,
  };

  const topProduct = analyticsData?.topProduct || null;
  const lowStockItems = analyticsData?.lowStockItems || [];
  const topRegions = analyticsData?.topRegions || [];

  return (
    <div className={styles.adminPage}>
      <header className={styles.headerSection}>
        <div>
          <h1 className={styles.titlePage}>لوحة الإحصائيات العامة</h1>
          <p className={styles.subTitle}>رؤية شاملة لأداء المتجر والمبيعات</p>
        </div>

        <button
          type="button"
          className={`btn-global ${styles.btnBack}`}
          onClick={() => navigate("/admin/control-items")}
        >
          ← العودة للوحة التحكم
        </button>
      </header>

      <section className={styles.kpiGrid}>
        <div className={`${styles.kpiCard} ${styles.revenueBorder}`}>
          <span className={styles.kpiLabel}>إجمالي المبيعات</span>
          <span className={styles.kpiValue}>${totalRevenue}</span>
        </div>

        <div className={`${styles.kpiCard} ${styles.ordersBorder}`}>
          <span className={styles.kpiLabel}>إجمالي الطلبات</span>
          <span className={styles.kpiValue}>{totalOrders}</span>
        </div>

        <div className={`${styles.kpiCard} ${styles.itemsBorder}`}>
          <span className={styles.kpiLabel}>إجمالي المنتجات</span>
          <span className={styles.kpiValue}>{totalItems}</span>
        </div>

        <div className={`${styles.kpiCard} ${styles.cartsBorder}`}>
          <span className={styles.kpiLabel}>السلات النشطة</span>
          <span className={styles.kpiValue}>{activeCarts}</span>
        </div>
      </section>

      <section className={styles.middleGrid}>
        <div className={styles.panelCard}>
          <h2 className={styles.panelTitle}>حالات الطلبات</h2>
          <div className={styles.statusList}>
            <div className={styles.statusRow}>
              <span>⏳ قيد الانتظار</span>
              <span className={styles.badgePending}>{ordersByStatus.Pending}</span>
            </div>
            <div className={styles.statusRow}>
              <span>✅ مقبول</span>
              <span className={styles.badgeAccepted}>{ordersByStatus.Accepted}</span>
            </div>
            <div className={styles.statusRow}>
              <span>🚚 تم التوصيل</span>
              <span className={styles.badgeDelivered}>{ordersByStatus.Delivered}</span>
            </div>
            <div className={styles.statusRow}>
              <span>❌ ملغى</span>
              <span className={styles.badgeCancelled}>{ordersByStatus.Cancelled}</span>
            </div>
          </div>
        </div>

        <div className={styles.panelCard}>
          <h2 className={styles.panelTitle}>تحليل المنتجات</h2>
          
          <div className={styles.topProductBox}>
            <span className={styles.subLabel}>🔥 الأكثر مبيعاً:</span>
            {topProduct ? (
              <p className={styles.topProductName}>
                {topProduct.itemName} ({topProduct.totalSold} قطعة)
              </p>
            ) : (
              <p className={styles.emptyText}>لا توجد بيانات مبيعات بعد</p>
            )}
          </div>

          <hr className={styles.divider} />

          <div className={styles.lowStockBox}>
            <span className={styles.subLabel}>⚠️ تنبيهات المخزون (أقل من 5):</span>
            {lowStockItems.length === 0 ? (
              <p className={styles.successText}>جميع المنتجات بفرة جيدة</p>
            ) : (
              <ul className={styles.lowStockList}>
                {lowStockItems.map((item) => (
                  <li key={item._id} className={styles.lowStockRow}>
                    <span>{item.itemName}</span>
                    <span className={styles.stockAlert}>
                      المتبقي: {item.itemQuantity}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <section className={styles.bottomSection}>
        <div className={styles.panelCard}>
          <h2 className={styles.panelTitle}>📍 المناطق الأكثر طلباً</h2>
          {topRegions.length === 0 ? (
            <p className={styles.emptyText}>لا توجد طلبات مسجلة بعد.</p>
          ) : (
            <ul className={styles.regionList}>
              {topRegions.map((reg, index) => (
                <li key={reg._id || index} className={styles.regionRow}>
                  <span>{index + 1}. {reg._id}</span>
                  <span className={styles.regionCount}>{reg.count} طلبات</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}