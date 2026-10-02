import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "axios";
import { useCartStore } from "./useCartStore";

const apiUrl = import.meta.env.VITE_API_URL;

export const useOrderStore = create((set, get) => ({
  myPastOrderDetails: [],
  myOrderData: [],

  setDirectPurchaseData: ({
    purchaseDetails,
    itemId,
    quantity,
    setItemsData,
  }) => {
    if (!purchaseDetails) {
      toast.error("يرجى التأكد من تعبئة البيانات بشكل صحيح");
      return;
    }

    return axios
      .post(`${apiUrl}/api/direct-purchase/set-data`, {
        purchaseDetails: purchaseDetails,
        itemId: itemId,
        quantity: Number(quantity),
      })
      .then((response) => {
        toast.success(
          response?.data?.message || "تم الشراء! العنصر موجود في صفحة طلباتي",
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
      })
      .catch((err) => {
        const serverErrorMessage = err.response?.data?.message;
        toast.error(
          serverErrorMessage || "فشل إتمام عملية الشراء، حاول مجدداً",
        );
      });
  },

  setCartPurchaseData: ({ purchaseDetails }) => {
    if (!purchaseDetails) {
      toast.error("يرجى التأكد من تعبئة البيانات بشكل صحيح");
      return;
    }

    const guestId = localStorage.getItem("guestId");

    return axios
      .post(`${apiUrl}/api/cart-purchase/set-data/${guestId}`, {
        purchaseDetails: purchaseDetails,
      })
      .then((response) => {
        toast.success(
          response?.data?.message || "تم الشراء! العناصر موجودة في صفحة طلباتي",
        );

        useCartStore.getState().clearCartLocal();
      })
      .catch((err) => {
        const serverErrorMessage = err.response?.data?.message;
        toast.error(
          serverErrorMessage || "فشل إتمام عملية الشراء، حاول مجدداً",
        );
      });
  },

  verifyGuestPhone: ({ phoneNumber }) => {
    return axios
      .post(`${apiUrl}/api/guest/verify`, { phoneNumber: phoneNumber })
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
      });
  },

  getMyOrder: async ({ phoneNumber, navigate }) => {
    try {
      const token = localStorage.getItem("guestToken");

      if (!token) {
        await get().verifyGuestPhone({ phoneNumber: phoneNumber });
      }

      await get().fetchOrdersByToken();
      navigate("/my-orders");
    } catch (err) {
      toast.error(err.response?.data?.message || "فشل احضار البيانات");
    }
  },
}));
