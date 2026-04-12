import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/loja/editar')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/loja/editar"!</div>
}
