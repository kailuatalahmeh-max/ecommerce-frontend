import { create } from "zustand";
import axiosAdmin from "../utils/axiosAdmin";
import toast from "react-hot-toast";
const apiUrl = import.meta.env.VITE_API_URL;

export const useAdminStore = create((set, get) => ({
  ordersData: [],
  analyticsData: null,
  analyticsLoading: false,

  addItem: ({ formInputData, setFormInputData, setItemsData }) => {
    const images = (formInputData.images || [])
      .map((img) => ({
        imageURL: String(img.imageURL || "").trim(),
      }))
      .filter((img) => img.imageURL.length > 0);

    axiosAdmin
      .post(`${apiUrl}/api/addItem`, {
        imageURL: images[0]?.imageURL || "",
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
    const images = (itemEditing.images || [])
      .map((img) => ({
        imageURL: String(img.imageURL || "").trim(),
      }))
      .filter((img) => img.imageURL.length > 0);

    axiosAdmin
      .put(`${apiUrl}/api/item/edit/${id}`, {
        imageURL: images[0]?.imageURL || "",
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

  getOrdersData: () => {
    axiosAdmin
      .get(`${apiUrl}/api/admin-control/orders`)
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
      .patch(`${apiUrl}/api/admin-control/order-edit-status`, {
        orderId: orderId,
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
      .post(`${apiUrl}/api/admin/create-new-admin`, formData)
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
      .get(`${apiUrl}/api/admin/analytics`)
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

  handleDeleteItem: ({ id, setItemsData, itemsData }) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      axiosAdmin
        .delete(`${apiUrl}/api/deleteItem/${id}`)
        .then(() => {
          const items = itemsData.filter((item) => item._id !== id);
          setItemsData(items);
          toast.success("تم حذف العنصر بنجاح!", {
            style: { color: "green" },
          });
        })
        .catch((err) => {
          const errorMessage =
            err.response?.data?.message || "فشل الحذف، يرجى المحاولة لاحقاً!";
          toast.error(errorMessage);
        });
    }
  },
}));
