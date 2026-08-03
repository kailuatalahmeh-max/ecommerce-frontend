import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const apiUrl = import.meta.env.VITE_API_URL;

export const useCartStore = create((set, get) => ({
  cartData: [],

  getCartData: () => {
    const guestId = localStorage.getItem("guestId");

    axios
      .get(`${apiUrl}/api/cart/${guestId}`)
      .then((response) => {
        const data = response.data?.data?.items || [];
        set({ cartData: data });
      })
      .catch((err) => {
        toast.error(err.response?.message || "فشل احضار البيانات");
      });
  },

  initGuestId: () => {
    let guestId = localStorage.getItem("guestId");

    if (guestId && guestId.startsWith("guest_")) {
      guestId = guestId.replace("guest_", "");
      localStorage.setItem("guestId", guestId);
    }

    if (!guestId) {
      guestId = uuidv4();
      localStorage.setItem("guestId", guestId);
    }
  },
  addToCart: (thisItem, quantity) => {
    const guestId = localStorage.getItem("guestId");

    axios
      .post(`${apiUrl}/api/cart/add`, {
        guestId: guestId,
        itemId: thisItem._id,
        quantity: Number(quantity),
      })
      .then((response) => {
        const newData = response?.data?.data?.items || [];
        set({ cartData: newData });
        toast.success("تم إضافة المنتج إلى السلة!");
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message;
        toast.error(errorMessage);
      });
  },

  deleteItem: (id) => {
    const guestId = localStorage.getItem("guestId");
    axios
      .delete(`${apiUrl}/api/cart/delete/${id}`, {
        data: { guestId },
      })
      .then(() => {
        const items = get().cartData.filter((item) => item._id !== id);
        set({ cartData: items });
        toast.success("تم الحذف بنجاح");
      })
      .catch((error) => {
        const errMessage = error.response?.data?.message;
        toast.error(errMessage);
      });
  },

  addQuantity: (id) => {
    const guestId = localStorage.getItem("guestId");

    axios
      .post(`${apiUrl}/api/cart/add-quantity/${id}`, {
        guestId,
      })
      .then((response) => {
        const newData = response?.data?.data?.items || [];

        set({ cartData: newData });
      })
      .catch((error) => {
        const errMessage = error.response?.data?.message || "حدث خطأ ما!";
        toast.error(errMessage);
      });
  },

  reducingQuantity: (id) => {
    const guestId = localStorage.getItem("guestId");
    axios
      .patch(`${apiUrl}/api/cart/reducing-quantity/${id}`, {
        guestId: guestId,
      })
      .then((response) => {
        const newData = response?.data?.data?.items || [];
        set({ cartData: newData });
      })
      .catch((error) => {
        const errMessage = error.response?.data?.message || "حدث خطأ ما!";
        toast.error(errMessage);
      });
  },

  clearCart: () => {
    const guestId = localStorage.getItem("guestId");
    axios
      .delete(`${apiUrl}/api/cart/delete-all/${guestId}`)
      .then((response) => {
        set({ cartData: [] });
        toast.success(response?.data?.message || "تم الحذف بنجاح");
      })
      .catch((error) => {
        const errMessage = error.response?.data?.message || "حدث خطأ ما!";
        toast.error(errMessage);
      });
  },

  clearCartLocal: () => set({ cartData: [] }),

  totalPrice: () => {
    const items = get().cartData;

    if (!items || items.length === 0) return 0;

    const total = items.reduce((total, item) => {
      return total + (item.itemId?.itemPrice || 0) * (item.quantity || 0);
    }, 0);

    return Number(total.toFixed(2));
  },
}));
