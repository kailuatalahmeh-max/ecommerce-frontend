import styles from "./Home.module.css";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { ItemContext } from "../../context/ItemContext";
import { useCartStore } from "../../context/useCartStore";
import { useAuthStore } from "../../context/useAuthStore";
import ItemList from "../../components/itemList/ItemList";
import Cart from "../../components/Cart/Cart";
import TrackOrder from "../../components/trackOrder/TrackOrder";
export default function Home() {
  const { t } = useTranslation();
  const { itemsData } = useContext(ItemContext);
  const { role } = useAuthStore();
  const cartData = useCartStore((state) => state.cartData);
  const logout = useAuthStore((state) => state.logout);
  const [openCart, setOpenCart] = useState(false);
  const [openTrackOrder, setOpenTrackOrder] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems =
    itemsData?.filter((item) =>
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase().trim()),
    ) || [];

  function onClose() {
    setOpenCart(false);
  }

  function handleCloseTrackOrder() {
    setOpenTrackOrder(false);
  }

  function handleMyOrders() {
    setOpenTrackOrder(true);
  }
  return (
    <div className={styles.bodyPage}>
      {openTrackOrder && (
        <TrackOrder handleClose={handleCloseTrackOrder}></TrackOrder>
      )}
      {!!role && (
        <button
          className={`btn-global ${styles.logoutBtn}`}
          onClick={() => {
            logout();
          }}
        >
          {t("home.logout")}
        </button>
      )}

      <h1 className={styles.titlePage}>{t("home.title")}</h1>
      <hr className={styles.hrAnderTitle} />
      <input
        type="text"
        placeholder={t("home.search")}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />

      <div className={styles.mainContent}>
        <div className={styles.CentralMainContent}>
          <div className={styles.welcomeIcon}>
            <img
              src="https://marketplace.canva.com/QIbKU/MAFf_gQIbKU/1/tl/canva-store-icon-template-MAFf_gQIbKU.png"
              alt={t("home.storeIconAlt")}
            />
          </div>

          <div className={styles.actionButtons}>
            <button
              onClick={() => {
                setOpenCart(true);
              }}
              className={`${styles.btnDynamic} ${styles.btnCart} btn-global`}
            >
              {t("home.cart", { count: cartData.length })}
            </button>

            {role === "super_admin" && (
              <Link
                to="/admin/control-items"
                className={`${styles.btnDynamic} ${styles.btnAdmin}`}
              >
                {t("home.controlPanel")}
              </Link>
            )}

            {openCart && (
              <Cart onClose={onClose} setOpenCart={setOpenCart}></Cart>
            )}

            <a
              href="#"
              target="_blank"
              className={`${styles.btnDynamic} ${styles.btnDownload}`}
            >
              {t("home.installApp")}
            </a>
            <button
              className={`${styles.btnDynamic} ${styles.btnRequests} btn-success`}
              onClick={() => {
                handleMyOrders();
              }}
            >
              {t("home.myOrders")}
            </button>
          </div>
        </div>
      </div>
      <div className={styles.itemLinks}>
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => <ItemList key={item._id} {...item} />)
        ) : (
          <p className={styles.noResults}>{t("home.noResults")}</p>
        )}
      </div>
    </div>
  );
}
