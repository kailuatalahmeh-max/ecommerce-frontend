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
| **CSS Modules**      | Styling for each component                |

---

## 📁 Project Structure

```text
frontend/
├── Routes/
│   └── ProtectedRoute.jsx    # Blocks pages if the role is not allowed
├── public/                   # Static files (favicon, maintenance page)
├── src/
│   ├── App.jsx               # All page routes
│   ├── main.jsx              # Entry point
│   ├── components/           # Reusable parts (cart, item list, phone check...)
│   ├── context/              # Zustand stores and React context
│   ├── pages/                # One folder per page
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

1. The user enters their phone number → `POST /api/guest/verify`.
2. The backend returns a guest token. It is saved in `localStorage` (key: `guestToken`).
3. The orders are loaded with `GET /api/guest/orders` and the `x-guest-token` header.

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
| Purchase  | `POST /api/direct-purchase/set-data`, `POST /api/cart-purchase/set-data/:guestId`             |
| Guest     | `POST /api/guest/verify`, `GET /api/guest/orders`                                             |
| Health    | `GET /health`                                                                                 |

Full details are in the [backend README](../backend/README.md#-api-endpoints).

---

## 🌐 Hosting

The frontend is hosted on **Vercel**. `vercel.json` sends every path to `index.html`, so React Router works when you refresh a page.
