import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/loja/editar')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='text-2xl text-red-500'>Hello "/admin/loja/editar"!</div>
}
