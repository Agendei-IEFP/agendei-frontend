import { useRevealAnimation } from "@/components/landing/useRevealAnimation";

const STATS = [
  { value: "0", label: "Conflitos de horário" },
  { value: "24/7", label: "Agendamentos sem você responder" },
  { value: "-50%", label: "No-shows com lembretes automáticos" },
  { value: "5 min", label: "Para configurar e começar" },
];

export function StatsBar() {
  const ref = useRevealAnimation<HTMLElement>();

  return (
    <section ref={ref} className="py-10 px-6 border-y border-border bg-background">
      <div className="max-w-4xl mx-auto">
        <p className="text-center text-xs font-bold uppercase tracking-widest mb-5 md:mb-8 text-muted-warm">
          O que muda quando você usa o Agendei
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
          {STATS.map(({ value, label }, i) => (
            <div key={label} className={`reveal reveal-d${i + 1}`}>
              <p className="text-3xl md:text-4xl font-heading font-black text-chart-3">{value}</p>
              <p className="text-sm text-slate-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
