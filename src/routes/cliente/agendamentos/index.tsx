import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/cliente/agendamentos/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/cliente/agendamentos/"!</div>
}
