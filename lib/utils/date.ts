import { Timestamp } from "firebase/firestore";

export function toDate(value: Date | Timestamp | undefined | null): Date {
  if (!value) return new Date();
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  return new Date(value);
}

export function formatDate(date: Date | Timestamp | undefined | null, locale = "ar-EG"): string {
  return toDate(date).toLocaleDateString(locale);
}
