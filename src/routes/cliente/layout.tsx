import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/cliente/layout')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/cliente/layout"!</div>
}
