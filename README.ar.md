# 🛒 متجر إلكتروني — Frontend

[English](README.md) | **العربية**

واجهة المتجر الإلكتروني، مبنية باستخدام **React** و **Vite**، وتتواصل مع [الـ Backend API](../backend/README.ar.md).

أهم المميزات:

- صفحة عرض المنتجات وصفحة تفاصيل المنتج.
- سلة مشتريات بدون تسجيل دخول (باستخدام `guestId` محفوظ في المتصفح).
- شراء مباشر وشراء من السلة، مع تأكيد الطلب عبر واتساب.
- صفحة "طلباتي": الطلبات المحفوظة على هذا الجهاز، دائماً ببيانات جديدة (برمز التأكيد + رقم الهاتف، بدون تسجيل دخول).
- لوحة تحكم للأدمن: المنتجات، الطلبات، حسابات الأدمن، والإحصائيات.
- صفحات محمية حسب الصلاحية (`admin`، `moderator`، `super_admin`).
- لغتان: **العربية** (الافتراضية، من اليمين لليسار) و **الإنجليزية** (من اليسار لليمين)، مع زر للتبديل في كل الصفحات.

---

## 🧰 التقنيات المستخدمة

| التقنية              | الاستخدام                                  |
| -------------------- | ------------------------------------------ |
| **React 19**         | بناء الواجهة                               |
| **Vite**             | سيرفر التطوير والـ build                   |
| **React Router**     | الصفحات والتنقل                            |
| **Zustand**          | إدارة الحالة (stores)                      |
| **Axios**            | إرسال الطلبات إلى الـ API                  |
| **jwt-decode**       | قراءة الصلاحية من توكن الأدمن              |
| **uuid**             | إنشاء معرّف الضيف للسلة                    |
| **react-hot-toast**  | الإشعارات                                  |
| **i18next** + **react-i18next** | الترجمة (عربي / إنجليزي)        |
| **CSS Modules**      | تنسيق كل مكوّن بشكل منفصل                  |

---

## 📁 هيكل المشروع

```text
frontend/
├── .env.example              # مثال لمتغيرات البيئة (انسخه إلى .env.development)
├── docs/                     # التوثيق المفصّل (إنجليزي)، docs/ar/ (عربي)
├── public/                   # ملفات ثابتة (الأيقونة، صفحة الصيانة، placeholder-image.svg)
├── src/
│   ├── App.jsx               # تعريف جميع الصفحات
│   ├── main.jsx              # نقطة التشغيل
│   ├── components/           # مكوّنات قابلة لإعادة الاستخدام (السلة، قائمة المنتجات، تتبّع الطلب، زر الرجوع، نافذة التأكيد، زر اللغة، تأكيد واتساب...)
│   ├── context/              # Zustand stores و React context
│   ├── i18n/                 # الترجمة: index.js (الإعداد)، ar.json، en.json
│   ├── pages/                # مجلد لكل صفحة
│   ├── routes/
│   │   └── ProtectedRoute.jsx  # يمنع فتح الصفحة إذا الصلاحية غير مسموحة
│   └── utils/                # دوال مساعدة (axiosAdmin، الثوابت، formatPrice، savedOrders، روابط)
└── vercel.json               # توجيه جميع المسارات إلى index.html (من أجل React Router)
```

### الـ Stores (`src/context/`)

| الملف              | المحتوى                                                   |
| ------------------ | --------------------------------------------------------- |
| `ItemContext.jsx`  | جلب قائمة المنتجات                                        |
| `useCartStore.js`  | السلة: إنشاء `guestId`، إضافة، حذف، تعديل الكمية          |
| `useOrderStore.js` | عمليات الشراء، تتبّع طلب واحد (`trackOrder`)، الطلبات المحفوظة (`fetchSavedOrders`، الحذف، حذف الكل)، الإلغاء (`cancelOrder`) |
| `useAuthStore.js`  | حالة تسجيل دخول الأدمن (التوكن، الصلاحية، معرّف الأدمن)    |
| `useAdminStore.js` | عمليات الأدمن: المنتجات، الطلبات (والتأكيد اليدوي)، الأدمنز، الإحصائيات، إعدادات المتجر (`getStoreSettings`، `saveStoreWhatsApp`) |
| `useConfirmStore.js` | `confirmDialog()`: نافذة التأكيد الخاصة بالموقع (بدل `window.confirm`) |

---

## ⚙️ الإعداد والتشغيل

جميع الأوامر تُنفَّذ من داخل مجلد `frontend/`.

### 1. تثبيت الحزم

```bash
cd frontend
npm install
```

### 2. إعداد متغيرات البيئة

انسخ ملف المثال (للتطوير المحلي) داخل `frontend/`:

```bash
cp .env.example .env.development
```

ملف `.env.example` موجود في git ولا يحتوي أسراراً. قيم `VITE_` تظهر في المتصفح، لذلك لا تضع فيها أي سر. للإنتاج، ضع نفس المتغير في Vercel ← **Environment Variables**. الملف:

```env
VITE_API_URL=http://localhost:5000
```

`VITE_API_URL` هو عنوان الـ Backend **بدون** `/api` في النهاية. في الإنتاج (Vercel) أضف نفس المتغير من إعدادات المشروع.

### 3. التشغيل

```bash
npm run dev
```

يعمل التطبيق على `http://localhost:5173` (الافتراضي في Vite).

