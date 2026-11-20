// components/Portal.jsx
import { createPortal } from "react-dom";
import { useEffect } from "react";

// التطبيق يعمل في المتصفح فقط (Vite)، لذلك document.body موجود دائماً
// ولا نحتاج حالة "mounted" (كانت تسبب render إضافي).
export default function Portal({ children }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.classList.add("modal-open");

    return () => {
      document.body.style.overflow = "unset";
      document.body.classList.remove("modal-open");
    };
  }, []);

  return createPortal(children, document.body);
}
