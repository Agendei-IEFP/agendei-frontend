import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/profissional/servicos/novo')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/profissional/servicos/novo"!</div>
}
