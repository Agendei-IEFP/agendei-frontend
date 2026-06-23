import { useState, useMemo, useRef } from "react";
import { cn, localTimezoneOffset } from "@/lib/utils";
import type { WorkScheduleDTO } from "@/types/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const WEEKDAYS_SHORT = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const WEEKDAYS_FULL = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

const SLOT_MINUTES = 15 as const;
const GRANULARITIES = [15, 30, 60] as const;
type Granularity = (typeof GRANULARITIES)[number];

const START_HOURS = [5, 6, 7, 8] as const;
const END_HOURS = [20, 21, 22, 23, 24] as const;

function buildSlots(startHour: number, endHour: number): string[] {
  const slots: string[] = [];
  let total = startHour * 60;
  const end = endHour * 60;
  while (total < end) {
    const h = Math.floor(total / 60);
    const m = total % 60;
    slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    total += SLOT_MINUTES;
  }
  return slots;
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function schedulesToGrid(schedules: WorkScheduleDTO[], slots: string[]): boolean[][] {
  const grid: boolean[][] = Array.from({ length: 7 }, () => Array(slots.length).fill(false));
  for (const s of schedules) {
    if (!s.is_active) continue;
    const startTotal = timeToMinutes(s.start_time);
    const endTotal = timeToMinutes(s.end_time);
    slots.forEach((slot, i) => {
      const slotStart = timeToMinutes(slot);
      const slotEnd = slotStart + SLOT_MINUTES;
      if (slotStart >= startTotal && slotEnd <= endTotal) {
        grid[s.weekday][i] = true;
      }
    });
  }
  return grid;
}

function gridToScheduleBlocks(
  grid: boolean[][],
  slots: string[],
): { weekday: number; start_time: string; end_time: string }[] {
  const tz = localTimezoneOffset();
  const blocks: { weekday: number; start_time: string; end_time: string }[] = [];
  for (let day = 0; day < 7; day++) {
    let i = 0;
    while (i < slots.length) {
      if (!grid[day][i]) {
        i++;
        continue;
      }
      const start = slots[i];
      while (i < slots.length && grid[day][i]) i++;
      const endMinutes = timeToMinutes(slots[i - 1]) + SLOT_MINUTES;
      const endH = Math.floor(endMinutes / 60) % 24;
      const endM = endMinutes % 60;
      const endTime =
        endMinutes >= 24 * 60
          ? "00:00:00"
          : `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}:00`;
      blocks.push({ weekday: day, start_time: `${start}:00${tz}`, end_time: `${endTime}${tz}` });
    }
  }
  return blocks;
}

function defaultGrid(slots: string[]): boolean[][] {
  const grid: boolean[][] = Array.from({ length: 7 }, () => Array(slots.length).fill(false));
  for (let day = 0; day < 5; day++) {
    slots.forEach((slot, i) => {
      const m = timeToMinutes(slot);
      const slotEnd = m + SLOT_MINUTES;
      if ((m >= 540 && slotEnd <= 720) || (m >= 780 && slotEnd <= 1080)) {
        grid[day][i] = true;
      }
    });
  }
  return grid;
}

function labelForBlock(
  blockIdx: number,
  n: number,
  startHour: number,
  granularity: Granularity,
): string | null {
  const slotStart = blockIdx * n;
  const totalMin = startHour * 60 + slotStart * SLOT_MINUTES;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (granularity === 30) {
    if (m === 0) return `${h}h`;
    if (m === 30) return `${h}:30`;
    return null;
  }

  return m === 0 ? `${h}h` : null;
}

function slotsPerBlock(granularity: Granularity): number {
  return granularity / SLOT_MINUTES;
}

export interface WeeklyScheduleGridProps {
  schedules: WorkScheduleDTO[];
  isSaving?: boolean;
  onSave: (blocks: { weekday: number; start_time: string; end_time: string }[]) => Promise<void>;
  saveLabel?: string;
}

interface GridEditorProps {
  initialGrid: boolean[][];
  slots: string[];
  granularity: Granularity;
  isSaving: boolean;
  onSave: WeeklyScheduleGridProps["onSave"];
  saveLabel: string;
}

function GridEditor({
  initialGrid,
  slots,
  granularity,
  isSaving,
  onSave,
  saveLabel,
}: GridEditorProps) {
  const [grid, setGrid] = useState<boolean[][]>(initialGrid);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingBlocks, setPendingBlocks] = useState<
    { weekday: number; start_time: string; end_time: string }[]
  >([]);
  const dragging = useRef(false);
  const paintMode = useRef(true);
  const n = slotsPerBlock(granularity);
  const blockCount = Math.ceil(slots.length / n);
  const startHour = slots.length > 0 ? Math.floor(timeToMinutes(slots[0]) / 60) : 0;

  const blockHeightStyle = `clamp(${granularity === 15 ? 6 : granularity === 30 ? 10 : 18}px, ${granularity === 15 ? 1 : granularity === 30 ? 1.6 : 2.8}vh, ${granularity === 15 ? 12 : granularity === 30 ? 18 : 30}px)`;

  function applyBlock(day: number, blockIdx: number, mode: boolean) {
    setGrid((prev) => {
      const next = prev.map((row) => [...row]);
      const start = blockIdx * n;
      const end = Math.min(start + n, slots.length);
      let changed = false;
      for (let i = start; i < end; i++) {
        if (next[day][i] !== mode) {
          next[day][i] = mode;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }

  function blockIdxFromY(e: React.PointerEvent<HTMLDivElement>): number {
    const rect = e.currentTarget.getBoundingClientRect();
    const blockHeight = rect.height / blockCount;
    return Math.min(blockCount - 1, Math.max(0, Math.floor((e.clientY - rect.top) / blockHeight)));
  }

  function handleColumnPointerDown(day: number, e: React.PointerEvent<HTMLDivElement>) {
    e.preventDefault();
    const blockIdx = blockIdxFromY(e);
    const firstSlot = blockIdx * n;
    paintMode.current = !grid[day][firstSlot];
    dragging.current = true;
    applyBlock(day, blockIdx, paintMode.current);
  }

  function handleColumnPointerMove(day: number, e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    applyBlock(day, blockIdxFromY(e), paintMode.current);
  }

  function handlePointerUp() {
    dragging.current = false;
  }

  function handleSaveClick() {
    const blocks = gridToScheduleBlocks(grid, slots);
    setPendingBlocks(blocks);
    setConfirmOpen(true);
  }

  const blocksByDay = useMemo(() => {
    const byDay: Record<number, string[]> = {};
    for (const b of pendingBlocks) {
      const start = b.start_time.slice(0, 5);
      const end = b.end_time.startsWith("00:00:00") ? "24:00" : b.end_time.slice(0, 5);
      if (!byDay[b.weekday]) byDay[b.weekday] = [];
      byDay[b.weekday].push(`${start} – ${end}`);
    }
    return Object.entries(byDay).sort(([a], [b]) => Number(a) - Number(b));
  }, [pendingBlocks]);

  return (
    <>
      <div className="rounded-sm sm:rounded-2xl sm:border sm:border-border sm:bg-card shadow-sm overflow-hidden">
        <div className="overflow-y-auto overflow-x-auto max-h-[70vh]">
          <div className="flex p-1 sm:p-2 md:p-4 min-w-75" style={{ touchAction: "none" }}>
            <div className="w-10 shrink-0 select-none flex flex-col" aria-hidden>
              <div className="pb-0.5 text-xs invisible select-none">X</div>
              {Array.from({ length: blockCount }, (_, blockIdx) => {
                const label = labelForBlock(blockIdx, n, startHour, granularity);
                return (
                  <div
                    key={blockIdx}
                    className="relative flex items-start justify-end pr-1"
                    style={{ height: blockHeightStyle }}
                  >
                    {label && (
                      <span className="absolute right-1 top-0 text-[10px] text-muted-foreground tabular-nums leading-none -translate-y-1/2">
                        {label}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex-1 grid grid-cols-7 gap-1">
              {WEEKDAYS_SHORT.map((dayLabel, day) => (
                <div key={day} className="flex flex-col gap-1">
                  <div className="text-center text-xs font-medium text-foreground pb-0.5">
                    {dayLabel}
                  </div>

                  <div
                    className="flex-1 flex flex-col cursor-crosshair select-none rounded-md overflow-hidden"
                    onPointerDown={(e) => handleColumnPointerDown(day, e)}
                    onPointerMove={(e) => handleColumnPointerMove(day, e)}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    aria-label={`Horário de ${dayLabel}`}
                  >
                    {Array.from({ length: blockCount }, (_, blockIdx) => {
                      const firstSlot = blockIdx * n;
                      const active = grid[day].slice(firstSlot, firstSlot + n).some(Boolean);
                      const prevActive =
                        blockIdx > 0 &&
                        grid[day].slice((blockIdx - 1) * n, blockIdx * n).some(Boolean);
                      const nextActive =
                        blockIdx < blockCount - 1 &&
                        grid[day].slice((blockIdx + 1) * n, (blockIdx + 2) * n).some(Boolean);
                      const isFirst = active && !prevActive;
                      const isLast = active && !nextActive;

                      return (
                        <div
                          key={blockIdx}
                          className={cn(
                            "w-full pointer-events-none transition-colors",
                            active
                              ? "bg-chart-3/30 border-x border-chart-3/60"
                              : "bg-muted border-x border-border",
                            blockIdx === 0 || isFirst || (!active && !prevActive)
                              ? "border-t"
                              : active && prevActive
                                ? "border-t-0"
                                : "border-t",
                            blockIdx === blockCount - 1 || isLast || (!active && !nextActive)
                              ? "border-b"
                              : active && nextActive
                                ? "border-b-0"
                                : "border-b",
                            isFirst || (blockIdx === 0 && active) ? "rounded-t-md" : "",
                            isLast || (blockIdx === blockCount - 1 && active) ? "rounded-b-md" : "",
                          )}
                          style={{ height: blockHeightStyle }}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSaveClick}
          disabled={isSaving}
          className="rounded-xl px-5 py-2 text-sm font-medium text-white bg-linear-to-br from-chart-3 to-primary shadow-[0_3px_14px_rgba(224,80,64,0.28)] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(224,80,64,0.38)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSaving ? "Salvando…" : saveLabel}
        </button>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar horários</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-1 text-sm text-muted-foreground">
                {blocksByDay.length === 0 ? (
                  <p>Nenhum horário selecionado. Confirmar irá limpar todos os horários salvos.</p>
                ) : (
                  <>
                    <p className="mb-3">Os seguintes horários serão salvos:</p>
                    {blocksByDay.map(([day, ranges]) => (
                      <div key={day} className="flex gap-2">
                        <span className="font-medium text-foreground w-16 shrink-0">
                          {WEEKDAYS_FULL[Number(day)]}
                        </span>
                        <span>{ranges.join(", ")}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              type="button"
              onClick={() => setConfirmOpen(false)}
              className="px-4 py-2 rounded-lg text-sm text-muted-foreground border border-border hover:bg-muted transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={async () => {
                setConfirmOpen(false);
                await onSave(pendingBlocks);
              }}
              className="rounded-xl px-5 py-2 text-sm font-medium text-white bg-linear-to-br from-chart-3 to-primary shadow-[0_3px_14px_rgba(224,80,64,0.28)] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(224,80,64,0.38)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Confirmar
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function WeeklyScheduleGrid({
  schedules,
  isSaving = false,
  onSave,
  saveLabel = "Salvar alterações",
}: WeeklyScheduleGridProps) {
  const [granularity, setGranularity] = useState<Granularity>(30);
  const [startHour, setStartHour] = useState<number>(7);
  const [endHour, setEndHour] = useState<number>(24);

  const slots = useMemo(() => buildSlots(startHour, endHour), [startHour, endHour]);

  const initialGrid = useMemo(
    () => (schedules.length === 0 ? defaultGrid(slots) : schedulesToGrid(schedules, slots)),
    [schedules, slots],
  );

  const editorKey = useMemo(
    () => `${schedules.map((s) => s.id).join(",")}-${startHour}-${endHour}-${granularity}`,
    [schedules, startHour, endHour, granularity],
  );

  const selectClass =
    "rounded-md border border-input bg-white px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3 items-center">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          Bloco:
          <select
            value={granularity}
            onChange={(e) => setGranularity(Number(e.target.value) as Granularity)}
            className={selectClass}
          >
            {GRANULARITIES.map((g) => (
              <option key={g} value={g}>
                {g >= 60 ? "1h" : `${g} min`}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          De:
          <select
            value={startHour}
            onChange={(e) => setStartHour(Number(e.target.value))}
            className={selectClass}
          >
            {START_HOURS.map((h) => (
              <option key={h} value={h} disabled={h >= endHour}>
                {String(h).padStart(2, "0")}h
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          Até:
          <select
            value={endHour}
            onChange={(e) => setEndHour(Number(e.target.value))}
            className={selectClass}
          >
            {END_HOURS.map((h) => (
              <option key={h} value={h} disabled={h <= startHour}>
                {h === 24 ? "24h" : `${String(h).padStart(2, "0")}h`}
              </option>
            ))}
          </select>
        </label>
      </div>

      <GridEditor
        key={editorKey}
        initialGrid={initialGrid}
        slots={slots}
        granularity={granularity}
        isSaving={isSaving}
        onSave={onSave}
        saveLabel={saveLabel}
      />
    </div>
  );
}
