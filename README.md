# 🛒 E-Commerce Store — Frontend

**English** | [العربية](README.ar.md)

The frontend for the online store, built with **React** and **Vite**. It talks to the [backend API](../backend/README.md).

Main features:

- Product list and product details pages.
- Shopping cart without login (uses a `guestId` saved in the browser).
- Direct purchase and cart purchase, with order confirmation on WhatsApp.
- "My orders" page: the orders saved on this device, always with fresh data (by confirmation code + phone, no login).
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
│   ├── components/           # Reusable parts (cart, item list, track order, back button, confirm dialog, language switcher, WhatsApp confirm...)
│   ├── context/              # Zustand stores and React context
│   ├── i18n/                 # Translations: index.js (setup), ar.json, en.json
│   ├── pages/                # One folder per page
│   ├── routes/
│   │   └── ProtectedRoute.jsx  # Blocks pages if the role is not allowed
│   └── utils/                # Helpers (axiosAdmin, constants, formatPrice, savedOrders, URL helpers)
└── vercel.json               # Sends all paths to index.html (for React Router)
```

### Stores (`src/context/`)

| File               | Content                                                      |
| ------------------ | ------------------------------------------------------------ |
| `ItemContext.jsx`  | Gets the product list                                        |
| `useCartStore.js`  | Cart: create `guestId`, add, remove, change quantity         |
| `useOrderStore.js` | Purchases, tracking one order (`trackOrder`), the saved orders (`fetchSavedOrders`, remove, clear all) |
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
4. A note says the store will confirm the order, and the status can be seen later. Buttons: **Go to My Orders** and **Done**.
5. Clicking outside this screen does not close it, so the code is not lost by mistake.

> The screen does **not** ask the server for the confirm status. That route (`GET /api/orders/:id/confirmation`) is closed until the WhatsApp bot is built.

**My orders** shows a badge on each order: waiting (with the code), confirmed, or expired.

**Admin orders page** (`/admin/orders-management`): each order shows its confirm state and code. While it is waiting, a **Confirm order** button opens a popup ("only confirm if you got code X from number Y"), then calls `POST /api/orders/confirm`.

> Automatic confirmation (a WhatsApp bot) is not built yet. For now a moderator confirms by hand.

## 🔎 Track an Order by Code (home page)

The **🎁 My Orders** button on the home page opens `components/trackOrder/TrackOrder.jsx`:

1. The customer enters the **confirmation code** (from the WhatsApp screen after buying) and their **phone number** with the country code.
   - The code is made uppercase and spaces are removed (`k7p 2xm` → `K7P2XM`). It must be 6 characters with no `0 O 1 I L`, or a yellow hint shows and the button stays disabled.
2. `trackOrder()` in `useOrderStore.js` sends both to `POST /api/orders/track`.
3. If found, the same popup shows the order: code, order status, WhatsApp confirm badge, date, items, and total. The order is also **saved on this device** (so it shows in "My orders"). Buttons: **See all my orders** and **Track another order**.
4. If not found, a toast shows the server's message.

> The phone is needed too: someone who only knows a phone number cannot see orders this way.

## 📦 How "My orders" Works (saved on this device)

There is **no login and no token**. The browser keeps a small list of the customer's orders in `localStorage` (key: `savedOrders`, file `utils/savedOrders.js`):

```json
[{ "code": "K7P2XM", "phoneNumber": "+970599123456", "savedAt": "2026-11-26T12:00:00.000Z" }]
```

1. **Saved automatically** after every purchase (`CompleteOrder.jsx`), and when an order is found in TrackOrder (useful on a new device: the code is in the customer's WhatsApp chat).
2. Only `code + phoneNumber` is saved, **not** the order data. The newest is first, the same code is never saved twice, and the list keeps at most **50**.
3. Every time "My orders" opens (or is refreshed), `fetchSavedOrders()` asks `POST /api/orders/track-many` for **fresh data**. More than 20 saved orders → several requests of 20.
4. Each order shows its date, status, WhatsApp confirm badge, items and price. The status filter and the total work on these orders.
5. An order the server can't find shows **"Order not found"** with its code (for example, if it was deleted).
6. 🗑️ on each order and **Clear all** remove orders **from this device only** (the order is **not** cancelled). Both ask first with the confirm dialog.
7. No saved orders → a message explains how to add one (buy, or 🎁 My Orders + code).

> The old `guestToken` in `localStorage` is removed once when the app loads (guest sessions were removed from the backend).

> **Later:** the saved code + phone can also be used to let the customer **cancel** an order.

---

## 🔌 API Calls Used

| Area      | Endpoints                                                                                     |
| --------- | --------------------------------------------------------------------------------------------- |
| Auth      | `POST /api/auth/login`                                                                        |
| Admins    | `GET /api/admins`, `POST /api/admins`, `PATCH /api/admins/:id/disable`, `PATCH /api/admins/:id/enable` |
| Dashboard | `GET /api/dashboard/analytics`                                                                |
| Orders (admin) | `GET /api/orders`, `PATCH /api/orders/:orderId`, `POST /api/orders/confirm`              |
| Track     | `POST /api/orders/track`, `POST /api/orders/track-many`                                       |
| Items     | `GET /api/items`, `POST /api/items`, `PUT /api/items/:id`, `DELETE /api/items/:id`            |
| Cart      | `/api/carts/:guestId/...` (see backend README)                                                |
| Purchase  | `POST /api/orders`, `POST /api/carts/:guestId/checkout`                                       |
| Health    | `GET /health`                                                                                 |

Full details are in the [backend README](../backend/README.md#-api-endpoints).

---

## 🌐 Hosting

The frontend is hosted on **Vercel**. `vercel.json` sends every path to `index.html`, so React Router works when you refresh a page.
