import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/profissional/__layout')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/profissional/__layout"!</div>
}
