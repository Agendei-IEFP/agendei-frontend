import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/lojas/$lojaId/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/lojas/$lojaId/"!</div>
}
