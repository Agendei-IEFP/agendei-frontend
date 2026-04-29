import { useState } from "react";
import { useRevealAnimation } from "@/components/landing/useRevealAnimation";
import { Check, Copy } from "lucide-react";

function PreviewServico() {
  return (
    <div className="step-preview-card">
      <div className="border-2 border-primary bg-muted rounded-lg p-2 mb-2">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-900">Corte feminino</p>
            <p className="text-xs text-slate-500">60 min</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-chart-3">R$ 80</p>
            <Check className="size-3.5 ml-auto text-primary" />
          </div>
        </div>
      </div>
      <div className="border border-[#f1f5f9] rounded-lg p-2 opacity-60">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-slate-600">Coloração</p>
            <p className="text-xs text-slate-400">120 min</p>
          </div>
          <p className="text-xs font-bold text-slate-600">R$ 180</p>
        </div>
      </div>
    </div>
  );
}

function PreviewHorario() {
  const slots = [
    { time: "09:00", state: "selected" },
    { time: "09:30", state: "available" },
    { time: "10:00", state: "disabled" },
    { time: "10:30", state: "available" },
    { time: "11:00", state: "disabled" },
    { time: "11:30", state: "available" },
  ];

  const slotClass: Record<string, string> = {
    selected: "border-2 border-primary bg-muted text-chart-4 font-bold",
    available: "border border-[#e2e8f0] text-[#475569]",
    disabled: "bg-[#f8fafc] text-[#cbd5e1] border border-[#f1f5f9]",
  };

  return (
    <div className="step-preview-card">
      <p className="text-xs font-medium text-slate-600 mb-2">15 abr · João Silva</p>
      <div className="grid grid-cols-3 gap-1.5">
        {slots.map((s) => (
          <div
            key={s.time}
            className={`py-1.5 text-xs rounded-lg text-center ${slotClass[s.state]}`}
          >
            {s.time}
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewConfirmar() {
  return (
    <div className="step-preview-card">
      <div className="space-y-1.5 mb-3">
        {[
          ["Serviço", "Corte feminino"],
          ["Profissional", "João Silva"],
          ["Data/hora", "15 abr · 09:00"],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between text-xs">
            <span className="text-slate-400">{k}</span>
            <span className="font-medium text-slate-800">{v}</span>
          </div>
        ))}
        <div className="flex justify-between text-xs border-t border-slate-100 pt-1.5">
          <span className="text-slate-400">Total</span>
          <span className="font-bold text-slate-900">R$ 80,00</span>
        </div>
      </div>
      <div className="step-success-banner">
        <Check className="size-3.5 text-emerald-600 shrink-0" />
        <span className="text-xs text-emerald-700 font-medium">Email enviado automaticamente!</span>
      </div>
    </div>
  );
}

function PreviewCadastro() {
  return (
    <div className="step-preview-card">
      <div className="space-y-2">
        {[
          ["Nome da loja", "Studio Beleza"],
          ["Endereço", "Rua das Flores, 42"],
        ].map(([label, val]) => (
          <div key={label}>
            <p className="text-xs text-slate-400 mb-0.5">{label}</p>
            <div className="border border-border rounded-lg px-2 py-1.5 text-xs text-slate-700 font-medium">
              {val}
            </div>
          </div>
        ))}
        <div className="step-success-banner">
          <Check className="size-3.5 text-chart-3 shrink-0" />
          <span className="text-xs font-semibold text-chart-4">Loja criada com sucesso!</span>
        </div>
      </div>
    </div>
  );
}

function PreviewEquipa() {
  const profs = [
    { letter: "J", name: "João Silva", cls: "bg-muted text-chart-4" },
    { letter: "A", name: "Ana Costa", cls: "bg-blue-100 text-blue-700" },
  ];
  return (
    <div className="step-preview-card">
      <div className="space-y-1.5">
        {profs.map((p) => (
          <div
            key={p.name}
            className="flex items-center justify-between p-1.5 rounded-lg bg-background"
          >
            <div className="flex items-center gap-2">
              <div
                className={`size-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${p.cls}`}
              >
                {p.letter}
              </div>
              <span className="text-xs font-medium text-slate-700">{p.name}</span>
            </div>
            <span className="chip bg-emerald-100 text-emerald-700">Ativo</span>
          </div>
        ))}
        <button className="w-full py-1.5 text-xs font-semibold rounded-lg text-slate-400 border border-dashed border-border mt-1">
          + Adicionar profissional
        </button>
      </div>
    </div>
  );
}

function PreviewLink() {
  return (
    <div className="step-preview-card">
      <p className="text-xs text-slate-400 mb-2">Link da sua loja</p>
      <div className="flex items-center gap-2 border border-border rounded-lg p-2 bg-background mb-2">
        <span className="text-xs text-slate-600 flex-1 truncate">
          agendei.app/lojas/studio-beleza
        </span>
        <button className="text-xs font-semibold px-2 py-0.5 rounded-md bg-muted text-chart-3 shrink-0 flex items-center gap-1">
          <Copy className="size-3" /> Copiar
        </button>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 flex items-center justify-center py-1.5 rounded-lg bg-green-50 border border-green-100">
          <span className="text-xs text-green-700 font-medium">WhatsApp</span>
        </div>
        <div className="flex-1 flex items-center justify-center py-1.5 rounded-lg bg-purple-50 border border-purple-100">
          <span className="text-xs text-purple-700 font-medium">Instagram</span>
        </div>
      </div>
    </div>
  );
}

const STEPS_CLIENTES = [
  {
    num: "1",
    title: "Escolhe o serviço",
    desc: "Navega pela vitrine da sua loja, vê os profissionais disponíveis e seleciona o que quer.",
    preview: <PreviewServico />,
  },
  {
    num: "2",
    title: "Escolhe o horário",
    desc: "Vê os horários disponíveis em tempo real. Slots ocupados aparecem cinzas — sem surpresas para ninguém.",
    preview: <PreviewHorario />,
  },
  {
    num: "3",
    title: "Confirma e pronto",
    desc: "Revisa os detalhes e confirma. Recebe email imediato e lembrete 24h antes — você não faz nada.",
    preview: <PreviewConfirmar />,
  },
];

const STEPS_VOCE = [
  {
    num: "1",
    title: "Cadastre sua loja",
    desc: "Nome, endereço e horário de funcionamento. Menos de 2 minutos para criar o perfil da sua loja.",
    preview: <PreviewCadastro />,
  },
  {
    num: "2",
    title: "Adicione sua equipa",
    desc: "Cadastre os profissionais, defina os serviços e os preços. Cada um gerencia os seus próprios horários.",
    preview: <PreviewEquipa />,
  },
  {
    num: "3",
    title: "Compartilhe o link",
    desc: "Copie o link da sua loja e compartilhe onde quiser — Instagram, WhatsApp, Google. Pronto.",
    preview: <PreviewLink />,
  },
];

export function HowItWorks() {
  const [tab, setTab] = useState<"clientes" | "voce">("clientes");
  const ref = useRevealAnimation([tab]);

  const steps = tab === "clientes" ? STEPS_CLIENTES : STEPS_VOCE;
  const desc =
    tab === "clientes"
      ? "Observe como são simples os passos para seus clientes agendarem — sem precisar te ligar, sem WhatsApp, sem nada."
      : "Não precisa de técnico, não precisa de treinamento. Em menos de 10 minutos sua loja está no ar.";

  return (
    <section id="como-funciona" className="py-14 px-4 md:py-24 md:px-6 bg-background">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <div className="text-center mb-8 md:mb-10 reveal">
          <div className="section-badge">Como funciona</div>
          <h2 className="font-heading font-black text-slate-900 mb-4 text-[clamp(2rem,4vw,2.6rem)] tracking-tight">
            Simples para você.
            <br />
            Simples para seus clientes.
          </h2>
          <p className="text-slate-500 max-w-lg mx-auto">
            Escolha a perspectiva que quer entender primeiro.
          </p>
        </div>

        <div className="flex justify-center gap-3 mb-8">
          <button
            className={`como-tab ${tab === "clientes" ? "active" : ""}`}
            onClick={() => setTab("clientes")}
          >
            Para seus clientes
          </button>
          <button
            className={`como-tab ${tab === "voce" ? "active" : ""}`}
            onClick={() => setTab("voce")}
          >
            Como você começa
          </button>
        </div>

        <p className="text-center text-slate-500 text-sm mb-10 max-w-lg mx-auto">{desc}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="absolute top-8 left-1/3 right-1/3 h-px bg-gradient-to-r from-input to-muted hidden md:block" />
          {steps.map(({ num, title, desc: stepDesc, preview }, i) => (
            <div key={num} className={`text-center reveal reveal-d${i + 1}`}>
              <div className="size-12 md:size-16 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 bg-linear-to-br from-chart-3 to-primary shadow-[0_8px_24px_rgba(224,80,64,0.3)]">
                <span className="font-heading font-black text-xl text-white">{num}</span>
              </div>
              <h3 className="font-heading font-bold text-slate-900 mb-3 text-lg tracking-tight">
                {title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">{stepDesc}</p>
              {preview}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
