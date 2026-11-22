import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAdminStore } from "../../context/useAdminStore";
import styles from "./AdminAnalytics.module.css";
import Loading from "../../components/loading/Loading";

export default function AdminAnalytics() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getAnalyticsData = useAdminStore((state) => state.getAnalyticsData);
  const analyticsData = useAdminStore((state) => state.analyticsData);
  const analyticsLoading = useAdminStore((state) => state.analyticsLoading);

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

  if (analyticsLoading) {
    return <Loading />;
  }

  return (
    <div className={styles.adminPage}>
      <header className={styles.headerSection}>
        <div>
          <h1 className={styles.titlePage}>{t("analytics.title")}</h1>
          <p className={styles.subTitle}>{t("analytics.subtitle")}</p>
        </div>

        <button
          type="button"
          className={`btn-global ${styles.btnBack}`}
          onClick={() => navigate("/admin/control-items")}
        >
          {t("common.backToDashboard")}
        </button>
      </header>

      <section className={styles.kpiGrid}>
        <div className={`${styles.kpiCard} ${styles.revenueBorder}`}>
          <span className={styles.kpiLabel}>{t("analytics.revenue")}</span>
          <span className={styles.kpiValue}>${totalRevenue}</span>
        </div>

        <div className={`${styles.kpiCard} ${styles.ordersBorder}`}>
          <span className={styles.kpiLabel}>{t("analytics.orders")}</span>
          <span className={styles.kpiValue}>{totalOrders}</span>
        </div>

        <div className={`${styles.kpiCard} ${styles.itemsBorder}`}>
          <span className={styles.kpiLabel}>{t("analytics.items")}</span>
          <span className={styles.kpiValue}>{totalItems}</span>
        </div>

        <div className={`${styles.kpiCard} ${styles.cartsBorder}`}>
          <span className={styles.kpiLabel}>{t("analytics.activeCarts")}</span>
          <span className={styles.kpiValue}>{activeCarts}</span>
        </div>
      </section>

      <section className={styles.middleGrid}>
        <div className={styles.panelCard}>
          <h2 className={styles.panelTitle}>{t("analytics.ordersByStatus")}</h2>
          <div className={styles.statusList}>
            <div className={styles.statusRow}>
              <span>{t("analytics.pending")}</span>
              <span className={styles.badgePending}>
                {ordersByStatus.Pending}
              </span>
            </div>
            <div className={styles.statusRow}>
              <span>{t("analytics.accepted")}</span>
              <span className={styles.badgeAccepted}>
                {ordersByStatus.Accepted}
              </span>
            </div>
            <div className={styles.statusRow}>
              <span>{t("analytics.delivered")}</span>
              <span className={styles.badgeDelivered}>
                {ordersByStatus.Delivered}
              </span>
            </div>
            <div className={styles.statusRow}>
              <span>{t("analytics.cancelled")}</span>
              <span className={styles.badgeCancelled}>
                {ordersByStatus.Cancelled}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.panelCard}>
          <h2 className={styles.panelTitle}>
            {t("analytics.productAnalysis")}
          </h2>

          <div className={styles.topProductBox}>
            <span className={styles.subLabel}>{t("analytics.topProduct")}</span>
            {topProduct ? (
              <p className={styles.topProductName}>
                {topProduct.itemName} (
                {t("analytics.pieces", { count: topProduct.totalSold })})
              </p>
            ) : (
              <p className={styles.emptyText}>{t("analytics.noSales")}</p>
            )}
          </div>

          <hr className={styles.divider} />

          <div className={styles.lowStockBox}>
            <span className={styles.subLabel}>{t("analytics.lowStock")}</span>
            {lowStockItems.length === 0 ? (
              <p className={styles.successText}>{t("analytics.allGood")}</p>
            ) : (
              <ul className={styles.lowStockList}>
                {lowStockItems.map((item) => (
                  <li key={item._id} className={styles.lowStockRow}>
                    <span>{item.itemName}</span>
                    <span className={styles.stockAlert}>
                      {t("analytics.remaining", { count: item.itemQuantity })}
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
          <h2 className={styles.panelTitle}>{t("analytics.topRegions")}</h2>
          {topRegions.length === 0 ? (
            <p className={styles.emptyText}>{t("analytics.noOrders")}</p>
          ) : (
            <ul className={styles.regionList}>
              {topRegions.map((reg, index) => (
                <li key={reg._id || index} className={styles.regionRow}>
                  <span>
                    {index + 1}. {t(`regions.${reg._id}`, reg._id)}
                  </span>
                  <span className={styles.regionCount}>
                    {t("analytics.regionOrders", { count: reg.count })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
