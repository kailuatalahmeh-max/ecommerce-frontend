// عملة الموقع: شيكل. غيّر الشكل هنا فقط، وكل الصفحات تتغير.
export const CURRENCY = "₪";

// formatPrice(1099)   ← "1,099.00 ₪"
// formatPrice(9.5)    ← "9.50 ₪"
// أرقام إنجليزية (0-9) في اللغتين، مثل باقي الموقع
export function formatPrice(value) {
  const number = Number(value) || 0;
  const formatted = number.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${formatted} ${CURRENCY}`;
}
