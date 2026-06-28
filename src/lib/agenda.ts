import type { AppointmentDTO } from "@/types/api";

export function toLocal(iso: string): Date {
  return new Date(iso);
}

export function toMinutes(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

export function getWeekDays(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function isPastDay(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d < today;
}

export function toWeekdayIndex(date: Date): number {
  const d = date.getDay();
  return d === 0 ? 6 : d - 1;
}

export function appointmentsForDay(appointments: AppointmentDTO[], day: Date): AppointmentDTO[] {
  return appointments
    .filter((a) => isSameDay(toLocal(a.starts_at), day))
    .sort((a, b) => toLocal(a.starts_at).getTime() - toLocal(b.starts_at).getTime());
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("pt-pt", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
