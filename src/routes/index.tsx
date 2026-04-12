import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="p-2">
      <h3 className="text-red-500">Página Inicial do Patas Sem Lar!</h3>
    </div>
  );
}
