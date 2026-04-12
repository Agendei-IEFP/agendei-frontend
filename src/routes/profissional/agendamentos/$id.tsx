import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/profissional/agendamentos/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/profissional/agendamentos/$id"!</div>
}
