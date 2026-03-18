"use client";

import { useState, useRef } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastData {
  message: string;
  type: ToastType;
}

export default function useToast() {
  const [toast, setToast] = useState<ToastData | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (message: string, type: ToastType = "info") => {
    // clear old timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // set toast
    setToast({ message, type });

    // auto remove after 3 seconds
    timeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  return { toast, showToast };
}
