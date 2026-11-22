import { useState } from "react";
import styles from "./AddItemData.module.css";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { ItemContext } from "../../context/ItemContext";
import { useAuthStore } from "../../context/useAuthStore";
import { useAdminStore } from "../../context/useAdminStore";
import { confirmDialog } from "../../context/useConfirmStore";

import { cleanUrl } from "../../utils/urlHelpers";
import { MAX_IMAGES_PER_ITEM } from "../../utils/constants";
export default function AddItemData() {
  const { t } = useTranslation();
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
      toast.error(t("itemForm.maxImages", { count: MAX_IMAGES_PER_ITEM }));
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
      toast.error(t("common.noPermission"));
      return;
    }

    // نتحقق من البيانات أولاً، ثم نسأل للتأكيد
    const cleanedImages = formInputData.images
      .map((img) => ({ imageURL: cleanUrl(img.imageURL) }))
      .filter((img) => img.imageURL.length > 0);

    if (cleanedImages.length === 0) {
      toast.error(t("itemForm.atLeastOneImage"));
      return;
    }

    const finalData = {
      ...formInputData,
      images: cleanedImages,
      imageURL: cleanedImages[0].imageURL,
    };

    confirmDialog({
      title: t("itemForm.confirmAddTitle"),
      message: t("itemForm.confirmAddMessage", {
        name: finalData.itemName.trim(),
      }),
      confirmText: t("itemForm.confirmAddButton"),
      variant: "success",
      onConfirm: () =>
        addItem({
          formInputData: finalData,
          setFormInputData: setFormInputData,
          setItemsData: setItemsData,
        }),
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
        <h2 className={styles.formTitle}>{t("itemForm.addTitle")}</h2>
        <hr className={styles.hrAnderFormTitle} />
        <div className={styles.imagesSection}>
          <label className={styles.labelImageLink}>
            {t("itemForm.imageLinks")}
          </label>
          {formInputData.images.map((img, index) => (
            <div key={index} className={styles.imageInputRow}>
              <input
                type="text"
                placeholder={t("itemForm.imageN", { n: index + 1 })}
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
            {t("itemForm.addImage")}
          </button>
        </div>
        <label>
          {t("itemForm.name")}
          <input
            type="text"
            required
            placeholder={t("itemForm.namePlaceholder")}
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
          {t("itemForm.price")}
          <input
            type="number"
            required
            placeholder={t("itemForm.pricePlaceholder")}
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
          {t("itemForm.quantity")}
          <input
            type="number"
            required
            placeholder={t("itemForm.quantityPlaceholder")}
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
          {t("itemForm.add")}
        </button>
        <Link to="/admin/control-items" className="btn-global btn-primary">
          {t("itemForm.controlPanel")}
        </Link>
      </form>
    </div>
  );
}
