import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/profissional/horarios')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/profissional/horarios"!</div>
}
