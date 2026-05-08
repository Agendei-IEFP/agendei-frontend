import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/store/$storeId')({
  component: RouteComponent,
})

function RouteComponent() {
  
  return <div>Hello "/admin/store/$storeId"!</div>
}
