import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/lojas/$lojaId/agendar/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/lojas/$lojaId/agendar/"!</div>
}
