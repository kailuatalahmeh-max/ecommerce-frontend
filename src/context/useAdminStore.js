import { create } from "zustand";
import axiosAdmin from "../utils/axiosAdmin";
import toast from "react-hot-toast";
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
        toast.success("تم أضافة العنصر بنجاح!", {
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
        toast.success("تم التعديل بنجاح");
        onClose();
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.message || "فشل التعديل يرجى المحاولة لاحقاً!";
        toast.error(errorMessage);
      });
  },

  handleDeleteItem: ({ id, setItemsData }) => {
    return confirmDialog({
      title: "حذف المنتج",
      message: "هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذه العملية.",
      confirmText: "🗑️ حذف",
      variant: "danger",
      onConfirm: () =>
        axiosAdmin
          .delete(`${apiUrl}/api/items/${id}`)
          .then(() => {
            // تحديث بالقيمة الأحدث (وليس نسخة قديمة من القائمة)
            setItemsData((prev) => prev.filter((item) => item._id !== id));
            toast.success("تم حذف العنصر بنجاح!", {
              style: { color: "green" },
            });
          })
          .catch((err) => {
            const errorMessage =
              err.response?.data?.message || "فشل الحذف، يرجى المحاولة لاحقاً!";
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
        toast.error(serverErrorMessage || "فشل احضار البيانات!");
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

        toast.success("تم تحديث حالة الطلب بنجاح");
      })

      .catch((err) => {
        const serverErrorMessage = err.response?.data?.message;
        toast.error(serverErrorMessage || "حدث خطأ ما");
      });
  },

  createAdminAccount: ({ setFormData, formData, setLoading }) => {
    axiosAdmin
      .post(`${apiUrl}/api/admins`, formData)
      .then((res) => {
        toast.success(res.data.message || "تم إنشاء حساب الإدارة بنجاح!");
        setFormData({ fullName: "", email: "", password: "", role: "admin" });
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "حدث خطأ ما");
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
        toast.error(serverErrorMessage || "حدث خطأ ما");
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
        toast.error(serverErrorMessage || "حدث خطأ ما");
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
        toast.success("تم تعطيل حساب الأدمن بنجاح");
      })
      .catch((err) => {
        const serverErrorMessage = err.response?.data?.message;
        toast.error(serverErrorMessage || "حدث خطأ ما");
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
        toast.success("تم تفعيل حساب الأدمن بنجاح");
      })
      .catch((err) => {
        const serverErrorMessage = err.response?.data?.message;
        toast.error(serverErrorMessage || "حدث خطأ ما");
      });
  },
}));
