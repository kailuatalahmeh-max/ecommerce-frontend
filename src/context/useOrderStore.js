import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuthStore } from "./useAuthStore";
import { useCartStore } from "./useCartStore";

const apiUrl = import.meta.env.VITE_API_URL;

export const useOrderStore = create((set) => ({
  purchaseStatisticsData: [],
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

    axios
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

        setItemsData((prev) =>
          prev.map((item) =>
            item._id === itemId
              ? { ...item, itemQuantity: itemQuantityUpdated }
              : item,
          ),
        );
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

    axios
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

  getMyOrder: ({ phoneNumber, navigate }) => {
    axios
      .get(`${apiUrl}/api/order/get-my-orders`, {
        params: { phoneNumber: phoneNumber },
      })
      .then((response) => {
        const data = response.data?.data;
        const userNumber = localStorage.getItem("userNumber");
        if (!userNumber) {
          localStorage.setItem("userNumber", data?.phoneNumber);
        }
        set({ myOrderData: data });
        navigate("/my-orders");
      })
      .catch((err) => {
        toast.error(err.response?.data.message || "فشل احضار البيانات");
      });
  },

  getStatisticsData: () => {
    const role = useAuthStore.getState().role;

    if (!role) {
      return;
    }
    axios
      .get(`${apiUrl}/api/get/statistics-data`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        set({
          purchaseStatisticsData: response?.data?.data,
        });
      })
      .catch((err) => {
        const serverErrorMessage = err.response?.data?.message;
        toast.error(
          serverErrorMessage || "فشل إتمام عملية الشراء، حاول مجدداً",
        );
      });
  },
}));
