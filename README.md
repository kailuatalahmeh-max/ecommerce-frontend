# 🛒 E-Commerce Store — Frontend

**English** | [العربية](README.ar.md)

The frontend for the online store, built with **React** and **Vite**. It talks to the [backend API](../backend/README.md).

Main features:

- Product list and product details pages.
- Shopping cart without login (uses a `guestId` saved in the browser).
- Direct purchase and cart purchase.
- "My orders" page for guests (by phone number and guest token).
- Admin dashboard: products, orders, admin accounts, and analytics.
- Pages protected by role (`admin`, `moderator`, `super_admin`).
- Two languages: **Arabic** (default, right-to-left) and **English** (left-to-right), with a switch button on every page.

---

## 🧰 Tech Stack

| Technology           | Used for                                  |
| -------------------- | ----------------------------------------- |
| **React 19**         | UI                                        |
| **Vite**             | Dev server and build                      |
| **React Router**     | Pages and routing                         |
| **Zustand**          | State management (stores)                 |
| **Axios**            | HTTP requests to the API                  |
| **jwt-decode**       | Reading the role from the admin token     |
| **uuid**             | Creating the guest ID for the cart        |
| **react-hot-toast**  | Notifications                             |
| **i18next** + **react-i18next** | Translations (Arabic / English) |
| **CSS Modules**      | Styling for each component                |

---

## 📁 Project Structure

```text
frontend/
├── public/                   # Static files (favicon, maintenance page)
├── src/
│   ├── App.jsx               # All page routes
│   ├── main.jsx              # Entry point
│   ├── components/           # Reusable parts (cart, item list, phone check, back button, confirm dialog, language switcher...)
│   ├── context/              # Zustand stores and React context
│   ├── i18n/                 # Translations: index.js (setup), ar.json, en.json
│   ├── pages/                # One folder per page
│   ├── routes/
│   │   └── ProtectedRoute.jsx  # Blocks pages if the role is not allowed
│   └── utils/                # Helpers (axiosAdmin, constants, URL helpers)
└── vercel.json               # Sends all paths to index.html (for React Router)
```

### Stores (`src/context/`)

| File               | Content                                                      |
| ------------------ | ------------------------------------------------------------ |
| `ItemContext.jsx`  | Gets the product list                                        |
| `useCartStore.js`  | Cart: create `guestId`, add, remove, change quantity         |
| `useOrderStore.js` | Purchases and guest order tracking                           |
| `useAuthStore.js`  | Admin login state (token, role, admin ID)                    |
| `useAdminStore.js` | Admin actions: products, orders, admins, analytics           |
| `useConfirmStore.js` | `confirmDialog()`: the site's confirm popup (instead of `window.confirm`) |

---

## ⚙️ Setup and Run

Run all commands inside the `frontend/` folder.

### 1. Install packages

```bash
cd frontend
npm install
```

### 2. Environment variables

Create a `.env.development` file (for local work) inside `frontend/`:

```env
VITE_API_URL=http://localhost:5000
```

`VITE_API_URL` is the backend address, **without** `/api` at the end. For production (Vercel), set the same variable in the project settings.

### 3. Start

```bash
npm run dev
```

The app runs at `http://localhost:5173` (Vite default).

### Other commands

| Command           | What it does                         |
| ----------------- | ------------------------------------ |
| `npm run build`   | Build for production (`dist/`)       |
| `npm run preview` | Preview the production build         |
| `npm run lint`    | Check the code with ESLint           |

> The backend must be running too. See the [backend README](../backend/README.md).
>
> ⚠️ The backend allows only one CORS origin: its `FRONTEND_URL`. For local work, set `FRONTEND_URL=http://localhost:5173` in `backend/.env`, or the browser will block the requests.

---

## 🗺️ Pages

| Path                         | Page                     | Who can open it                    |
| ---------------------------- | ------------------------ | ---------------------------------- |
| `/`                          | Home (product list)      | Everyone                           |
| `/itemDetails/:id`           | Product details          | Everyone                           |
| `/my-orders`                 | My orders                | Everyone                           |
| `/admin/logIn`               | Admin login              | Everyone                           |
| `/admin/control-items`       | Products dashboard       | `admin`, `moderator`, `super_admin` |
| `/admin/control-items/add`   | Add a product            | `admin`, `moderator`, `super_admin` |
| `/admin/orders-management`   | Orders management        | `moderator`, `super_admin`         |
| `/admin/management`          | Admin management         | `super_admin`                      |
| `/admin/admins-management`   | Admin accounts           | `super_admin`                      |
| `/admin/analytics`           | Analytics                | `super_admin`                      |
| `*`                          | Not found (404)          | Everyone                           |

