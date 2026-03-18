"use client";

import { ToastData } from "@/hooks/use-toast";

interface ToastProps {
  toast: ToastData | null;
}

export default function Toast({ toast }: ToastProps) {
  if (!toast) return null;

  const icons = {
    success: "fas fa-check-circle",
    error: "fas fa-exclamation-circle",
    warning: "fas fa-exclamation-triangle",
    info: "fas fa-info-circle",
  };

  return (
    <div className={`toast ${toast.type}`}>
      <i className={icons[toast.type]}></i>
      <span>{toast.message}</span>
    </div>
  );
}
