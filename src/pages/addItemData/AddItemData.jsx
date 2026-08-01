import { useState } from "react";
import styles from "./AddItemData.module.css";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { ItemContext } from "../../context/ItemContext";
import { useAuthStore } from "../../context/useAuthStore";

export default function AddItemData() {
  const { setItemsData } = useContext(ItemContext);
  const { role } = useAuthStore();

  const apiUrl = import.meta.env.VITE_API_URL;
  /*----STATES---- */
  const [formInputData, setFormInputData] = useState({
    imageURL: "",
    itemName: "",
    itemPrice: "",
    itemQuantity: "",
  });

  /*<----STATES----> */

  /*----handleFunction---- */
  function handleSubmit(e) {
    e.preventDefault();

    const allowedRoles = ["admin", "moderator", "super_admin"];

    if (!allowedRoles.includes(role)) {
      toast.error("عذرا, ليس لديك رتبة مسؤول لأضافة العنصر!");
      return;
    }

    const confirmAdd = window.confirm("هل أنت متأكد من أضافة المنتج؟");

    if (!confirmAdd) {
      return;
    }


    axios
      .post(
        `${apiUrl}/addItem`,
        {
          imageURL: formInputData.imageURL.trim(),
          itemName: formInputData.itemName.trim(),
          itemPrice: Number(formInputData.itemPrice),
          itemQuantity: Number(formInputData.itemQuantity),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )
      .then((response) => {
        toast.success("تم أضافة العنصر بنجاح!", {
          style: { color: "green" },
        });
        const newProductFromServer = response.data?.data;
        setFormInputData({
          imageURL: "",
          itemName: "",
          itemPrice: "",
          itemQuantity: "",
        });

        setItemsData((p) => [...p, newProductFromServer]);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  }
  /*<----handleFunction----> */

  return (
    <div className={styles.bodyPage}>
      <form
        className={styles.inputForm}
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <h2 className={styles.formTitle}>أدخل معلومات الأداة</h2>
        <hr className={styles.hrAnderFormTitle} />
        <label className={styles.labelImageLink}>
          image link:
          <input
            type="text"
            placeholder="رابط صورة المنتج"
            className={styles.input}
            value={formInputData.imageURL}
            onChange={(e) => {
              setFormInputData((p) => {
                return { ...p, imageURL: e.target.value };
              });
            }}
          />
        </label>
        <label>
          item name:
          <input
            type="text"
            required
            placeholder="أسم المنتج"
            className={styles.input}
            value={formInputData.itemName}
            onChange={(e) => {
              setFormInputData((p) => {
                return { ...p, itemName: e.target.value };
              });
            }}
          />
        </label>
        <label>
          item price:
          <input
            type="number"
            required
            placeholder="سعر المنتج"
            step="any"
            className={styles.input}
            value={formInputData.itemPrice}
            onChange={(e) => {
              setFormInputData((p) => {
                return { ...p, itemPrice: e.target.value };
              });
            }}
          />
        </label>
        <label>
          Quantity:
          <input
            type="number"
            required
            placeholder="الكمية"
            step="any"
            className={styles.input}
            value={formInputData.itemQuantity}
            onChange={(e) => {
              setFormInputData((p) => {
                return { ...p, itemQuantity: e.target.value };
              });
            }}
          />
        </label>
        <button
          type="submit"
          className={styles.buttonSendItemData}
          disabled={
            formInputData.itemName.trim().length === 0 ||
            !formInputData.itemPrice
          }
        >
          أضافة
        </button>
        <Link to="/admin/control-items" className="btn-global btn-primary">
          لوحة التحكم 🛠️
        </Link>
      </form>
    </div>
  );
}
