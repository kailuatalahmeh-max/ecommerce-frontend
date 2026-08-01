import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

const getInitialRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 > Date.now()) {
      return decoded.role;
    } else {
      localStorage.removeItem("token");
      return null;
    }
  } catch {
    localStorage.removeItem("token");
    return null;
  }
};

export const useAuthStore = create((set) => ({
  role: getInitialRole(),

  login: (token) => {
    localStorage.setItem("token", token);

    const decoded = jwtDecode(token);

    set({ role: decoded.role });
  },

  setRole: (newRole) => set({ role: newRole }),

  logout: () => {
    localStorage.removeItem("token");
    set({ role: null });
  },
}));
