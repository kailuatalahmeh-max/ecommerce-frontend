import { useState } from "react";
import styles from "./AddItemData.module.css";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { ItemContext } from "../../context/ItemContext";
import { useAuthStore } from "../../context/useAuthStore";
import { useAdminStore } from "../../context/useAdminStore";

import { cleanUrl } from "../../utils/urlHelpers";
import { MAX_IMAGES_PER_ITEM } from "../../utils/constants";
export default function AddItemData() {
  const { setItemsData } = useContext(ItemContext);
  const { role } = useAuthStore();
  const addItem = useAdminStore((state) => state.addItem);

  /*----STATES---- */
  const [formInputData, setFormInputData] = useState({
    images: [{ imageURL: "" }],
    itemName: "",
    itemPrice: "",
    itemQuantity: "",
  });

  /*<----STATES----> */

  /*----handleFunction---- */

  function handleAddImageField() {
    if (formInputData.images.length >= MAX_IMAGES_PER_ITEM) {
      toast.error(`لا يمكن إضافة أكثر من ${MAX_IMAGES_PER_ITEM} صور`);
      return;
    }
    setFormInputData((prev) => ({
      ...prev,
      images: [...prev.images, { imageURL: "" }],
    }));
  }

  function handleRemoveImageField(index) {
    setFormInputData((prev) => {
      const updatedImages = prev.images.filter((_, i) => i !== index);
      return { ...prev, images: updatedImages };
    });
  }

  function handleImageChange(index, value) {
    const cleaned = cleanUrl(value);
    setFormInputData((prev) => {
      const updatedImages = prev.images.map((img, i) =>
        i === index ? { ...img, imageURL: cleaned } : img,
      );
      return { ...prev, images: updatedImages };
    });
  }

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
    const cleanedImages = formInputData.images
      .map((img) => ({ imageURL: cleanUrl(img.imageURL) }))
      .filter((img) => img.imageURL.length > 0);

    if (cleanedImages.length === 0) {
      toast.error("يرجى إضافة رابط صورة واحد على الأقل");
      return;
    }

    const finalData = {
      ...formInputData,
      images: cleanedImages,
      imageURL: cleanedImages[0].imageURL,
    };

    addItem({
      formInputData: finalData,
      setFormInputData: setFormInputData,
      setItemsData: setItemsData,
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
        <div className={styles.imagesSection}>
          <label className={styles.labelImageLink}>روابط الصور:</label>
          {formInputData.images.map((img, index) => (
            <div key={index} className={styles.imageInputRow}>
              <input
                type="text"
                placeholder={`رابط الصورة ${index + 1}`}
                className={styles.input}
                value={img.imageURL}
                onChange={(e) => handleImageChange(index, e.target.value)}
              />
              {formInputData.images.length > 1 && (
                <button
                  type="button"
                  className={styles.removeImageBtn}
                  onClick={() => handleRemoveImageField(index)}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className={styles.addImageBtn}
            onClick={handleAddImageField}
          >
            ➕ إضافة صورة
          </button>
        </div>
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
