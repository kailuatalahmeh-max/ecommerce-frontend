import toast from "react-hot-toast";
import { useAuthStore } from "../../context/useAuthStore";
import { useAdminStore } from "../../context/useAdminStore";
import styles from "./EditItemData.module.css";
import { useContext, useState } from "react";
import { ItemContext } from "../../context/ItemContext";

import { cleanUrl } from "../../utils/urlHelpers";
import { MAX_IMAGES_PER_ITEM } from "../../utils/constants";

export default function EditItemData({ onClose, item }) {
  const { setItemsData } = useContext(ItemContext);

  const { role } = useAuthStore();
  const editItem = useAdminStore((state) => state.editItem);

  // بناء الحالة من العنصر القادم
  const [itemEditing, setItemEditing] = useState(() => {
    const initialImages =
      item.images && item.images.length > 0
        ? item.images.map((img) => ({ imageURL: img.imageURL || "" }))
        : item.imageURL
          ? [{ imageURL: item.imageURL }]
          : [{ imageURL: "" }];

    return {
      images: initialImages,
      itemName: item.itemName,
      itemPrice: item.itemPrice,
      itemQuantity: item.itemQuantity,
    };
  });

  function handleAddImageField() {
    if (itemEditing.images.length >= MAX_IMAGES_PER_ITEM) {
      toast.error(`لا يمكن إضافة أكثر من ${MAX_IMAGES_PER_ITEM} صور`);
      return;
    }
    setItemEditing((prev) => ({
      ...prev,
      images: [...prev.images, { imageURL: "" }],
    }));
  }

  function handleRemoveImageField(index) {
    setItemEditing((prev) => {
      const updatedImages = prev.images.filter((_, i) => i !== index);
      return { ...prev, images: updatedImages };
    });
  }

  function handleImageChange(index, value) {
    const cleaned = cleanUrl(value);
    setItemEditing((prev) => {
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
      toast.error("عذرا, ليس لديك رتبة مسؤول لتعديل العنصر!");
      return;
    }

    if (!window.confirm("هل أنت متأكد من حفظ التعديلات؟")) {
      return;
    }

    const cleanedImages = itemEditing.images
      .map((img) => ({ imageURL: cleanUrl(img.imageURL) }))
      .filter((img) => img.imageURL.length > 0);

    if (cleanedImages.length === 0) {
      toast.error("يرجى إضافة رابط صورة واحد على الأقل");
      return;
    }

    const finalItemEditing = {
      ...itemEditing,
      images: cleanedImages,
      imageURL: cleanedImages[0].imageURL,
    };

    editItem({
      id: item._id,
      itemEditing: finalItemEditing,
      setItemsData,
      onClose,
    });
  }

  const price = Number(itemEditing.itemPrice);
  const qty = Number(itemEditing.itemQuantity);

  const hasErrors =
    itemEditing.images.some((img) => img.imageURL.trim().length === 0) ||
    itemEditing.itemName.trim().length === 0 ||
    isNaN(price) ||
    price <= 0 ||
    isNaN(qty) ||
    qty <= 0;

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

        <div className={styles.imagesSection}>
          <label className={styles.labelImageLink}>روابط الصور:</label>
          {itemEditing.images.map((img, index) => (
            <div key={index} className={styles.imageInputRow}>
              <input
                type="text"
                placeholder={`رابط الصورة ${index + 1}`}
                className={styles.input}
                value={img.imageURL}
                onChange={(e) => handleImageChange(index, e.target.value)}
              />
              {itemEditing.images.length > 1 && (
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
              const originalImages =
                item.images && item.images.length > 0
                  ? item.images.map((img) => ({ imageURL: img.imageURL || "" }))
                  : item.imageURL
                    ? [{ imageURL: item.imageURL }]
                    : [{ imageURL: "" }];

              setItemEditing({
                images: originalImages,
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
