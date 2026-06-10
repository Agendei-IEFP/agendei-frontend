import { createFileRoute } from "@tanstack/react-router";
import { StoresNavbar } from "@/components/stores/StoresNavbar";
import { StoreHero } from "@/components/stores/StoreHero";
import { OfferingList } from "@/components/stores/OfferingList";
import { StoreProfessionalList } from "@/components/stores/StoreProfessionalList";
import { Footer } from "@/components/layout/Footer";
import { useStore, useStoreServices, useStoreProfessionals } from "@/hooks/useStores";

export const Route = createFileRoute("/stores/$storeId/")({
  component: StoreDetailPage,
});

function StoreDetailPage() {
  const { storeId } = Route.useParams();

  const storeQuery = useStore(storeId);
  const offeringsQuery = useStoreServices(storeId);
  const professionalsQuery = useStoreProfessionals(storeId);

  const isLoading =
    storeQuery.isLoading || offeringsQuery.isLoading || professionalsQuery.isLoading;

  if (isLoading) {
    return (
      <>
        <StoresNavbar />
        <div className="min-h-screen bg-background flex items-center justify-center pt-16">
          <div className="size-8 animate-spin rounded-full border-2 border-border border-t-primary" />
        </div>
      </>
    );
  }

  if (storeQuery.isError || !storeQuery.data) {
    return (
      <>
        <StoresNavbar />
        <div className="min-h-screen bg-background flex items-center justify-center pt-16">
          <p className="text-sm text-muted-foreground">Loja não encontrada.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <StoresNavbar />
      <div className="min-h-screen bg-background pt-16">
        <StoreHero
          store={{
            ...storeQuery.data,
            professional_count:
              professionalsQuery.data?.length ?? storeQuery.data.professional_count,
            service_count: offeringsQuery.data?.length ?? storeQuery.data.service_count,
          }}
        />
        <OfferingList offerings={offeringsQuery.data ?? []} />
        <StoreProfessionalList professionals={professionalsQuery.data ?? []} storeId={storeId} />
        <Footer />
      </div>
    </>
  );
}
