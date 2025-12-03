import { type ToastType } from "./Toast";

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

let toastIdCounter = 0;
let addToastCallback: ((toast: ToastItem) => void) | null = null;

export const setAddToastCallback = (callback: ((toast: ToastItem) => void) | null) => {
  addToastCallback = callback;
};

export const showToast = (message: string, type: ToastType = "info") => {
  if (addToastCallback) {
    const id = `toast-${toastIdCounter++}`;
    addToastCallback({ id, message, type });
  }
};

