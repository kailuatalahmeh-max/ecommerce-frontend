import { create } from "zustand";
import toast from "react-hot-toast";
import i18n from "../i18n";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const apiUrl = import.meta.env.VITE_API_URL;

export const useCartStore = create((set, get) => ({
  cartData: [],

  getCartData: () => {
    const guestId = localStorage.getItem("guestId");

    axios
      .get(`${apiUrl}/api/carts/${guestId}`)
      .then((response) => {
        const data = response.data?.data?.items || [];
        set({ cartData: data });
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || i18n.t("common.fetchFailed"));
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
      .post(`${apiUrl}/api/carts/${guestId}/items`, {
        itemId: thisItem._id,
        quantity: Number(quantity),
      })
      .then((response) => {
        const newData = response?.data?.data?.items || [];
        set({ cartData: newData });
        toast.success(i18n.t("cart.added"));
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message;
        toast.error(errorMessage);
      });
  },

  deleteItem: (id) => {
    const guestId = localStorage.getItem("guestId");
    axios
      .delete(`${apiUrl}/api/carts/${guestId}/items/${id}`)
      .then((response) => {
        const newData = response?.data?.data?.items || [];

        set({ cartData: newData });

        toast.success(response?.data?.message || i18n.t("cart.deleted"));
      })
      .catch((error) => {
        const errMessage = error.response?.data?.message;
        toast.error(errMessage);
      });
  },

  addQuantity: (id) => {
    const guestId = localStorage.getItem("guestId");

    axios
      .patch(`${apiUrl}/api/carts/${guestId}/items/${id}/increase`)
      .then((response) => {
        const newData = response?.data?.data?.items || [];

        set({ cartData: newData });
      })
      .catch((error) => {
        const errMessage = error.response?.data?.message || i18n.t("common.errorGeneric");
        toast.error(errMessage);
      });
  },

  reducingQuantity: (id) => {
    const guestId = localStorage.getItem("guestId");
    axios
      .patch(`${apiUrl}/api/carts/${guestId}/items/${id}/decrease`)
      .then((response) => {
        const newData = response?.data?.data?.items || [];
        set({ cartData: newData });
      })
      .catch((error) => {
        const errMessage = error.response?.data?.message || i18n.t("common.errorGeneric");
        toast.error(errMessage);
      });
  },

  clearCart: () => {
    const guestId = localStorage.getItem("guestId");
    axios
      .delete(`${apiUrl}/api/carts/${guestId}/items`)
      .then((response) => {
        set({ cartData: [] });
        toast.success(response?.data?.message || i18n.t("cart.deleted"));
      })
      .catch((error) => {
        const errMessage = error.response?.data?.message || i18n.t("common.errorGeneric");
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