### أوامر أخرى

| الأمر             | الوظيفة                               |
| ----------------- | ------------------------------------- |
| `npm run build`   | بناء نسخة الإنتاج (`dist/`)           |
| `npm run preview` | معاينة نسخة الإنتاج                   |
| `npm run lint`    | فحص الكود باستخدام ESLint             |

> يجب تشغيل الـ Backend أيضاً. راجع [ملف الـ Backend](../backend/README.ar.md).
>
> ⚠️ الـ Backend يسمح بـ CORS origin واحد فقط وهو `FRONTEND_URL`. للتطوير المحلي ضع `FRONTEND_URL=http://localhost:5173` في `backend/.env`، وإلا سيمنع المتصفح الطلبات.
>
> ⚠️ الشراء لا يعمل حتى يتم حفظ رقم واتساب المتجر مرة واحدة: من صفحة الأدمن **⚙️ إعدادات المتجر** (`super_admin`)، أو `node scripts/storeSettingsSeed.js +970599123456` (من `backend/`). بدونه يرجع الـ API الكود `503`.

### التجربة على الهاتف (نفس شبكة الـ Wi-Fi)

1. اعرف IP الكمبيوتر (`ipconfig`)، مثلاً `192.168.1.16`.
2. ضع `VITE_API_URL=http://192.168.1.16:5000` في `frontend/.env.development` و`FRONTEND_URL=http://192.168.1.16:5173` في `backend/.env`.
3. **أعد تشغيل السيرفرين** (السيرفر الشغّال لا يقرأ `.env` من جديد). شغّل الـ Frontend بـ `npm run dev -- --host`.
4. افتح `http://192.168.1.16:5173` على الهاتف. استخدم الـ IP على الكمبيوتر أيضاً وليس `localhost`، وإلا سيمنعه CORS.

> على `http` (وليس `https`) الهاتف يمنع النسخ، لذلك زر **نسخ** رمز التأكيد يُظهر خطأ. على Vercel يعمل.

---

## 🗺️ الصفحات

| المسار                       | الصفحة                   | من يستطيع فتحها                     |
| ---------------------------- | ------------------------ | ----------------------------------- |
| `/`                          | الرئيسية (المنتجات)      | الجميع                              |
| `/itemDetails/:id`           | تفاصيل المنتج            | الجميع                              |
| `/my-orders`                 | طلباتي                   | الجميع                              |
| `/admin/logIn`               | تسجيل دخول الأدمن        | الجميع                              |
| `/admin/control-items`       | لوحة المنتجات            | `admin`، `moderator`، `super_admin` |
| `/admin/control-items/add`   | إضافة منتج               | `admin`، `moderator`، `super_admin` |
| `/admin/orders-management`   | إدارة الطلبات            | `moderator`، `super_admin`          |
| `/admin/management`          | إدارة الأدمن             | `super_admin`                       |
| `/admin/admins-management`   | حسابات الأدمن            | `super_admin`                       |
| `/admin/analytics`           | الإحصائيات               | `super_admin`                       |
| `/admin/store-settings`      | إعدادات المتجر (رقم واتساب) | `super_admin`                    |
| `*`                          | صفحة غير موجودة (404)    | الجميع                              |

---

## 🔌 الـ API المستخدمة

| القسم            | الـ Endpoints                                                                                 |
| ---------------- | --------------------------------------------------------------------------------------------- |
| تسجيل الدخول     | `POST /api/auth/login`                                                                        |
| الأدمنز          | `GET /api/admins`، `POST /api/admins`، `PATCH /api/admins/:id/disable`، `PATCH /api/admins/:id/enable` |
| الإحصائيات       | `GET /api/dashboard/analytics`                                                                |
| إعدادات المتجر   | `GET /api/store-settings`، `PUT /api/store-settings`، `GET /api/store-settings/public`        |
| الطلبات (الأدمن) | `GET /api/orders`، `PATCH /api/orders/:orderId`، `POST /api/orders/confirm`                   |
| تتبّع الطلب      | `POST /api/orders/track`، `POST /api/orders/track-many`، `POST /api/orders/cancel`            |
| المنتجات         | `GET /api/items`، `POST /api/items`، `PUT /api/items/:id`، `DELETE /api/items/:id`            |
| السلة            | `/api/carts/:guestId/...` (راجع ملف الـ Backend)                                              |
| الشراء           | `POST /api/orders`، `POST /api/carts/:guestId/checkout`                                       |
| حالة السيرفر     | `GET /health`                                                                                 |

التفاصيل الكاملة موجودة في [توثيق الـ API في الـ Backend](../backend/docs/ar/api.md#-توثيق-الـ-api-endpoints).

---

## 📖 التوثيق

| الموضوع | المحتوى |
| ------- | ------- |
| [🔄 كيف تعمل الأجزاء](docs/ar/flows.md) | دخول الأدمن، سلة الضيف، تأكيد واتساب، تتبّع الطلب، "طلباتي"، الإلغاء، صفحة إعدادات المتجر |
| [🌐 اللغات والأسعار](docs/ar/i18n.md) | العربية / الإنجليزية (i18n) وشكل السعر |

---

## 🌐 الاستضافة

الـ Frontend مستضاف على **Vercel**. ملف `vercel.json` يوجّه جميع المسارات إلى `index.html` حتى يعمل React Router عند تحديث الصفحة.
