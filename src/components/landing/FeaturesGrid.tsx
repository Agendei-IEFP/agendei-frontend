import { useEffect, useRef } from "react";
import { Calendar, Clock, Mail, Users, ShieldCheck, FileText } from "lucide-react";

const FEATURES = [
  {
    icon: Calendar,
    iconBg: "bg-muted",
    iconColor: "text-chart-3",
    title: "Agendamento online",
    desc: "Seus clientes escolhem serviço, profissional e horário em 3 passos. Sem ligações, sem vai-e-vem no WhatsApp.",
    delay: "reveal-d1",
  },
  {
    icon: Clock,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    title: "Horários inteligentes",
    desc: "Os slots disponíveis são calculados automaticamente. Nenhum cliente vê um horário que já está ocupado.",
    delay: "reveal-d2",
  },
  {
    icon: Mail,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    title: "Notificações automáticas",
    desc: "Confirmação imediata e lembrete 24h antes por email. Menos no-shows — sem você precisar lembrar ninguém.",
    delay: "reveal-d3",
  },
  {
    icon: Users,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-500",
    title: "Gestão de equipa",
    desc: "Você adiciona os profissionais, eles gerenciam os próprios horários e serviços. Controle total sem microgestão.",
    delay: "reveal-d1",
  },
  {
    icon: ShieldCheck,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    title: "Sem conflitos de horário",
    desc: "Se dois clientes tentam o mesmo slot ao mesmo tempo, só um confirma. Proteção automática, sempre.",
    delay: "reveal-d2",
  },
  {
    icon: FileText,
    iconBg: "bg-muted",
    iconColor: "text-chart-3",
    title: "Conformidade RGPD",
    desc: "Clientes podem pedir eliminação dos dados. Anonimização automática — sem perder o histórico da sua loja.",
    delay: "reveal-d3",
  },
];

export function FeaturesGrid() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.12 },
    );
    ref.current?.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="funcionalidades" className="py-24 px-6">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <div className="text-center mb-16 reveal">
          <div className="section-badge">Funcionalidades</div>
          <h2 className="font-display font-black text-slate-900 mb-4 text-[clamp(2rem,4vw,2.6rem)] tracking-tight">
            Tudo que seu salão precisa,
            <br />
            sem o que não precisa
          </h2>
          <p className="text-slate-500 max-w-lg mx-auto">
            Sem app instalado, sem planilha, sem caderno. Gerencie tudo numa única plataforma.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, iconBg, iconColor, title, desc, delay }) => (
            <div key={title} className={`feature-card card-hover-landing reveal ${delay}`}>
              <div
                className={`size-11 rounded-xl flex items-center justify-center mb-4 ${iconBg}`}
              >
                <Icon className={`size-5 ${iconColor}`} />
              </div>
              <h3 className="font-display font-bold text-slate-900 mb-2 text-lg tracking-tight">
                {title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
