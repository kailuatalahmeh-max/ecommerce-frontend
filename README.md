# 🛒 E-Commerce Store — Frontend

**English** | [العربية](README.ar.md)

The frontend for the online store, built with **React** and **Vite**. It talks to the [backend API](../backend/README.md).

Main features:

- Product list and product details pages.
- Shopping cart without login (uses a `guestId` saved in the browser).
- Direct purchase and cart purchase, with order confirmation on WhatsApp.
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
│   ├── components/           # Reusable parts (cart, item list, phone check, back button, confirm dialog, language switcher, WhatsApp confirm...)
│   ├── context/              # Zustand stores and React context
│   ├── i18n/                 # Translations: index.js (setup), ar.json, en.json
│   ├── pages/                # One folder per page
│   ├── routes/
│   │   └── ProtectedRoute.jsx  # Blocks pages if the role is not allowed
│   └── utils/                # Helpers (axiosAdmin, constants, formatPrice, URL helpers)
└── vercel.json               # Sends all paths to index.html (for React Router)
```

### Stores (`src/context/`)

| File               | Content                                                      |
| ------------------ | ------------------------------------------------------------ |
| `ItemContext.jsx`  | Gets the product list                                        |
| `useCartStore.js`  | Cart: create `guestId`, add, remove, change quantity         |
| `useOrderStore.js` | Purchases, WhatsApp confirm status, and guest order tracking |
| `useAuthStore.js`  | Admin login state (token, role, admin ID)                    |
| `useAdminStore.js` | Admin actions: products, orders (and manual confirm), admins, analytics |
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
>
> ⚠️ Buying does not work until the store's WhatsApp number is saved once: `node scripts/storeSettingsSeed.js +970599123456` (from `backend/`). Without it the API returns `503`.

### Test on a phone (same Wi-Fi)

1. Find your PC's IP (`ipconfig`), for example `192.168.1.16`.
2. Set `VITE_API_URL=http://192.168.1.16:5000` in `frontend/.env.development` and `FRONTEND_URL=http://192.168.1.16:5173` in `backend/.env`.
3. **Restart both servers** (a running server does not read `.env` again). Start the frontend with `npm run dev -- --host`.
4. Open `http://192.168.1.16:5173` on the phone. Use the IP on the PC too, not `localhost`, or CORS will block it.

> On `http` (not `https`) the phone blocks the clipboard, so the **Copy** button of the confirm code shows an error. It works on Vercel.

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

## 💰 Prices and Currency

The store uses the **Israeli shekel (₪)**. Every price on the site goes through one helper, `src/utils/formatPrice.js`:

```js
import { formatPrice } from "../../utils/formatPrice";

formatPrice(1099); // "1,099.00 ₪"
formatPrice(9.5);  // "9.50 ₪"
```

- Comma for thousands, always 2 decimals, `₪` after the number. Latin digits (0–9) in both languages.
- A missing or wrong value shows `0.00 ₪` (no crash).
- To change the currency or the format, edit **only** `formatPrice.js`. Do not write `₪` directly in components or in the translation files.

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

## 💬 How WhatsApp Order Confirmation Works

1. After a successful purchase (direct or cart), the checkout form changes to a confirm screen (`components/whatsAppConfirm/`).
2. It shows the 6-character code, a **Copy** button, and the time limit (24 hours, shown with date and time).
3. **Confirm on WhatsApp** opens the `whatsappUrl` from the backend: a chat with the store, with the code already typed.
4. While the order is `pending`, the screen asks `GET /api/orders/:id/confirmation` every **5 seconds**, and right away when the customer comes back to the page.
5. `confirmed` → ✅ screen with a **Go to My Orders** button. `expired` → ⌛ screen.
6. Clicking outside this screen does not close it, so the code is not lost by mistake.

**My orders** shows a badge on each order: waiting (with the code), confirmed, or expired.

**Admin orders page** (`/admin/orders-management`): each order shows its confirm state and code. While it is waiting, a **Confirm order** button opens a popup ("only confirm if you got code X from number Y"), then calls `POST /api/orders/confirm`.

> Automatic confirmation (a WhatsApp bot) is not built yet. For now a moderator confirms by hand.

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
| Orders (admin) | `GET /api/orders`, `PATCH /api/orders/:orderId`, `POST /api/orders/confirm`              |
| Confirmation | `GET /api/orders/:id/confirmation`                                                          |
| Items     | `GET /api/items`, `POST /api/items`, `PUT /api/items/:id`, `DELETE /api/items/:id`            |
| Cart      | `/api/carts/:guestId/...` (see backend README)                                                |
| Purchase  | `POST /api/orders`, `POST /api/carts/:guestId/checkout`                                       |
| Guest     | `POST /api/guest/sessions`, `GET /api/guest/orders`                                           |
| Health    | `GET /health`                                                                                 |

Full details are in the [backend README](../backend/README.md#-api-endpoints).

---

## 🌐 Hosting

The frontend is hosted on **Vercel**. `vercel.json` sends every path to `index.html`, so React Router works when you refresh a page.
