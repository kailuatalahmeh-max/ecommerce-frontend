import { Navigate } from "react-router-dom";
import { useAuthStore } from "../src/context/useAuthStore";

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const role = useAuthStore((state) => state.role);

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }

  return children;
};