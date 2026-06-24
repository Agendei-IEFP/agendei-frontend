import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useMyProfessionalAppointments } from "@/hooks/useAppointments";
import { useMyProfile } from "@/hooks/useServices";
import { listWorkSchedules } from "@/lib/api/workSchedule";
import { WeekStrip } from "@/components/agenda/WeekStrip";
import { DayTimeline } from "@/components/agenda/DayTimeline";
import { AppointmentDetailModal } from "@/components/agenda/AppointmentDetailModal";
import type { AppointmentDTO } from "@/types/api";
import {
  getWeekStart,
  getWeekDays,
  appointmentsForDay,
  freeHours,
  isToday,
  isPastDay,
  toWeekdayIndex,
  timeToMinutes,
  type WorkBlock,
} from "@/lib/agenda";

export const Route = createFileRoute("/professional/agenda")({
  component: Agenda,
});

const MONTH_LABELS = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

function Agenda() {
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentDTO | null>(null);

  const { data: profile } = useMyProfile();
  const { data: appointments = [], isLoading } = useMyProfessionalAppointments();
  const { data: workSchedules = [] } = useQuery({
    queryKey: ["schedules", profile?.id],
    queryFn: () => listWorkSchedules(profile?.id ?? ""),
    enabled: !!profile?.id,
  });

  const weekStart = getWeekStart(selectedDay);
  const weekDays = getWeekDays(weekStart);
  const weekEnd = weekDays[6];

  const workBlocksByWeekday: WorkBlock[][] = Array.from({ length: 7 }, (_, wd) =>
    workSchedules
      .filter((a) => a.weekday === wd && a.is_active)
      .map((a) => ({
        startMinutes: timeToMinutes(a.start_time),
        endMinutes: timeToMinutes(a.end_time),
      }))
      .sort((a, b) => a.startMinutes - b.startMinutes),
  );

  const weekday = toWeekdayIndex(selectedDay);
  const dayWorkBlocks = workBlocksByWeekday[weekday];

  const filteredAppointments = appointments;

  const dayAppointments = appointmentsForDay(filteredAppointments, selectedDay);
  const freeH = freeHours(dayAppointments, dayWorkBlocks);
  const today = isToday(selectedDay);
  const past = isPastDay(selectedDay);

  function shiftWeek(direction: 1 | -1) {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + direction * 7);
    setSelectedDay(d);
  }

  const weekLabel = `${weekStart.getDate()} – ${weekEnd.getDate()} de ${MONTH_LABELS[weekEnd.getMonth()]}, ${weekEnd.getFullYear()}`;

  const dayLabel = selectedDay.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <>
      <main className="flex-1 p-4 md:p-6 max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-between gap-2 mb-3">
          <button
            onClick={() => shiftWeek(-1)}
            className="size-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted border border-border transition-colors"
          >
            <ChevronLeft className="size-4" />
          </button>
          <p className="text-xs font-semibold text-muted-foreground">{weekLabel}</p>
          <button
            onClick={() => shiftWeek(1)}
            className="size-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted border border-border transition-colors"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        <div className="bg-card border border-border rounded-xl p-3 mb-4">
          <WeekStrip
            weekDays={weekDays}
            selectedDay={selectedDay}
            appointments={filteredAppointments}
            onSelectDay={setSelectedDay}
            workBlocksByWeekday={workBlocksByWeekday}
          />
        </div>

        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-foreground capitalize">
            {dayLabel}
            {today && <span className="text-chart-3"> · Hoje</span>}
          </p>
          {!past && freeH > 0 && (
            <span className="text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
              ~{freeH}h livres
            </span>
          )}
          {past && (
            <span className="text-xs font-semibold text-muted-foreground/50 bg-muted px-2.5 py-1 rounded-full">
              Encerrado
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="size-7 animate-spin rounded-full border-2 border-border border-t-primary" />
          </div>
        ) : (
          <DayTimeline
            day={selectedDay}
            appointments={dayAppointments}
            workBlocks={dayWorkBlocks}
            onAppointmentClick={setSelectedAppointment}
          />
        )}
      </main>

      <AppointmentDetailModal
        appointment={selectedAppointment}
        onOpenChange={(open) => !open && setSelectedAppointment(null)}
      />
    </>
  );
}
