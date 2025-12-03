import { useState, useCallback, useEffect } from "react";
import Toast, { type ToastType } from "./Toast";
import styles from "./ToastContainer.module.scss";
import { setAddToastCallback } from "./toastUtils";

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

const ToastContainer = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((toast: ToastItem) => {
    setToasts((prev) => [...prev, toast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // 전역 콜백 설정
  useEffect(() => {
    setAddToastCallback(addToast);
    return () => {
      setAddToastCallback(null);
    };
  }, [addToast]);

  if (toasts.length === 0) return null;

  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <div key={toast.id} className={styles.toastWrapper}>
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
