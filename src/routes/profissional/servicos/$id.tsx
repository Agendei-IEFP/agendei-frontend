import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/profissional/servicos/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/profissional/servicos/$id"!</div>
}
