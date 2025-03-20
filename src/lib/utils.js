import { clsx } from "clsx";
import { jwtDecode } from "jwt-decode";
import { lazy } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function lazyWithPreload(factory) {
  const Component = lazy(factory);
  Component.preload = factory;
  return Component;
}

export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
export const handleError = (error) => {
  console.log("API Error:", error);

  if (!error) return "An unknown error occurred.";

  if (error.status === 401) {
    return error.data?.messages?.Credentials?.[0] || "Unauthorized access.";
  }

  if (error.status === 403) {
    return "You don't have permission to perform this action.";
  }

  if (error.status === 500) {
    return "Internal server error. Please try again later.";
  }

  return error.data?.messages || "Something went wrong. Please try again.";
};

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};
export const formatTime = (time) => {
  return time.includes(":") && time.split(":").length === 2
    ? `${time}:00`
    : time;
};
export const formatSchedule = (date) => {
  const date1 = new Date(date);
  const options = {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  const formattedDate = date1.toLocaleString("en-US", options);
  return formattedDate;
};

export const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-500";
    case "pending":
      return "bg-pink-500";
    case "cancelled":
      return "bg-red-500";
    case "in_progress":
      return "bg-blue-500";
    default:
      return "bg-gray-500";
  }
};

export const getStatusBadgeVariant = (status) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "success";
    case "pending":
      return "secondary";
    case "cancelled":
      return "destructive";
    case "in_progress":
      return "default";
    default:
      return "secondary";
  }
};
