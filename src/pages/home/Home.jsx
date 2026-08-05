import styles from "./Home.module.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { useState } from "react";
import { ItemContext } from "../../context/ItemContext";
import { useCartStore } from "../../context/useCartStore";
import { useAuthStore } from "../../context/useAuthStore";
import ItemList from "../../components/showITems/ItemList";
import Cart from "../../components/Cart/Cart";
import PhoneCheck from "../../components/phoneCheck/PhoneCheck";
export default function Home() {
  const { itemsData } = useContext(ItemContext);
  const { role } = useAuthStore();
  const cartData = useCartStore((state) => state.cartData);
  const logout = useAuthStore((state) => state.logout);
  const [openCart, setOpenCart] = useState(false);
  const [openPhoneCheck, setOpenPhoneCheck] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems =
    itemsData?.filter((item) =>
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase().trim()),
    ) || [];

  function onClose() {
    setOpenCart(false);
  }

  function handleClosePhoneCheck() {
    setOpenPhoneCheck(false);
  }
  return (
    <div className={styles.bodyPage}>
      {openPhoneCheck && (
        <PhoneCheck handleClose={handleClosePhoneCheck}></PhoneCheck>
      )}
      {!!role && (
        <button
          className={`btn-global ${styles.logoutBtn}`}
          onClick={() => {
            logout();
          }}
        >
          logout
        </button>
      )}

      <h1 className={styles.titlePage}>Welcome to Talahmeh tools</h1>
      <hr className={styles.hrAnderTitle} />
      <input
        type="text"
        placeholder="🔍 ابحث عن منتج..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />

      <div className={styles.mainContent}>
        <div className={styles.CentralMainContent}>
          <div className={styles.welcomeIcon}>
            <img
              src="https://marketplace.canva.com/QIbKU/MAFf_gQIbKU/1/tl/canva-store-icon-template-MAFf_gQIbKU.png"
              alt="أيقونة المتجر"
            />
          </div>

          <div className={styles.actionButtons}>
            <button
              onClick={() => {
                setOpenCart(true);
              }}
              className={`${styles.btnDynamic} ${styles.btnCart} btn-global`}
            >
              🛒 ({cartData.length}) Shopping Cart
            </button>

            {role === "super_admin" && (
              <Link
                to="/admin/control-items"
                className={`${styles.btnDynamic} ${styles.btnAdmin}`}
              >
                🛠 Control Panel
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
              📥 Install our app
            </a>
            <button
              className={`${styles.btnDynamic} ${styles.btnRequests} btn-success`}
              onClick={() => {
                setOpenPhoneCheck(true);
              }}
            >
              🎁 My Orders
            </button>
          </div>
        </div>
      </div>
      <div className={styles.itemLinks}>
        {filteredItems ? (
          filteredItems.length > 0 &&
          filteredItems.map((item) => <ItemList key={item._id} {...item} />)
        ) : (
          <p className={styles.noResults}>لا توجد نتائج مطابقة لبحثك</p>
        )}
      </div>
    </div>
  );
}
