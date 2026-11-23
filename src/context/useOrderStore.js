import { create } from "zustand";
import toast from "react-hot-toast";
import i18n from "../i18n";
import axios from "axios";
import { useCartStore } from "./useCartStore";

const apiUrl = import.meta.env.VITE_API_URL;

export const useOrderStore = create((set, get) => ({
  myPastOrderDetails: [],
  myOrderData: [],
  myOrdersLoading: false,

  setDirectPurchaseData: ({
    purchaseDetails,
    itemId,
    quantity,
    setItemsData,
  }) => {
    if (!purchaseDetails) {
      toast.error(i18n.t("checkout.fillData"));
      return;
    }

    return axios
      .post(`${apiUrl}/api/orders`, {
        purchaseDetails: purchaseDetails,
        itemId: itemId,
        quantity: Number(quantity),
      })
      .then((response) => {
        toast.success(
          response?.data?.message || i18n.t("checkout.directSuccess"),
        );
        const itemQuantityUpdated =
          response.data?.data?.updatedItem?.itemQuantity;

        if (itemQuantityUpdated !== undefined) {
          setItemsData((prev) =>
            prev.map((item) =>
              item._id === itemId
                ? { ...item, itemQuantity: itemQuantityUpdated }
                : item,
            ),
          );
        }

        // { orderId, confirmCode, expiresAt, whatsappUrl } لخطوة تأكيد واتساب
        return response.data?.data || null;
      })
      .catch((err) => {
        const serverErrorMessage = err.response?.data?.message;
        toast.error(
          serverErrorMessage || i18n.t("checkout.failed"),
        );
        return null;
      });
  },

  setCartPurchaseData: ({ purchaseDetails }) => {
    if (!purchaseDetails) {
      toast.error(i18n.t("checkout.fillData"));
      return;
    }

    const guestId = localStorage.getItem("guestId");

    return axios
      .post(`${apiUrl}/api/carts/${guestId}/checkout`, {
        purchaseDetails: purchaseDetails,
      })
      .then((response) => {
        toast.success(
          response?.data?.message || i18n.t("checkout.cartSuccess"),
        );

        useCartStore.getState().clearCartLocal();

        // { orderId, confirmCode, expiresAt, whatsappUrl } لخطوة تأكيد واتساب
        return response.data?.data || null;
      })
      .catch((err) => {
        const serverErrorMessage = err.response?.data?.message;
        toast.error(
          serverErrorMessage || i18n.t("checkout.failed"),
        );
        return null;
      });
  },

  // حالة تأكيد الطلب: "pending" | "confirmed" | "expired"
  getOrderConfirmation: (orderId) => {
    return axios
      .get(`${apiUrl}/api/orders/${orderId}/confirmation`)
      .then((response) => response.data?.data?.status || "pending");
  },

  verifyGuestPhone: ({ phoneNumber }) => {
    // نحذف التوكن القديم أولاً: إذا فشل التحقق لا يبقى توكن رقم آخر
    localStorage.removeItem("guestToken");

    return axios
      .post(`${apiUrl}/api/guest/sessions`, { phoneNumber: phoneNumber })
      .then((response) => {
        const token = response.data?.token;
        if (token) {
          localStorage.setItem("guestToken", token);
        }
        return token;
      });
  },

  fetchOrdersByToken: () => {
    const token = localStorage.getItem("guestToken");
    if (!token) {
      return Promise.reject(new Error("no token"));
    }

    set({ myOrdersLoading: true });

    return axios
      .get(`${apiUrl}/api/guest/orders`, {
        headers: {
          "x-guest-token": token,
        },
      })
      .then((response) => {
        const data = response.data?.data || [];
        set({ myOrderData: data });
        return data;
      })
      .catch((err) => {
        // الجلسة انتهت (30 يوم) أو غير صحيحة ← نحذف التوكن القديم
        if (err.response?.status === 401) {
          localStorage.removeItem("guestToken");
          set({ myOrderData: [] });
        }
        throw err;
      })
      .finally(() => {
        set({ myOrdersLoading: false });
      });
  },

  getMyOrder: async ({ phoneNumber, navigate }) => {
    try {
      // دائماً نتحقق من الرقم الذي كتبه المستخدم الآن (توكن جديد لهذا الرقم)،
      // حتى لا نعرض طلبات رقم قديم محفوظ في المتصفح
      await get().verifyGuestPhone({ phoneNumber: phoneNumber });
      await get().fetchOrdersByToken();
      navigate("/my-orders");
    } catch (err) {
      toast.error(err.response?.data?.message || i18n.t("common.fetchFailed"));
    }
  },
}));
