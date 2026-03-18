"use client";
import { getDaysLeft } from "@/utils/get-days-left";
import { Task } from "@/utils/types";
import { useEffect } from "react";
import { toast } from "react-toastify";

function getTodayKey() {
  const today = new Date();
  return today.toISOString().split("T")[0]; 
}

export default function TasksNotifications({ tasks }: { tasks: Task[] }) {
  useEffect(() => {
    if (!tasks || tasks.length === 0) return;

    const todayKey = getTodayKey();

    tasks.forEach((task) => {
      if (!task.endDate) return;

      const daysLeft = getDaysLeft(task.endDate);
      if (![3, 2, 1, 0].includes(daysLeft)) return;

      const storageKey = `task-toast-${task.id}`;
      if (typeof window !== "undefined") {
        const lastShownDate = localStorage.getItem(storageKey);

        if (lastShownDate === todayKey) return;
      }
      if (daysLeft === 3) {
        toast.warning(`⚠️ المهمة "${task.title}" باقي عليها 3 أيام`);
      }

      if (daysLeft === 2) {
        toast.warning(`⚠️ المهمة "${task.title}" باقي عليها يومين`);
      }

      if (daysLeft === 1) {
        toast.error(`🚨 المهمة "${task.title}" باقي عليها يوم واحد فقط!`);
      }

      if (daysLeft === 0) {
        toast.error(`🔥 آخر يوم لتسليم المهمة "${task.title}" هو اليوم!`);
      }
      localStorage.setItem(storageKey, todayKey);
    });
  }, [tasks]);

  return null;
}
