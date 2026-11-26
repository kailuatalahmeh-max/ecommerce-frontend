// صورة بديلة للمنتج بدون صور. ملف داخل المشروع (public/)، لا يعتمد على موقع خارجي
export const PLACEHOLDER_IMAGE = "/placeholder-image.svg";
export const MAX_IMAGES_PER_ITEM = 6;

// نفس القائمة في صفحة الشراء وصفحة "طلباتي" (ويجب أن تطابق COUNTRY_CODES في الـ backend)
// labelKey = مفتاح الترجمة في src/i18n (countries.*)
export const COUNTRY_CODES = [
  { value: "+970", labelKey: "countries.palestine" },
  { value: "+972", labelKey: "countries.israel" },
];

// نفس قيم REGIONS في الـ backend؛ الأسماء في src/i18n (regions.*)
export const REGIONS = [
  "hebron",
  "dura",
  "al-fawwar",
  "bani-naim",
  "yatta",
  "halhul",
  "beit-ummur",
  "al-dhaheriyeh",
  "as-samu",
  "sa-ir",
  "surif",
  "tarqumiyah",
  "idhna",
  "beit-kahil",
  "beit-awwa",
  "al-arrub",
  "kharas",
  "nuba",
  "ash-shuyukh",
  "taffuh",
  "deir-sammit",
];