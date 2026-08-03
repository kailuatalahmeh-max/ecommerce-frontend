// components/Portal.jsx
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

export default function Portal({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
    
    return () => {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('modal-open');
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    children,
    document.body
  );
}