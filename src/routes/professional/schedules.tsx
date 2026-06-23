import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { getMyProfile } from "@/lib/api/professionals";
import { listWorkSchedules, replaceWorkSchedules } from "@/lib/api/workSchedule";
import type { ProfessionalDTO, WorkScheduleDTO } from "@/types/api";

export const Route = createFileRoute("/professional/schedules")({
  component: Schedules,
});

const DAYS = [
  { short: "Seg", full: "Segunda", letter: "S" },
  { short: "Ter", full: "Terça", letter: "T" },
  { short: "Qua", full: "Quarta", letter: "Q" },
  { short: "Qui", full: "Quinta", letter: "Q" },
  { short: "Sex", full: "Sexta", letter: "S" },
  { short: "Sáb", full: "Sábado", letter: "S" },
  { short: "Dom", full: "Domingo", letter: "D" },
];

interface DayEntry {
  weekday: number;
  is_active: boolean;
  start_time: string;
  end_time: string;
}

function toHHMM(t: string): string {
  return t.slice(0, 5);
}

function toHHMMSS(t: string): string {
  return t.length === 5 ? `${t}:00` : t;
}

function buildDefaultEntries(): DayEntry[] {
  return DAYS.map((_, weekday) => ({
    weekday,
    is_active: false,
    start_time: "09:00",
    end_time: "18:00",
  }));
}

function mergeWithDefaults(apiData: WorkScheduleDTO[]): DayEntry[] {
  const base = buildDefaultEntries();
  for (const s of apiData) {
    base[s.weekday] = {
      weekday: s.weekday,
      is_active: s.is_active,
      start_time: toHHMM(s.start_time),
      end_time: toHHMM(s.end_time),
    };
  }
  return base;
}

function hoursActive(entry: DayEntry): number {
  const [sh, sm] = entry.start_time.split(":").map(Number);
  const [eh, em] = entry.end_time.split(":").map(Number);
  return Math.max(0, (eh * 60 + em - (sh * 60 + sm)) / 60);
}

function formatHours(h: number): string {
  return h % 1 === 0 ? `${h}h` : `${h.toFixed(1)}h`;
}

