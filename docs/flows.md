[← Back to README](../README.md) · **English** | [العربية](ar/flows.md)

# 🔄 How It Works

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

---

## 💬 How WhatsApp Order Confirmation Works

1. After a successful purchase (direct or cart), the checkout form changes to a confirm screen (`components/whatsAppConfirm/`).
2. It shows the 6-character code, a **Copy** button, and the time limit (24 hours, shown with date and time).
3. **Confirm on WhatsApp** opens the `whatsappUrl` from the backend: a chat with the store, with the code already typed.
4. A note says the store will confirm the order, and the status can be seen later. Buttons: **Go to My Orders** and **Done**.
5. Clicking outside this screen does not close it, so the code is not lost by mistake.

> The screen does **not** ask the server for the confirm status. That route (`GET /api/orders/:id/confirmation`) is closed until the WhatsApp bot is built.

**My orders** shows a badge on each order: waiting (with the code), confirmed, or expired. An order not confirmed in **24 hours** is cancelled by the server (status **Cancelled** + badge **expired**), and its stock comes back.

**Admin orders page** (`/admin/orders-management`): each order shows its confirm state and code. While it is waiting, a **Confirm order** button opens a popup ("only confirm if you got code X from number Y"), then calls `POST /api/orders/confirm`.

> Automatic confirmation (a WhatsApp bot) is not built yet. For now a moderator confirms by hand.

---

## 🔎 Track an Order by Code (home page)

The **🎁 My Orders** button on the home page opens `components/trackOrder/TrackOrder.jsx`:

> 📋 If this device has saved orders, a green button **📋 View orders saved on this device** shows at the top, with the number of saved orders. It opens the "My orders" page. Under it: "Or track another order with its code:". With no saved orders, only the form shows.
1. The customer enters the **confirmation code** (from the WhatsApp screen after buying) and their **phone number** with the country code.
   - The code is made uppercase and spaces are removed (`k7p 2xm` → `K7P2XM`). It must be 6 characters with no `0 O 1 I L`, or a yellow hint shows and the button stays disabled.
2. `trackOrder()` in `useOrderStore.js` sends both to `POST /api/orders/track`.
3. If found, the same popup shows the order: code, order status, WhatsApp confirm badge, date, items, and total. The order is also **saved on this device** (so it shows in "My orders"). Buttons: **✖ Cancel order** (only for a **Pending** order, see [Cancel an order](#-cancel-an-order)), **See all my orders** and **Track another order**.
4. If not found, a toast shows the server's message.

> The phone is needed too: someone who only knows a phone number cannot see orders this way.

---

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
8. Orders made **before** this feature are not saved on the device. Enter the code + phone once in 🎁 My Orders to add them.
9. **Contact support** at the bottom uses the store WhatsApp number from **⚙️ Store settings** (`GET /api/store-settings/public`): a 💬 WhatsApp chat link and a 📞 call link. With no saved number, this part is hidden (a fake number never shows).

> A product with no images shows `public/placeholder-image.svg` (`PLACEHOLDER_IMAGE` in `utils/constants.js`). It is inside the project, so it does not depend on another website.

> The old `guestToken` in `localStorage` is removed once when the app loads (guest sessions were removed from the backend).

### ✖ Cancel an order

- Each **Pending** order has a red **Cancel order** button, in "My orders" **and** in the TrackOrder popup. Accepted, Delivered and Cancelled orders don't have it.
- Both use the same `cancelOrder()`. It returns `{ order }` on success, `{ failed: true }` on an error, or `null` if the customer chose "No, keep it".
- In TrackOrder, the popup shows **Cancelled** at once. On an error it asks `/track` again, to show the new status.
- A click opens the confirm dialog ("Cancel order" / "No, keep it").
- `cancelOrder()` in `useOrderStore.js` sends the saved `code + phoneNumber` to `POST /api/orders/cancel`. The server returns the stock.
- On success the card shows **Cancelled** at once, and the order **stays** in the list.
- If the store accepted the order a moment before (`409`), the server's message shows, and the list loads again with the new status.
- Cancelled orders are **not** counted in the total price.

---

## ⚙️ Store Settings Page (`/admin/store-settings`)

`pages/storeSettings/StoreSettings.jsx`, for **`super_admin` only**: the route is protected, the menu link **⚙️ Store settings** shows only for `super_admin`, and the API refuses other roles.

1. It shows the current store WhatsApp number, when and by whom it was changed. With no number, a yellow warning says all purchases are stopped.
2. The form has a country code and a number. The number is cleaned like on the server (spaces, `-`, one leading `0`), and it must be 9 digits, or a hint shows and **Save number** stays disabled.
3. Before saving, it shows how the number will be saved (`+970599123456`). The same number as now can't be saved again.
4. **Save number** asks first with the confirm dialog, then `saveStoreWhatsApp()` sends `PUT /api/store-settings`.

> Customers send their confirmation codes to this number, so make sure WhatsApp works on it.
