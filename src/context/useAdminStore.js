import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
const apiUrl = import.meta.env.VITE_API_URL;

export const useAdminStore = create((set, get) => ({
  ordersData: [],
  analyticsData: null,
  analyticsLoading: false,

  getOrdersData: () => {
    axios
      .get(`${apiUrl}/api/admin-control/orders`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
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
    axios
      .patch(
        `${apiUrl}/api/admin-control/order-edit-status`,
        {
          orderId: orderId,
          status: status,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      )
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
    axios
      .post(`${apiUrl}/api/admin/create-new-admin`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
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

    axios
      .get(`${apiUrl}/api/admin/analytics`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
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
      axios
        .delete(`${apiUrl}/api/deleteItem/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
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
