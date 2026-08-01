import toast from "react-hot-toast";
import { useAuthStore } from "../../context/useAuthStore";
import styles from "./EditItemData.module.css";
import { useContext, useState } from "react";
import axios from "axios";
import { ItemContext } from "../../context/ItemContext";

const apiUrl = import.meta.env.VITE_API_URL;

export default function EditItemData({ onClose, item }) {
  const { setItemsData } = useContext(ItemContext);

  const { role } = useAuthStore();

  const [itemEditing, setItemEditing] = useState({
    imageURL: item.imageURL,
    itemName: item.itemName,
    itemPrice: item.itemPrice,
    itemQuantity: item.itemQuantity,
  });

  function handleSubmit(e) {
    e.preventDefault();
    const allowedRoles = ["admin", "moderator", "super_admin"];

    if (!allowedRoles.includes(role)) {
      toast.error("عذرا, ليس لديك رتبة مسؤول لتعديل العنصر!");
      return;
    }

    if (!window.confirm("هل أنت متأكد من حفظ التعديلات؟")) {
      return;
    }
    axios
      .put(
        `${apiUrl}/api/item/edit/${item._id}`,
        {
          ...itemEditing,
          itemPrice: Number(itemEditing.itemPrice),
          itemQuantity: Number(itemEditing.itemQuantity),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )
      .then(() => {
        setItemsData((prev) =>
          prev.map((i) => (i._id === item._id ? { ...i, ...itemEditing } : i)),
        );
        toast.success("تم التعديل بنجاح");
        onClose();
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.message || "فشل التعديل يرجى المحاولة لاحقاً!";
        toast.error(errorMessage);
      });
  }

  const hasErrors =
    itemEditing?.imageURL?.trim().length === 0 ||
    itemEditing?.itemName?.trim().length === 0 ||
    itemEditing?.itemPrice === "" ||
    itemEditing?.itemQuantity === "" ||
    Number(itemEditing?.itemPrice) < 0 ||
    Number(itemEditing?.itemQuantity) < 0;

  return (
    <div
      className={styles.bodyModel}
      onClick={() => {
        onClose();
      }}
    >
      <form
        className={styles.form}
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <h2 className={styles.formTitle}>تعديل:{item.itemName}</h2>
        <hr className={styles.hrAnderFormTitle} />
        <label>
          image Link:
          <input
            type="text"
            placeholder="رابط الصورة"
            value={itemEditing.imageURL}
            onChange={(e) => {
              setItemEditing((p) => ({ ...p, imageURL: e.target.value }));
            }}
            className={styles.input}
          />
        </label>
        <label>
          item Name:
          <input
            type="text"
            placeholder="الأسم الجديد"
            value={itemEditing.itemName}
            onChange={(e) => {
              setItemEditing((p) => ({ ...p, itemName: e.target.value }));
            }}
            className={styles.input}
          />
        </label>
        <label>
          item Price:
          <input
            type="number"
            placeholder="السعر الجديد"
            value={itemEditing.itemPrice}
            onChange={(e) => {
              setItemEditing((p) => ({ ...p, itemPrice: e.target.value }));
            }}
            className={styles.input}
          />
        </label>
        <label>
          quantity:
          <input
            type="number"
            placeholder="الكمية المتوفرة"
            value={itemEditing.itemQuantity}
            onChange={(e) => {
              setItemEditing((p) => ({
                ...p,
                itemQuantity: e.target.value,
              }));
            }}
            className={styles.input}
          />
        </label>
        <div className={styles.btnsAction}>
          <button
            type="submit"
            className="btn-global btn-success"
            disabled={hasErrors}
          >
            حفظ التعديلات
          </button>
          <button
            type="button"
            className="btn-global btn-danger"
            onClick={() => {
              setItemEditing({
                imageURL: item.imageURL,
                itemName: item.itemName,
                itemPrice: item.itemPrice,
                itemQuantity: item.itemQuantity,
              });
            }}
          >
            مسح التعديلات
          </button>
          <button
            type="button"
            className="btn-global btn-primary"
            onClick={() => {
              onClose();
            }}
          >
            اغلاق
          </button>
        </div>
      </form>
    </div>
  );
}
