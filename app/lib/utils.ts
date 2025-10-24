import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Converts a file size in bytes to a human-readable string.
 * @param bytes - The size in bytes.
 * @returns A formatted string like "12.3 KB", "4.56 MB", or "1.2 GB".
 */
export function formatSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = bytes / Math.pow(k, i);
  return `${size.toFixed(2)} ${sizes[i]}`;
}

export const generateUUID = () => crypto.randomUUID()

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}