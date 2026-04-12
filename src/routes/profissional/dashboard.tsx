import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/profissional/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/profissional/dashboard"!</div>
}
