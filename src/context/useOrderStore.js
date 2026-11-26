import { create } from "zustand";
import toast from "react-hot-toast";
import i18n from "../i18n";
import axios from "axios";
import { useCartStore } from "./useCartStore";
import { confirmDialog } from "./useConfirmStore";
import {
  getSavedOrders,
  removeSavedOrder,
  clearSavedOrders,
} from "../utils/savedOrders";

const apiUrl = import.meta.env.VITE_API_URL;

// track-many يقبل 20 طلب كحد أقصى في الطلب الواحد
const TRACK_MANY_LIMIT = 20;

// جلسات الضيف (guestToken) انحذفت من الباك إند: نمسح التوكن القديم مرة واحدة
try {
  localStorage.removeItem("guestToken");
} catch {
  // التخزين ممنوع: لا شيء
}

export const useOrderStore = create((set) => ({
  // نتائج track-many للطلبات المحفوظة في هذا المتصفح:
  // [{ code, phoneNumber, status: "found" | "notFound" | "invalid", order? }]
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

  // البحث عن طلب واحد برمز التأكيد + رقم الهاتف (POST /api/orders/track)
  // يرجع الطلب، أو يرمي الخطأ (الصفحة تعرض الرسالة)
  trackOrder: ({ code, phoneNumber }) => {
    return axios
      .post(`${apiUrl}/api/orders/track`, { code, phoneNumber })
      .then((response) => response.data?.data);
  },

  // بيانات جديدة لكل الطلبات المحفوظة (POST /api/orders/track-many)
  // أكثر من 20 طلب ← عدة طلبات، كل واحد فيه 20 كحد أقصى
  fetchSavedOrders: async () => {
    const saved = getSavedOrders();
    if (saved.length === 0) {
      set({ myOrderData: [], myOrdersLoading: false });
      return [];
    }

    const chunks = [];
    for (let i = 0; i < saved.length; i += TRACK_MANY_LIMIT) {
      chunks.push(saved.slice(i, i + TRACK_MANY_LIMIT));
    }

    set({ myOrdersLoading: true });
    try {
      const responses = await Promise.all(
        chunks.map((chunk) =>
          axios.post(`${apiUrl}/api/orders/track-many`, {
            orders: chunk.map(({ code, phoneNumber }) => ({ code, phoneNumber })),
          }),
        ),
      );
      const data = responses.flatMap((r) => r.data?.data || []);
      set({ myOrderData: data });
      return data;
    } finally {
      set({ myOrdersLoading: false });
    }
  },

  // حذف طلب من هذا الجهاز فقط (الطلب لا يُلغى)
  removeOrderFromDevice: (code) => {
    return confirmDialog({
      title: i18n.t("myOrders.removeTitle"),
      message: i18n.t("myOrders.removeMessage", { code }),
      confirmText: i18n.t("myOrders.removeButton"),
      variant: "danger",
      onConfirm: () => {
        removeSavedOrder(code);
        set((state) => ({
          myOrderData: state.myOrderData.filter((o) => o.code !== code),
        }));
        toast.success(i18n.t("myOrders.removed"));
      },
    });
  },

  // إلغاء طلب "Pending" (POST /api/orders/cancel). المخزون يرجع في السيرفر.
  // الطلب يبقى محفوظاً على الجهاز، بحالة "ملغي"
  // يرجع: { order } عند النجاح، { failed: true } عند الخطأ، null إذا الزبون اختار "لا"
  // (تستخدمه صفحة "طلباتي" ونافذة TrackOrder)
  cancelOrder: async ({ code, phoneNumber }) => {
    let result = null;
    await confirmDialog({
      title: i18n.t("myOrders.cancelTitle"),
      message: i18n.t("myOrders.cancelMessage", { code }),
      confirmText: i18n.t("myOrders.cancelButton"),
      cancelText: i18n.t("myOrders.keepOrder"),
      variant: "danger",
      onConfirm: async () => {
        try {
          const response = await axios.post(`${apiUrl}/api/orders/cancel`, {
            code,
            phoneNumber,
          });
          const updated = response.data?.data;
          set((state) => ({
            myOrderData: state.myOrderData.map((o) =>
              o.code === code && updated ? { ...o, order: updated } : o,
            ),
          }));
          toast.success(i18n.t("myOrders.cancelled"));
          result = { order: updated };
        } catch (err) {
          toast.error(err.response?.data?.message || i18n.t("myOrders.cancelFailed"));
          // مثلاً المتجر قبل الطلب قبل قليل: نعرض الحالة الجديدة
          if (err.response?.status === 409) {
            useOrderStore.getState().fetchSavedOrders().catch(() => {});
          }
          result = { failed: true };
        }
      },
    });
    return result;
  },

  // حذف كل الطلبات من هذا الجهاز
  clearAllOrdersFromDevice: () => {
    return confirmDialog({
      title: i18n.t("myOrders.clearAllTitle"),
      message: i18n.t("myOrders.clearAllMessage"),
      confirmText: i18n.t("myOrders.clearAll"),
      variant: "danger",
      onConfirm: () => {
        clearSavedOrders();
        set({ myOrderData: [] });
        toast.success(i18n.t("myOrders.cleared"));
      },
    });
  },
}));
