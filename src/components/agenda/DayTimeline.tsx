import { AppointmentBlock } from "./AppointmentBlock";
import { formatTime, isToday, toLocal, toMinutes } from "@/lib/agenda";
import type { AppointmentDTO } from "@/types/api";

interface DayTimelineProps {
  day: Date;
  appointments: AppointmentDTO[];
  onAppointmentClick?: (appt: AppointmentDTO) => void;
}

export function DayTimeline({ day, appointments, onAppointmentClick }: DayTimelineProps) {
  const showNowLine = isToday(day);
  const now = new Date();
  const nowMinutes = toMinutes(now);

  if (appointments.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Não existem agendamentos para o dia selecionado.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {appointments.map((appt, idx) => {
        const apptStart = toLocal(appt.starts_at);
        const apptStartMin = toMinutes(apptStart);
        const prevAppt = idx > 0 ? appointments[idx - 1] : null;
        const prevEndMin = prevAppt ? toMinutes(toLocal(prevAppt.ends_at)) : null;

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
                  {formatTime(apptStart)}
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
          const last = appointments[appointments.length - 1];
          const lastEndMin = toMinutes(toLocal(last.ends_at));
          return nowMinutes >= lastEndMin ? <NowLine now={now} /> : null;
        })()}
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
