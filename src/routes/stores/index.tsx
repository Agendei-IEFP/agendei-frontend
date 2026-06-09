import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, MapPin } from "lucide-react";
import { StoresNavbar } from "@/components/stores/StoresNavbar";
import { StoreCard } from "@/components/stores/StoreCard";
import { useStores } from "@/hooks/useStores";
import { Footer } from "@/components/layout/Footer";
import type { StoreType } from "@/types/api";

export const Route = createFileRoute("/stores/")({
  component: StoresPage,
});

const CATEGORIES = [
  "Todos",
  "Cabelo",
  "Barbearia",
  "Unhas",
  "Estética",
  "Massagem",
  "Tratamentos",
] as const;

const CATEGORY_MAP: Record<string, StoreType | undefined> = {
  Todos: undefined,
  Cabelo: "hair_salon",
  Barbearia: "barbershop",
  Unhas: "nails",
  Estética: "aesthetics",
  Massagem: "massage",
  Tratamentos: "treatments",
};

function StoresPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("Todos");

  const activeType = CATEGORY_MAP[activeCategory];
  const { data: stores = [], isLoading } = useStores(activeType);

  const filteredStores = useMemo(() => {
    if (!query.trim()) return stores;
    const q = query.toLowerCase();
    return stores.filter(
      (s) => s.name.toLowerCase().includes(q) || s.address?.toLowerCase().includes(q),
    );
  }, [stores, query]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StoresNavbar />

      {/* Hero */}
      <section className="hero-bg pt-20 pb-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 mb-5 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-muted text-chart-4 border border-salmon-200">
            <MapPin className="size-3" />
            {filteredStores.length}{" "}
            {filteredStores.length === 1 ? "salão disponível" : "salões disponíveis"}
          </span>

          <h1 className="font-heading font-black text-slate-900 mb-4 text-[clamp(1.8rem,5vw,2.6rem)] leading-tight tracking-tight">
            Reserve o seu próximo
            <br />
            <span className="bg-linear-to-br from-chart-4 via-primary to-chart-2 bg-clip-text text-transparent">
              momento de beleza
            </span>
          </h1>

          <p className="text-muted-foreground text-base mb-8 max-w-md mx-auto leading-relaxed">
            Descubra salões perto de você, compare serviços e agende em segundos — sem ligações.
          </p>

          {/* Search bar */}
          <div className="flex items-center bg-white rounded-2xl overflow-hidden max-w-xl mx-auto border border-input shadow-[0_4px_24px_rgba(224,80,64,0.08)]">
            <div className="flex items-center gap-2.5 px-4 py-3.5 flex-1">
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar salão ou morada..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full font-sans"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category filter pills */}
      <div className="sticky top-16 z-40 py-3 px-6 bg-[rgba(253,250,249,0.96)] backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={
                  activeCategory === cat
                    ? "inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-full border whitespace-nowrap transition-all border-chart-3 bg-chart-3 text-white shadow-[0_2px_10px_rgba(224,80,64,0.25)]"
                    : "inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-full border whitespace-nowrap transition-all border-input bg-white text-[#5A3730] hover:border-salmon-200 hover:bg-muted hover:text-chart-3"
                }
              >
                {cat}
              </button>
            ))}

            <div className="ml-auto pl-3 shrink-0 border-l border-border">
              <span className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{filteredStores.length}</span>{" "}
                {filteredStores.length === 1 ? "salão" : "salões"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="px-6 py-8 max-w-6xl mx-auto">
        {isLoading ? (
          <div className="flex justify-center py-24">
            <div className="size-8 animate-spin rounded-full border-2 border-border border-t-primary" />
          </div>
        ) : filteredStores.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <p className="text-base font-medium">Nenhum salão encontrado.</p>
            {query && <p className="text-sm mt-1">Tente buscar por outro nome ou endereço.</p>}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStores.map((store, i) => (
              <StoreCard key={store.id} store={store} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
