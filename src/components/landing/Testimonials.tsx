import { useEffect, useRef } from "react";
import { Star } from "lucide-react";

function StarRating() {
  return (
    <div className="flex gap-0.5 mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

const TESTIMONIALS = [
  {
    text: "Antes eu passava o dia respondendo mensagens de WhatsApp para confirmar horários. Agora os clientes agendam sozinhos e eu só apareço para trabalhar.",
    initials: "JS",
    name: "João Silva",
    role: "Cabeleireiro · Studio Beleza",
    avatarCls: "avatar-letter-primary",
    delay: "reveal-d1",
  },
  {
    text: "O lembrete automático de email reduziu os no-shows do meu salão em mais da metade. Ninguém mais esquece o horário.",
    initials: "MC",
    name: "Maria Costa",
    role: "Dono · Espaço Bem-Estar",
    avatarCls: "bg-blue-100 text-blue-700",
    delay: "reveal-d2",
  },
  {
    text: "Configurei a loja em 5 minutos e no mesmo dia já tinha agendamentos online. Não precisei de ajuda de ninguém.",
    initials: "CR",
    name: "Carla Reis",
    role: "Manicure · Nail Studio",
    avatarCls: "bg-teal-100 text-teal-700",
    delay: "reveal-d3",
  },
];

export function Testimonials() {
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
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <div className="text-center mb-16 reveal">
          <div className="section-badge">Depoimentos</div>
          <h2 className="font-display font-black text-slate-900 mb-4 text-[clamp(2rem,4vw,2.6rem)] tracking-tight">
            O que profissionais dizem
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map(({ text, initials, name, role, avatarCls, delay }) => (
            <div key={name} className={`testimonial-card card-hover-landing reveal ${delay}`}>
              <StarRating />
              <p className="text-sm text-slate-600 leading-relaxed mb-5">{text}</p>
              <div className="flex items-center gap-3">
                <div
                  className={`size-9 rounded-full flex items-center justify-center text-sm font-bold ${avatarCls}`}
                >
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{name}</p>
                  <p className="text-xs text-slate-400">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