function Schedules() {
  const [profile, setProfile] = useState<ProfessionalDTO | null>(null);
  const [entries, setEntries] = useState<DayEntry[]>(buildDefaultEntries());
  const [savedEntries, setSavedEntries] = useState<DayEntry[]>(buildDefaultEntries());
  const [profileLoading, setProfileLoading] = useState(true);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMyProfile()
      .then((data) => {
        setProfile(data);
      })
      .catch(() => setError("Não foi possível carregar o perfil."))
      .finally(() => setProfileLoading(false));
  }, []);

  useEffect(() => {
    if (!profile?.id) return;
    setScheduleLoading(true);
    setError(null);
    listWorkSchedules(profile.id)
      .then((data) => {
        const merged = mergeWithDefaults(data);
        setEntries(merged);
        setSavedEntries(merged);
      })
      .catch(() => setError("Não foi possível carregar os horários."))
      .finally(() => setScheduleLoading(false));
  }, [profile?.id]);

  function updateEntry(weekday: number, patch: Partial<DayEntry>) {
    setEntries((prev) => prev.map((e) => (e.weekday === weekday ? { ...e, ...patch } : e)));
  }

  function handleDiscard() {
    setEntries(savedEntries);
    setError(null);
  }

  async function handleSave() {
    if (!profile?.id) return;
    setSaving(true);
    setError(null);
    try {
      const payload = entries.map((e) => ({
        weekday: e.weekday,
        start_time: toHHMMSS(e.start_time),
        end_time: toHHMMSS(e.end_time),
        is_active: e.is_active,
      }));
      await replaceWorkSchedules(profile.id, payload);
      setSavedEntries(entries);
    } catch {
      setError("Erro ao salvar horários. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  const activeDaysCount = entries.filter((e) => e.is_active).length;

  if (profileLoading) {
    return (
      <main className="flex-1 p-4 md:p-8 flex items-center justify-center py-16">
        <div className="size-8 animate-spin rounded-full border-2 border-border border-t-primary" />
      </main>
    );
  }

  if (!profile?.store_id) {
    return (
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-2xl mx-auto rounded-2xl border border-border bg-card p-8 shadow-sm text-center">
          <p className="font-semibold text-foreground mb-1">Nenhum estabelecimento vinculado</p>
          <p className="text-sm text-muted-foreground">
            Você precisa estar vinculado a um estabelecimento para configurar horários.
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="flex-1 p-4 md:p-8 pb-28">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-semibold text-chart-3">Gestão</p>
              <h2 className="font-heading font-bold text-foreground text-2xl tracking-tight">
                Meus Horários
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Defina sua disponibilidade semanal
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted border border-salmon-100">
              <div className="size-2 rounded-full bg-chart-3" />
              <span className="text-xs font-semibold text-chart-3">
                {activeDaysCount} {activeDaysCount === 1 ? "dia configurado" : "dias configurados"}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl mb-6 bg-muted border border-salmon-100">
            <Info className="size-4 mt-0.5 shrink-0 text-chart-3" />
            <p className="text-xs text-chart-4">
              Estes horários definem quando você está disponível para receber agendamentos. Dias sem
              horário configurado não aparecem para os clientes.{" "}
              <strong>Alterações não afetam agendamentos já existentes.</strong>
            </p>
          </div>

          {scheduleLoading ? (
            <div className="flex justify-center py-12">
              <div className="size-8 animate-spin rounded-full border-2 border-border border-t-primary" />
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-6">
                {entries.map((entry) => {
                  const day = DAYS[entry.weekday];
                  const h = hoursActive(entry);
                  return (
                    <div
                      key={entry.weekday}
                      className={cn(
                        "bg-card rounded-2xl border p-4 transition-colors",
                        entry.is_active ? "border-input" : "border-border opacity-60",
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 w-28 shrink-0">
                          <button
                            type="button"
                            role="switch"
                            aria-checked={entry.is_active}
                            aria-label={`Ativar ${day.full}`}
                            onClick={() =>
                              updateEntry(entry.weekday, { is_active: !entry.is_active })
                            }
                            className={cn(
                              "relative w-11 h-6 rounded-full transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                              entry.is_active ? "bg-chart-3" : "bg-slate-200",
                            )}
                          >
                            <span
                              className={cn(
                                "absolute top-0.75 size-4.5 rounded-full bg-white shadow-sm transition-transform",
                                entry.is_active ? "-translate-x-5.75" : "translate-x-0.75",
                              )}
                            />
                          </button>
                          <div>
                            <p
                              className={cn(
                                "text-sm font-bold",
                                entry.is_active ? "text-foreground" : "text-muted-foreground",
                              )}
                            >
                              {day.short}
                            </p>
                            <p
                              className={cn(
                                "text-xs",
                                entry.is_active ? "text-muted-foreground" : "text-slate-300",
                              )}
                            >
                              {day.full}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="time"
                            value={entry.start_time}
                            disabled={!entry.is_active}
                            onChange={(e) =>
                              updateEntry(entry.weekday, { start_time: e.target.value })
                            }
                            className=" rounded-lg border border-input px-3 py-2 text-sm font-semibold text-foreground bg-white focus:border-primary focus:outline-none transition-colors disabled:bg-background disabled:text-muted-foreground disabled:cursor-not-allowed"
                          />
                          <span
                            className={cn(
                              "text-sm font-medium shrink-0",
                              entry.is_active ? "text-muted-foreground" : "text-slate-300",
                            )}
                          >
                            até
                          </span>
                          <input
                            type="time"
                            value={entry.end_time}
                            disabled={!entry.is_active}
                            onChange={(e) =>
                              updateEntry(entry.weekday, { end_time: e.target.value })
                            }
                            className="rounded-lg border border-input px-3 py-2 text-sm font-semibold text-foreground bg-white focus:border-primary focus:outline-none transition-colors disabled:bg-background disabled:text-muted-foreground disabled:cursor-not-allowed"
                          />
                        </div>

                        {entry.is_active ? (
                          <span className="hidden sm:inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-800 shrink-0">
                            {formatHours(h)} ativas
                          </span>
                        ) : (
                          <span className="hidden sm:inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground shrink-0">
                            Folga
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {error && <p className="mt-4 text-sm text-destructive text-center">{error}</p>}
            </>
          )}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 md:left-56 right-0 z-20 px-4 md:px-8 py-4 flex items-center justify-between gap-3 bg-white border-t border-border">
        <button
          type="button"
          onClick={handleDiscard}
          disabled={saving}
          className="px-6 py-3 rounded-xl text-sm font-semibold text-muted-foreground bg-white border border-input hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Descartar alterações
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || scheduleLoading}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-linear-to-br from-chart-3 to-primary shadow-[0_3px_14px_rgba(224,80,64,0.28)] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(224,80,64,0.38)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {saving ? "Salvando…" : "Salvar horários"}
        </button>
      </div>
    </>
  );
}
