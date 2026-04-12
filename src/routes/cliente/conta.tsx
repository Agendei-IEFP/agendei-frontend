import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/cliente/conta')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/cliente/conta"!</div>
}
