import { create } from "zustand";

/*
  نافذة تأكيد بديلة لـ window.confirm (تعمل على iPhone وداخل متصفحات التطبيقات).

  الاستخدام:
    const ok = await confirmDialog("هل أنت متأكد؟");

  أو مع عملية async (النافذة تبقى مفتوحة مع تحميل حتى تنتهي العملية):
    await confirmDialog({
      title: "حذف المنتج",
      message: "هل أنت متأكد؟",
      confirmText: "حذف",
      variant: "danger", // "danger" | "primary" | "success"
      onConfirm: () => axios.delete(...), // يجب أن ترجع Promise
    });

  القواعد:
  - الإلغاء لا ينفّذ onConfirm أبداً، ويرجع false.
  - نافذة واحدة فقط في نفس الوقت: أي طلب ثاني وهي مفتوحة يرجع false مباشرة
    (يمنع تكرار العملية عند الضغط مرتين).
  - أثناء تنفيذ onConfirm كل الأزرار مقفلة، ولا يمكن الإغلاق.
*/

// النصوص الفارغة تأخذ الترجمة الافتراضية في ConfirmDialog (common.*)
const DEFAULTS = {
  title: "",
  message: "",
  confirmText: "",
  cancelText: "",
  variant: "primary",
  icon: null,
  onConfirm: null,
};

export const useConfirmStore = create(() => ({
  dialog: null, // الخيارات + resolve
  loading: false, // true أثناء تنفيذ onConfirm
}));

export function confirmDialog(options) {
  const opts = typeof options === "string" ? { message: options } : options;

  // نافذة مفتوحة بالفعل ← نرفض الطلب الجديد
  if (useConfirmStore.getState().dialog) {
    return Promise.resolve(false);
  }

  return new Promise((resolve) => {
    useConfirmStore.setState({
      dialog: { ...DEFAULTS, ...opts, resolve },
      loading: false,
    });
  });
}

// يُستدعى من أزرار النافذة: true = تأكيد، false = إلغاء
export async function answerConfirm(confirmed) {
  const { dialog, loading } = useConfirmStore.getState();

  // لا توجد نافذة، أو العملية قيد التنفيذ ← تجاهل أي ضغطة إضافية
  if (!dialog || loading) return;

  if (!confirmed || typeof dialog.onConfirm !== "function") {
    useConfirmStore.setState({ dialog: null });
    dialog.resolve(confirmed);
    return;
  }

  // نقفل النافذة قبل أول await، حتى الضغطة الثانية ترى loading = true
  useConfirmStore.setState({ loading: true });
  try {
    await dialog.onConfirm();
  } catch (error) {
    console.error("confirmDialog onConfirm error:", error);
  } finally {
    useConfirmStore.setState({ dialog: null, loading: false });
    dialog.resolve(true);
  }
}
