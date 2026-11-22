import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../context/useAuthStore";
import { useAdminStore } from "../../context/useAdminStore";
import { confirmDialog } from "../../context/useConfirmStore";
import styles from "./EditItemData.module.css";
import { useContext, useState } from "react";
import { ItemContext } from "../../context/ItemContext";

import { cleanUrl } from "../../utils/urlHelpers";
import { MAX_IMAGES_PER_ITEM } from "../../utils/constants";

export default function EditItemData({ onClose, item }) {
  const { t } = useTranslation();
  const { setItemsData } = useContext(ItemContext);

  const { role } = useAuthStore();
  const editItem = useAdminStore((state) => state.editItem);

  function getInitialImages(item) {
    return item.images?.length > 0
      ? item.images.map((img) => ({ imageURL: img.imageURL || "" }))
      : [{ imageURL: "" }];
  }

  function getInitialState(item) {
    return {
      images: getInitialImages(item),
      itemName: item.itemName,
      itemPrice: item.itemPrice,
      itemQuantity: item.itemQuantity,
    };
  }

  // بناء الحالة من العنصر القادم
  const [itemEditing, setItemEditing] = useState(() => getInitialState(item));

  function handleAddImageField() {
    if (itemEditing.images.length >= MAX_IMAGES_PER_ITEM) {
      toast.error(t("itemForm.maxImages", { count: MAX_IMAGES_PER_ITEM }));
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
      toast.error(t("common.noPermission"));
      return;
    }

    // نتحقق من البيانات أولاً، ثم نسأل للتأكيد
    const cleanedImages = itemEditing.images
      .map((img) => ({ imageURL: cleanUrl(img.imageURL) }))
      .filter((img) => img.imageURL.length > 0);

    if (cleanedImages.length === 0) {
      toast.error(t("itemForm.atLeastOneImage"));
      return;
    }

    const finalItemEditing = {
      ...itemEditing,
      images: cleanedImages,
    };

    confirmDialog({
      title: t("itemForm.confirmEditTitle"),
      message: t("itemForm.confirmEditMessage", { name: item.itemName }),
      confirmText: t("itemForm.confirmEditButton"),
      variant: "success",
      onConfirm: () =>
        editItem({
          id: item._id,
          itemEditing: finalItemEditing,
          setItemsData,
          onClose,
        }),
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
        <h2 className={styles.formTitle}>
          {t("itemForm.editTitle", { name: item.itemName })}
        </h2>
        <hr className={styles.hrAnderFormTitle} />

        <div className={styles.imagesSection}>
          <label className={styles.labelImageLink}>
            {t("itemForm.imageLinks")}
          </label>
          {itemEditing.images.map((img, index) => (
            <div key={index} className={styles.imageInputRow}>
              <input
                type="text"
                placeholder={t("itemForm.imageN", { n: index + 1 })}
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
            {t("itemForm.addImage")}
          </button>
        </div>

        <label>
          {t("itemForm.name")}
          <input
            type="text"
            placeholder={t("itemForm.newNamePlaceholder")}
            value={itemEditing.itemName}
            onChange={(e) => {
              setItemEditing((p) => ({ ...p, itemName: e.target.value }));
            }}
            className={styles.input}
          />
        </label>
        <label>
          {t("itemForm.price")}
          <input
            type="number"
            placeholder={t("itemForm.newPricePlaceholder")}
            value={itemEditing.itemPrice}
            onChange={(e) => {
              setItemEditing((p) => ({ ...p, itemPrice: e.target.value }));
            }}
            className={styles.input}
          />
        </label>
        <label>
          {t("itemForm.quantity")}
          <input
            type="number"
            placeholder={t("itemForm.quantityPlaceholder")}
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
            {t("itemForm.save")}
          </button>
          <button
            type="button"
            className="btn-global btn-danger"
            onClick={() => setItemEditing(getInitialState(item))}
          >
            {t("itemForm.reset")}
          </button>
          <button
            type="button"
            className="btn-global btn-primary"
            onClick={() => {
              onClose();
            }}
          >
            {t("itemForm.close")}
          </button>
        </div>
      </form>
    </div>
  );
}
