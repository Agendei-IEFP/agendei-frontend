import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { StoresNavbar } from "@/components/stores/StoresNavbar";
import { StoreCard } from "@/components/stores/StoreCard";
import { listStores } from "@/lib/api/stores";
import { Footer } from "@/components/layout/Footer";
import type { StoreDTO } from "@/types/api";

export const Route = createFileRoute("/stores/")({
  component: StoresPage,
});

function StoresPage() {
  const [query, setQuery] = useState("");
  const [stores, setStores] = useState<StoreDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    listStores().then((data) => {
      setStores(data);
      setIsLoading(false);
    });
  }, []);

  const q = query.toLowerCase();
  const filteredStores = query.trim()
    ? stores.filter((s) => s.name.toLowerCase().includes(q) || s.address?.toLowerCase().includes(q))
    : stores;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StoresNavbar />

      {/* Hero */}
      <section className="hero-bg pt-20 pb-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
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
            {filteredStores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
