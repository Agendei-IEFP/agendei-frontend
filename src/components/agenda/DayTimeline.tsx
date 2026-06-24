import { Coffee, PlusCircle } from "lucide-react";
import { AppointmentBlock } from "./AppointmentBlock";
import {
  buildTimeline,
  formatTime,
  minutesToTime,
  isToday,
  toLocal,
  toMinutes,
  type WorkBlock,
} from "@/lib/agenda";
import { formatDuration } from "@/lib/format";
import type { AppointmentDTO } from "@/types/api";

interface DayTimelineProps {
  day: Date;
  appointments: AppointmentDTO[];
  workBlocks?: WorkBlock[];
  onAppointmentClick?: (appt: AppointmentDTO) => void;
}

export function DayTimeline({
  day,
  appointments,
  workBlocks = [],
  onAppointmentClick,
}: DayTimelineProps) {
  const items = buildTimeline(appointments, workBlocks);
  const showNowLine = isToday(day);
  const now = new Date();
  const nowMinutes = toMinutes(now);

  const workEndMinutes =
    workBlocks.length > 0 ? Math.max(...workBlocks.map((b) => b.endMinutes)) : null;

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-sm font-semibold text-foreground mb-1">Dia sem agendamentos</p>
        <p className="text-xs text-muted-foreground">Nenhum agendamento neste dia.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, idx) => {
        if (item.type === "interval") {
          return (
            <div key={`interval-${idx}`} className="flex gap-3 items-stretch">
              <div className="w-10 shrink-0 pt-2.5 text-right">
                <span className="text-[0.6rem] font-medium text-muted-foreground/40">
                  {minutesToTime(item.startMinutes)}
                </span>
              </div>
              <div className="flex-1 border border-dashed border-border bg-muted/40 rounded-xl px-3 py-2 flex items-center gap-2">
                <Coffee className="size-3.5 text-muted-foreground/50 shrink-0" />
                <span className="text-xs text-muted-foreground/60">
                  Intervalo · {formatDuration(item.durationMinutes)}
                </span>
              </div>
            </div>
          );
        }

        if (item.type === "free") {
          const startTime = minutesToTime(item.startMinutes);
          const endTime = minutesToTime(item.endMinutes);

          const showNowBefore = showNowLine && idx === 0 && nowMinutes < item.startMinutes;

          return (
            <div key={`free-${idx}`}>
              {showNowBefore && <NowLine now={now} />}
              <div className="flex gap-3 items-stretch">
                <div className="w-10 shrink-0 pt-2.5 text-right">
                  <span className="text-[0.6rem] font-medium text-muted-foreground/60">
                    {startTime}
                  </span>
                </div>
                <div className="flex-1 border-2 border-dashed border-green-200 bg-green-50 rounded-xl px-3 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PlusCircle className="size-3.5 text-green-500 shrink-0" />
                    <span className="text-xs font-bold text-green-700">
                      {formatDuration(item.durationMinutes)} livre
                    </span>
                  </div>
                  <span className="text-[0.65rem] text-green-400 font-medium">
                    {startTime}–{endTime}
                  </span>
                </div>
              </div>
            </div>
          );
        }

        const appt = item.appointment;
        const apptStart = toLocal(appt.starts_at);
        const apptStartMin = toMinutes(apptStart);
        const startTime = formatTime(apptStart);

        const prevItem = idx > 0 ? items[idx - 1] : null;
        const prevEndMin =
          prevItem?.type === "appointment"
            ? toMinutes(toLocal(prevItem.appointment.ends_at))
            : prevItem?.type === "free"
              ? prevItem.endMinutes
              : null;

        const showNowBefore = showNowLine && idx === 0 && nowMinutes < apptStartMin;

        const showNowBetween =
          showNowLine &&
          prevEndMin !== null &&
          nowMinutes >= prevEndMin &&
          nowMinutes < apptStartMin;

        return (
          <div key={appt.id}>
            {(showNowBefore || showNowBetween) && <NowLine now={now} />}
            <div className="flex gap-3 items-stretch">
              <div className="w-10 shrink-0 pt-2.5 text-right">
                <span className="text-[0.6rem] font-medium text-muted-foreground/60">
                  {startTime}
                </span>
              </div>
              <AppointmentBlock
                appointment={appt}
                className="flex-1"
                onClick={onAppointmentClick ? () => onAppointmentClick(appt) : undefined}
              />
            </div>
          </div>
        );
      })}

      {showNowLine &&
        (() => {
          const last = items[items.length - 1];
          const lastEndMin =
            last.type === "appointment"
              ? toMinutes(toLocal(last.appointment.ends_at))
              : last.type === "free" || last.type === "interval"
                ? last.endMinutes
                : 0;
          return nowMinutes >= lastEndMin ? <NowLine now={now} /> : null;
        })()}

      {workEndMinutes !== null && (
        <div className="flex items-center gap-3 py-1 mt-1">
          <div className="flex-1 h-px bg-border" />
          <p className="text-[0.65rem] text-muted-foreground/50 font-medium shrink-0">
            Fim do expediente · {minutesToTime(workEndMinutes)}
          </p>
          <div className="flex-1 h-px bg-border" />
        </div>
      )}
    </div>
  );
}

function NowLine({ now }: { now: Date }) {
  const timeStr = formatTime(now);
  return (
    <div className="flex items-center gap-2 my-1 pl-13">
      <div className="size-2 rounded-full bg-red-500 shrink-0" />
      <div className="flex-1 h-px bg-red-400" />
      <span className="text-[0.6rem] font-bold text-red-500 shrink-0">{timeStr}</span>
    </div>
  );
}
