import { create } from "zustand";
import axiosAdmin from "../utils/axiosAdmin";
import toast from "react-hot-toast";
import i18n from "../i18n";
import { confirmDialog } from "./useConfirmStore";
const apiUrl = import.meta.env.VITE_API_URL;

export const useAdminStore = create((set, get) => ({
  adminsData: [],
  ordersData: [],
  analyticsData: null,
  analyticsLoading: false,

  addItem: ({ formInputData, setFormInputData, setItemsData }) => {
    const images = (
      Array.isArray(formInputData.images) ? formInputData.images : []
    )
      .map((img) => ({
        imageURL: String(img.imageURL || "").trim(),
      }))
      .filter((img) => img.imageURL.length > 0);

    // نرجع الـ Promise حتى تنتظر نافذة التأكيد انتهاء الطلب
    return axiosAdmin
      .post(`${apiUrl}/api/items`, {
        images: images,
        itemName: formInputData.itemName.trim(),
        itemPrice: Number(formInputData.itemPrice),
        itemQuantity: Number(formInputData.itemQuantity),
      })
      .then((response) => {
        toast.success(i18n.t("itemForm.added"), {
          style: { color: "green" },
        });
        const newProductFromServer = response.data?.data;
        setFormInputData({
          images: [{ imageURL: "" }],
          itemName: "",
          itemPrice: "",
          itemQuantity: "",
        });
        setItemsData((p) => [...p, newProductFromServer]);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  },

  editItem: ({ id, itemEditing, setItemsData, onClose }) => {
    const images = (Array.isArray(itemEditing.images) ? itemEditing.images : [])
      .map((img) => ({
        imageURL: String(img.imageURL || "").trim(),
      }))
      .filter((img) => img.imageURL.length > 0);

    return axiosAdmin
      .put(`${apiUrl}/api/items/${id}`, {
        images: images,
        itemName: itemEditing.itemName.trim(),
        itemPrice: Number(itemEditing.itemPrice),
        itemQuantity: Number(itemEditing.itemQuantity),
      })
      .then((response) => {
        const updatedItem = response.data?.data;
        setItemsData((prev) =>
          prev.map((i) => (i._id === id ? updatedItem : i)),
        );
        toast.success(i18n.t("itemForm.edited"));
        onClose();
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.message || i18n.t("itemForm.editFailed");
        toast.error(errorMessage);
      });
  },

  handleDeleteItem: ({ id, setItemsData }) => {
    return confirmDialog({
      title: i18n.t("itemForm.confirmDeleteTitle"),
      message: i18n.t("itemForm.confirmDeleteMessage"),
      confirmText: i18n.t("itemForm.confirmDeleteButton"),
      variant: "danger",
      onConfirm: () =>
        axiosAdmin
          .delete(`${apiUrl}/api/items/${id}`)
          .then(() => {
            // تحديث بالقيمة الأحدث (وليس نسخة قديمة من القائمة)
            setItemsData((prev) => prev.filter((item) => item._id !== id));
            toast.success(i18n.t("itemForm.deleted"), {
              style: { color: "green" },
            });
          })
          .catch((err) => {
            const errorMessage =
              err.response?.data?.message || i18n.t("itemForm.deleteFailed");
            toast.error(errorMessage);
          }),
    });
  },

  getOrdersData: () => {
    axiosAdmin
      .get(`${apiUrl}/api/orders`)
      .then((response) => {
        const data = response.data?.data;
        set({ ordersData: data });
      })
      .catch((err) => {
        const serverErrorMessage = err.response?.data?.message;
        toast.error(serverErrorMessage || i18n.t("common.fetchFailed"));
      });
  },

  updateOrderStatus: ({ orderId, status }) => {
    axiosAdmin
      .patch(`${apiUrl}/api/orders/${orderId}`, {
        status: status,
      })
      .then(() => {
        const updatedOrders = get().ordersData.map((order) =>
          order._id === orderId ? { ...order, status: status } : order,
        );

        set({ ordersData: updatedOrders });

        toast.success(i18n.t("adminOrders.statusUpdated"));
      })

      .catch((err) => {
        const serverErrorMessage = err.response?.data?.message;
        toast.error(serverErrorMessage || i18n.t("common.errorGeneric"));
      });
  },

  // تأكيد الطلب يدوياً بعد ما الأدمن يشوف رسالة الزبون على واتساب
  confirmOrderManually: (order) => {
    const { code } = order.confirmation;

    return confirmDialog({
      title: i18n.t("adminOrders.confirmTitle"),
      message: i18n.t("adminOrders.confirmMessage", {
        code,
        phone: order.phoneNumber,
      }),
      confirmText: i18n.t("adminOrders.confirmButton"),
      variant: "success",
      onConfirm: () =>
        axiosAdmin
          .post(`${apiUrl}/api/orders/confirm`, {
            code,
            senderPhone: order.phoneNumber,
          })
          .then(() => {
            set((state) => ({
              ordersData: state.ordersData.map((o) =>
                o._id === order._id
                  ? {
                      ...o,
                      confirmation: {
                        ...o.confirmation,
                        status: "confirmed",
                        confirmedAt: new Date().toISOString(),
                        method: "admin",
                      },
                    }
                  : o,
              ),
            }));
            toast.success(i18n.t("adminOrders.confirmed"));
          })
          .catch((err) => {
            const serverErrorMessage = err.response?.data?.message;
            toast.error(serverErrorMessage || i18n.t("common.errorGeneric"));
            // ALREADY_CONFIRMED أو EXPIRED: نجيب الحالة الحقيقية من السيرفر
            if ([409, 410].includes(err.response?.status)) {
              get().getOrdersData();
            }
          }),
    });
  },

  createAdminAccount: ({ setFormData, formData, setLoading }) => {
    axiosAdmin
      .post(`${apiUrl}/api/admins`, formData)
      .then((res) => {
        toast.success(res.data.message || i18n.t("createAdmin.created"));
        setFormData({ fullName: "", email: "", password: "", role: "admin" });
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || i18n.t("common.errorGeneric"));
      })
      .finally(() => setLoading(false));
  },
  getAnalyticsData: () => {
    set({ analyticsLoading: true });

    axiosAdmin
      .get(`${apiUrl}/api/dashboard/analytics`)
      .then((response) => {
        const data = response.data?.data;

        set({ analyticsData: data });
      })
      .catch((err) => {
        const serverErrorMessage = err.response?.data?.message;
        toast.error(serverErrorMessage || i18n.t("common.errorGeneric"));
      })
      .finally(() => {
        set({ analyticsLoading: false });
      });
  },

  getAdminsData: () => {
    axiosAdmin
      .get(`${apiUrl}/api/admins`)
      .then((response) => {
        const data = response.data?.data;
        set({ adminsData: data });
      })
      .catch((err) => {
        const serverErrorMessage = err.response?.data?.message;
        toast.error(serverErrorMessage || i18n.t("common.errorGeneric"));
      });
  },

  disableAdmin: ({ adminId }) => {
    return axiosAdmin
      .patch(`${apiUrl}/api/admins/${adminId}/disable`)
      .then(() => {
        const updatedAdmins = get().adminsData.map((admin) =>
          admin._id === adminId ? { ...admin, isActive: false } : admin,
        );
        set({ adminsData: updatedAdmins });
        toast.success(i18n.t("adminsPage.disabled"));
      })
      .catch((err) => {
        const serverErrorMessage = err.response?.data?.message;
        toast.error(serverErrorMessage || i18n.t("common.errorGeneric"));
      });
  },

  enableAdmin: ({ adminId }) => {
    return axiosAdmin
      .patch(`${apiUrl}/api/admins/${adminId}/enable`)
      .then(() => {
        const updatedAdmins = get().adminsData.map((admin) =>
          admin._id === adminId ? { ...admin, isActive: true } : admin,
        );
        set({ adminsData: updatedAdmins });
        toast.success(i18n.t("adminsPage.enabled"));
      })
      .catch((err) => {
        const serverErrorMessage = err.response?.data?.message;
        toast.error(serverErrorMessage || i18n.t("common.errorGeneric"));
      });
  },
}));
