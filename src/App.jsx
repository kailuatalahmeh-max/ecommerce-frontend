import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { ProtectedRoute } from "../Routes/ProtectedRoute";
import Home from "./pages/home/Home";
import AddItemData from "./pages/addItemData/AddItemData";
import ViewItemDetails from "./pages/ItemDetails/ViewItemDetails";
import AdminControler from "./pages/adminControler/AdminControler";
import NotFound from "./pages/NotFoundPage/NotFound";
import AdminManagement from "./pages/adminManagement/AdminManagement";
import NewAdminLogIn from "./pages/newAdminLogIn/NewAdminLogIn";
import "./App.css";
import { useCartStore } from "./context/useCartStore";
import MyOrders from "./pages/myOrders/MyOrders";
import AdminOrders from "./pages/adminOrders/AdminOrders";
import AdminAnalytics from "./pages/adminAnalytics/AdminAnalytics";
function App() {
  const initGuestId = useCartStore((state) => state.initGuestId);
  const getData = useCartStore((state) => state.getCartData);

  useEffect(() => {
    initGuestId();
    getData();
  }, [initGuestId, getData]);

  return (
    <>
      <Toaster
        position="bottom-left"
        toastOptions={{
          duration: 3500,

          success: {
            duration: 3000,
          },
          error: {
            duration: 6000,
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/itemDetails/:id" element={<ViewItemDetails />} />
        <Route path="/admin/logIn" element={<NewAdminLogIn />} />
        <Route path="/my-orders" element={<MyOrders />} />

        <Route
          path="/admin/control-items"
          element={
            <ProtectedRoute
              allowedRoles={["admin", "moderator", "super_admin"]}
            >
              <AdminControler />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/control-items/add"
          element={
            <ProtectedRoute
              allowedRoles={["admin", "moderator", "super_admin"]}
            >
              <AddItemData />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders-management"
          element={
            <ProtectedRoute allowedRoles={["moderator", "super_admin"]}>
              <AdminOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/management"
          element={
            <ProtectedRoute allowedRoles={["super_admin"]}>
              <AdminManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute allowedRoles={["super_admin"]}>
              <AdminAnalytics />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