---

## 🌐 Languages (i18n)

The site supports **Arabic** and **English** with [react-i18next](https://react.i18next.com/).

| What | How |
| ---- | --- |
| Default language | Arabic (`ar`) |
| Switch | The 🌐 button at the bottom-right of every page (`components/languageSwitcher/`) |
| Saved choice | `localStorage` (key: `lang`) |
| Direction | `<html dir>` changes automatically: `rtl` for Arabic, `ltr` for English |
| Dates | Shown in the chosen language, with Latin digits (0–9) |
| Text files | `src/i18n/ar.json` and `src/i18n/en.json` (same keys in both) |

**To add new text:** add the same key to **both** JSON files, then use it in a component:

```jsx
import { useTranslation } from "react-i18next";

const { t } = useTranslation();
<p>{t("cart.emptyText")}</p>
<p>{t("stock.few", { count: 3 })}</p>   // with a value: "Only {{count}} left"
```

Outside React components (for example in Zustand stores), use `i18n.t("key")` from `src/i18n`.

> Messages that come from the backend (for example API errors) are in Arabic only. Product names come from the database and are not translated.

---

## 🔐 How Admin Login Works

1. The admin sends email and password to `POST /api/auth/login`.
2. The backend returns a JWT token.
3. The token is saved in `localStorage` (key: `token`), and the role is read from it with `jwt-decode`.
4. `ProtectedRoute` checks the role. If the role is not allowed, it goes back to `/`.
5. `utils/axiosAdmin.js` adds `Authorization: Bearer <token>` to every admin request.
6. When the app starts, an expired token is removed automatically.

> The frontend role check is only for the UI. The real protection is in the backend.

---

## 🛒 How the Guest Cart Works

1. On first visit, the app creates a `guestId` (UUID v4) and saves it in `localStorage`.
2. All cart requests send this `guestId` in the URL (`/api/carts/:guestId/...`).
3. No login is needed.

## 📦 How Guest Order Tracking Works

1. The user picks the country code (`+970` / `+972`, same list as checkout in `utils/constants.js`) and enters their phone number → `POST /api/guest/sessions`.
2. The backend returns a guest token. It is saved in `localStorage` (key: `guestToken`). The number the user types is **always** checked again, so an old token for another number is never used.
3. The orders are loaded with `GET /api/guest/orders` and the `x-guest-token` header.
4. When the "My orders" page opens or is refreshed, it loads the orders again with the saved token (so it also shows the latest status).
5. If there is no token, or it has expired (**401**), the token is removed and the page asks the user to enter their number from the home page.

---

## 🔌 API Calls Used

| Area      | Endpoints                                                                                     |
| --------- | --------------------------------------------------------------------------------------------- |
| Auth      | `POST /api/auth/login`                                                                        |
| Admins    | `GET /api/admins`, `POST /api/admins`, `PATCH /api/admins/:id/disable`, `PATCH /api/admins/:id/enable` |
| Dashboard | `GET /api/dashboard/analytics`                                                                |
| Orders (admin) | `GET /api/orders`, `PATCH /api/orders/:orderId`                                          |
| Items     | `GET /api/items`, `POST /api/items`, `PUT /api/items/:id`, `DELETE /api/items/:id`            |
| Cart      | `/api/carts/:guestId/...` (see backend README)                                                |
| Purchase  | `POST /api/orders`, `POST /api/carts/:guestId/checkout`                                       |
| Guest     | `POST /api/guest/sessions`, `GET /api/guest/orders`                                           |
| Health    | `GET /health`                                                                                 |

Full details are in the [backend README](../backend/README.md#-api-endpoints).

---

## 🌐 Hosting

The frontend is hosted on **Vercel**. `vercel.json` sends every path to `index.html`, so React Router works when you refresh a page.
