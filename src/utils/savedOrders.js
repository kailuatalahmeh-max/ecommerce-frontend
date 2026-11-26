/*
  الطلبات المحفوظة في هذا المتصفح فقط (localStorage).
  نحفظ { code, phoneNumber } لكل طلب — وليس بيانات الطلب نفسها —
  وصفحة "طلباتي" تجيب البيانات الجديدة من السيرفر كل مرة (POST /api/orders/track-many).

  الحذف من هنا لا يلغي الطلب: يحذفه من هذا الجهاز فقط.
*/

const STORAGE_KEY = "savedOrders";

// حد أعلى حتى لا تكبر القائمة بلا نهاية (الأحدث يبقى)
export const MAX_SAVED_ORDERS = 50;

// نفس شكل رمز التأكيد: حروف كبيرة بدون مسافات
function cleanCode(code) {
  return String(code || "")
    .replace(/\s/g, "")
    .toUpperCase();
}

function isValidEntry(entry) {
  return (
    entry &&
    typeof entry.code === "string" &&
    typeof entry.phoneNumber === "string" &&
    entry.code.length > 0 &&
    entry.phoneNumber.length > 0
  );
}

function write(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // وضع التصفح الخاص أو التخزين ممتلئ: نكمل بدون حفظ
  }
}

/** كل الطلبات المحفوظة، الأحدث أولاً: [{ code, phoneNumber, savedAt }] */
export function getSavedOrders() {
  try {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(list) ? list.filter(isValidEntry) : [];
  } catch {
    // بيانات تالفة أو التخزين ممنوع
    return [];
  }
}

/** يضيف طلباً في أول القائمة. إذا كان الرمز محفوظاً، ينقله للأعلى بدل التكرار */
export function saveOrder({ code, phoneNumber }) {
  const entry = {
    code: cleanCode(code),
    phoneNumber: String(phoneNumber || "").trim(),
    savedAt: new Date().toISOString(),
  };
  if (!isValidEntry(entry)) return getSavedOrders();

  const others = getSavedOrders().filter((o) => o.code !== entry.code);
  const list = [entry, ...others].slice(0, MAX_SAVED_ORDERS);
  write(list);
  return list;
}

/** يحذف طلباً واحداً (بالرمز) من هذا الجهاز */
export function removeSavedOrder(code) {
  const list = getSavedOrders().filter((o) => o.code !== cleanCode(code));
  write(list);
  return list;
}

/** يحذف كل الطلبات المحفوظة من هذا الجهاز */
export function clearSavedOrders() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // لا شيء
  }
  return [];
}
