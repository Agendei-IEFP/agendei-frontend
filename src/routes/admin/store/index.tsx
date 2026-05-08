import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/store/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/store/"!</div>
}
