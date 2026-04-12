import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/cliente/agendamentos/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/cliente/agendamentos/$id"!</div>
}
