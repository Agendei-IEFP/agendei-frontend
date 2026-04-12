import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/lojas/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/lojas/"!</div>
}
