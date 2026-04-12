import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/profissionais/adicionar')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/profissionais/adicionar"!</div>
}
