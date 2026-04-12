import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/lojas/$lojaId/agendar/confirmar')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/lojas/$lojaId/agendar/confirmar"!</div>
}
