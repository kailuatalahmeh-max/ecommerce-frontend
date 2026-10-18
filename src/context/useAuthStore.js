import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

const getInitialAuthState = () => {
  const token = localStorage.getItem("token");
  if (!token) return { role: null, adminId: null };

  try {
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 > Date.now()) {
      return {
        role: decoded.role,
        adminId: decoded.id,
      };
    } else {
      localStorage.removeItem("token");
      return { role: null, adminId: null };
    }
  } catch {
    localStorage.removeItem("token");
    return { role: null, adminId: null };
  }
};

export const useAuthStore = create((set) => {
  const initialState = getInitialAuthState();

  return {
    role: initialState.role,
    adminId: initialState.adminId,

    login: (token) => {
      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);

      set({ role: decoded.role, adminId: decoded.id });
    },

    setRole: (newRole) => set({ role: newRole }),

    logout: () => {
      localStorage.removeItem("token");
      set({ role: null, adminId: null });
    },
  };
});
