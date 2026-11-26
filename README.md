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
├── .env.example              # Example env variables (copy it to .env.development)
├── docs/                     # Detailed docs (English), docs/ar/ (Arabic)
├── public/                   # Static files (favicon, maintenance page, placeholder-image.svg)
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
| `useOrderStore.js` | Purchases, tracking one order (`trackOrder`), the saved orders (`fetchSavedOrders`, remove, clear all), cancel (`cancelOrder`) |
| `useAuthStore.js`  | Admin login state (token, role, admin ID)                    |
| `useAdminStore.js` | Admin actions: products, orders (and manual confirm), admins, analytics, store settings (`getStoreSettings`, `saveStoreWhatsApp`) |
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

Copy the example file (for local work) inside `frontend/`:

```bash
cp .env.example .env.development
```

`.env.example` is in git and has no secrets. `VITE_` values are visible in the browser, so never put a secret there. For production, set the same variable in Vercel → **Environment Variables**. The file:

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
> ⚠️ Buying does not work until the store's WhatsApp number is saved once: in the admin page **⚙️ Store settings** (`super_admin`), or `node scripts/storeSettingsSeed.js +970599123456` (from `backend/`). Without it the API returns `503`.

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
| `/admin/store-settings`      | Store settings (WhatsApp number) | `super_admin`              |
| `*`                          | Not found (404)          | Everyone                           |

---

## 🔌 API Calls Used

| Area      | Endpoints                                                                                     |
| --------- | --------------------------------------------------------------------------------------------- |
| Auth      | `POST /api/auth/login`                                                                        |
| Admins    | `GET /api/admins`, `POST /api/admins`, `PATCH /api/admins/:id/disable`, `PATCH /api/admins/:id/enable` |
| Dashboard | `GET /api/dashboard/analytics`                                                                |
| Store settings | `GET /api/store-settings`, `PUT /api/store-settings`, `GET /api/store-settings/public`   |
| Orders (admin) | `GET /api/orders`, `PATCH /api/orders/:orderId`, `POST /api/orders/confirm`              |
| Track     | `POST /api/orders/track`, `POST /api/orders/track-many`, `POST /api/orders/cancel`            |
| Items     | `GET /api/items`, `POST /api/items`, `PUT /api/items/:id`, `DELETE /api/items/:id`            |
| Cart      | `/api/carts/:guestId/...` (see backend README)                                                |
| Purchase  | `POST /api/orders`, `POST /api/carts/:guestId/checkout`                                       |
| Health    | `GET /health`                                                                                 |

Full details are in the [backend README](../backend/docs/api.md#-api-endpoints).

---

## 📖 Documentation

| Topic | What is inside |
| ----- | -------------- |
| [🔄 How it works](docs/flows.md) | Admin login, guest cart, WhatsApp confirm, track an order, "My orders", cancel, store settings page |
| [🌐 Languages and prices](docs/i18n.md) | Arabic / English (i18n) and the price format |

---

## 🌐 Hosting

The frontend is hosted on **Vercel**. `vercel.json` sends every path to `index.html`, so React Router works when you refresh a page.
