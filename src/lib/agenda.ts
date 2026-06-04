import type { AppointmentDTO } from "@/types/api";
import { AppointmentStatus } from "@/types/enums";

// ── Work window fallback (used when no schedule data available) ────────────
const WORK_START_H = 9;
const WORK_END_H = 18;
export const WORK_START_MINUTES = WORK_START_H * 60;
export const WORK_END_MINUTES = WORK_END_H * 60;
const WORK_TOTAL_MINUTES = WORK_END_MINUTES - WORK_START_MINUTES;
const MIN_FREE_SLOT_MINUTES = 15;

// ── Work block ─────────────────────────────────────────────────────────────

export interface WorkBlock {
  startMinutes: number;
  endMinutes: number;
}

/** "HH:MM:SS" or "HH:MM" → minutes from midnight */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

// ── Date helpers ───────────────────────────────────────────────────────────

export function toLocal(iso: string): Date {
  return new Date(iso);
}

export function toMinutes(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

/** Monday of the week containing `date` */
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

/** Array of 7 dates (Mon–Sun) for the week starting at `weekStart` */
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

// ── Weekday index ──────────────────────────────────────────────────────────

/** Returns 0=Mon … 6=Sun from a Date (JS getDay returns 0=Sun) */
export function toWeekdayIndex(date: Date): number {
  const d = date.getDay();
  return d === 0 ? 6 : d - 1;
}

// ── Filtering ──────────────────────────────────────────────────────────────

export function appointmentsForDay(appointments: AppointmentDTO[], day: Date): AppointmentDTO[] {
  return appointments
    .filter((a) => isSameDay(toLocal(a.starts_at), day))
    .sort((a, b) => toLocal(a.starts_at).getTime() - toLocal(b.starts_at).getTime());
}

// ── Occupancy ──────────────────────────────────────────────────────────────

/** % of work shift occupied by non-cancelled appointments (0–100) */
export function occupancyPercent(appointments: AppointmentDTO[], workBlocks?: WorkBlock[]): number {
  const totalWorkMinutes =
    workBlocks && workBlocks.length > 0
      ? workBlocks.reduce((sum, b) => sum + (b.endMinutes - b.startMinutes), 0)
      : WORK_TOTAL_MINUTES;

  const totalMin = appointments
    .filter((a) => a.status !== AppointmentStatus.cancelled)
    .reduce((sum, a) => {
      const dur = (toLocal(a.ends_at).getTime() - toLocal(a.starts_at).getTime()) / 60_000;
      return sum + dur;
    }, 0);
  return Math.min(100, Math.round((totalMin / totalWorkMinutes) * 100));
}

/** Free hours in the day (non-cancelled appointments deducted from shift) */
export function freeHours(appointments: AppointmentDTO[], workBlocks?: WorkBlock[]): number {
  const totalWorkMinutes =
    workBlocks && workBlocks.length > 0
      ? workBlocks.reduce((sum, b) => sum + (b.endMinutes - b.startMinutes), 0)
      : WORK_TOTAL_MINUTES;

  const occupiedMin = appointments
    .filter((a) => a.status !== AppointmentStatus.cancelled)
    .reduce((sum, a) => {
      const dur = (toLocal(a.ends_at).getTime() - toLocal(a.starts_at).getTime()) / 60_000;
      return sum + dur;
    }, 0);
  return Math.max(0, Math.round((totalWorkMinutes - occupiedMin) / 60));
}

// ── Timeline builder ───────────────────────────────────────────────────────

export interface FreeSlotItem {
  type: "free";
  startMinutes: number;
  endMinutes: number;
  durationMinutes: number;
}

export interface AppointmentItem {
  type: "appointment";
  appointment: AppointmentDTO;
}

/** Gap between work blocks from different stores/shifts */
export interface IntervalItem {
  type: "interval";
  startMinutes: number;
  endMinutes: number;
  durationMinutes: number;
}

export type TimelineItem = FreeSlotItem | AppointmentItem | IntervalItem;

/**
 * Builds the timeline item sequence for a day.
 * When workBlocks are provided, free slots appear only within blocks and
 * gaps between blocks render as IntervalItems (off-shift, not bookable).
 * When workBlocks is empty, only appointment items are returned.
 */
export function buildTimeline(
  appointments: AppointmentDTO[],
  workBlocks: WorkBlock[] = [],
): TimelineItem[] {
  const sorted = [...appointments].sort(
    (a, b) => toLocal(a.starts_at).getTime() - toLocal(b.starts_at).getTime(),
  );

  if (workBlocks.length === 0) {
    return sorted.map((appointment) => ({ type: "appointment", appointment }));
  }

  const sortedBlocks = [...workBlocks].sort((a, b) => a.startMinutes - b.startMinutes);
  const items: TimelineItem[] = [];

  for (let blockIdx = 0; blockIdx < sortedBlocks.length; blockIdx++) {
    const block = sortedBlocks[blockIdx];

    if (blockIdx > 0) {
      const prevBlock = sortedBlocks[blockIdx - 1];
      const gap = block.startMinutes - prevBlock.endMinutes;
      if (gap >= MIN_FREE_SLOT_MINUTES) {
        items.push({
          type: "interval",
          startMinutes: prevBlock.endMinutes,
          endMinutes: block.startMinutes,
          durationMinutes: gap,
        });
      }
    }

    const blockAppts = sorted.filter((a) => {
      const startMin = toMinutes(toLocal(a.starts_at));
      return startMin >= block.startMinutes && startMin < block.endMinutes;
    });

    let cursor = block.startMinutes;

    for (const appt of blockAppts) {
      const apptStart = toMinutes(toLocal(appt.starts_at));
      const apptEnd = toMinutes(toLocal(appt.ends_at));

      if (appt.status !== AppointmentStatus.cancelled) {
        const gap = apptStart - cursor;
        if (gap >= MIN_FREE_SLOT_MINUTES) {
          items.push({
            type: "free",
            startMinutes: cursor,
            endMinutes: apptStart,
            durationMinutes: gap,
          });
        }
        cursor = Math.max(cursor, apptEnd);
      }

      items.push({ type: "appointment", appointment: appt });
    }

    const trailingGap = block.endMinutes - cursor;
    if (trailingGap >= MIN_FREE_SLOT_MINUTES) {
      items.push({
        type: "free",
        startMinutes: cursor,
        endMinutes: block.endMinutes,
        durationMinutes: trailingGap,
      });
    }
  }

  return items;
}

// ── Formatting ─────────────────────────────────────────────────────────────

/** "HH:MM" from minutes since midnight */
export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Duration in minutes as "Xh Ymin", "Xh", or "X min" */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}min`;
}

/** Date to "HH:MM" in local timezone */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
