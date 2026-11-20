# 🛒 متجر إلكتروني — Frontend

[English](README.md) | **العربية**

واجهة المتجر الإلكتروني، مبنية باستخدام **React** و **Vite**، وتتواصل مع [الـ Backend API](../backend/README.ar.md).

أهم المميزات:

- صفحة عرض المنتجات وصفحة تفاصيل المنتج.
- سلة مشتريات بدون تسجيل دخول (باستخدام `guestId` محفوظ في المتصفح).
- شراء مباشر وشراء من السلة.
- صفحة "طلباتي" للضيوف (عن طريق رقم الهاتف و Guest Token).
- لوحة تحكم للأدمن: المنتجات، الطلبات، حسابات الأدمن، والإحصائيات.
- صفحات محمية حسب الصلاحية (`admin`، `moderator`، `super_admin`).

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
| **CSS Modules**      | تنسيق كل مكوّن بشكل منفصل                  |

---

## 📁 هيكل المشروع

```text
frontend/
├── Routes/
│   └── ProtectedRoute.jsx    # يمنع فتح الصفحة إذا الصلاحية غير مسموحة
├── public/                   # ملفات ثابتة (الأيقونة، صفحة الصيانة)
├── src/
│   ├── App.jsx               # تعريف جميع الصفحات
│   ├── main.jsx              # نقطة التشغيل
│   ├── components/           # مكوّنات قابلة لإعادة الاستخدام (السلة، قائمة المنتجات، التحقق من الهاتف...)
│   ├── context/              # Zustand stores و React context
│   ├── pages/                # مجلد لكل صفحة
│   └── utils/                # دوال مساعدة (axiosAdmin، الثوابت، روابط)
└── vercel.json               # توجيه جميع المسارات إلى index.html (من أجل React Router)
```

### الـ Stores (`src/context/`)

| الملف              | المحتوى                                                   |
| ------------------ | --------------------------------------------------------- |
| `ItemContext.jsx`  | جلب قائمة المنتجات                                        |
| `useCartStore.js`  | السلة: إنشاء `guestId`، إضافة، حذف، تعديل الكمية          |
| `useOrderStore.js` | عمليات الشراء ومتابعة طلبات الضيف                         |
| `useAuthStore.js`  | حالة تسجيل دخول الأدمن (التوكن، الصلاحية، معرّف الأدمن)    |
| `useAdminStore.js` | عمليات الأدمن: المنتجات، الطلبات، الأدمنز، الإحصائيات      |

---

## ⚙️ الإعداد والتشغيل

جميع الأوامر تُنفَّذ من داخل مجلد `frontend/`.

### 1. تثبيت الحزم

```bash
cd frontend
npm install
```

### 2. إعداد متغيرات البيئة

أنشئ ملف `.env.development` (للتطوير المحلي) داخل `frontend/`:

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
| `*`                          | صفحة غير موجودة (404)    | الجميع                              |

---

## 🔐 كيف يعمل تسجيل دخول الأدمن

1. الأدمن يرسل الإيميل وكلمة المرور إلى `POST /api/auth/login`.
2. الـ Backend يرجع JWT Token.
3. يتم حفظ التوكن في `localStorage` (المفتاح: `token`)، وقراءة الصلاحية منه باستخدام `jwt-decode`.
4. `ProtectedRoute` يتحقق من الصلاحية، وإذا كانت غير مسموحة يرجع المستخدم إلى `/`.
5. `utils/axiosAdmin.js` يضيف `Authorization: Bearer <token>` لكل طلبات الأدمن.
6. عند فتح التطبيق، يتم حذف التوكن المنتهي تلقائياً.

> التحقق من الصلاحية في الـ Frontend هو للواجهة فقط. الحماية الحقيقية موجودة في الـ Backend.

---

## 🛒 كيف تعمل سلة الضيف

1. عند أول زيارة، ينشئ التطبيق `guestId` (UUID v4) ويحفظه في `localStorage`.
2. جميع طلبات السلة ترسل هذا الـ `guestId` في الرابط (`/api/carts/:guestId/...`).
3. لا حاجة لتسجيل الدخول.

## 📦 كيف تعمل متابعة طلبات الضيف

1. المستخدم يدخل رقم هاتفه ← `POST /api/guest/sessions`.
2. الـ Backend يرجع Guest Token، ويتم حفظه في `localStorage` (المفتاح: `guestToken`).
3. يتم جلب الطلبات عبر `GET /api/guest/orders` مع الـ header `x-guest-token`.

---

## 🔌 الـ API المستخدمة

| القسم            | الـ Endpoints                                                                                 |
| ---------------- | --------------------------------------------------------------------------------------------- |
| تسجيل الدخول     | `POST /api/auth/login`                                                                        |
| الأدمنز          | `GET /api/admins`، `POST /api/admins`، `PATCH /api/admins/:id/disable`، `PATCH /api/admins/:id/enable` |
| الإحصائيات       | `GET /api/dashboard/analytics`                                                                |
| الطلبات (الأدمن) | `GET /api/orders`، `PATCH /api/orders/:orderId`                                               |
| المنتجات         | `GET /api/items`، `POST /api/items`، `PUT /api/items/:id`، `DELETE /api/items/:id`            |
| السلة            | `/api/carts/:guestId/...` (راجع ملف الـ Backend)                                              |
| الشراء           | `POST /api/orders`، `POST /api/carts/:guestId/checkout`                                       |
| الضيف            | `POST /api/guest/sessions`، `GET /api/guest/orders`                                           |
| حالة السيرفر     | `GET /health`                                                                                 |

التفاصيل الكاملة موجودة في [ملف الـ Backend](../backend/README.ar.md).

---

## 🌐 الاستضافة

الـ Frontend مستضاف على **Vercel**. ملف `vercel.json` يوجّه جميع المسارات إلى `index.html` حتى يعمل React Router عند تحديث الصفحة.
