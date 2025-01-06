import { createLazyFileRoute } from '@tanstack/react-router'
import { DataTable } from '../../../components/products/datatable'
import { useStore } from '../../../useStore';

export const Route = createLazyFileRoute('/products/steps/preview')({
  component: RouteComponent,
})

function RouteComponent() {
  const data = useStore((state) => state.data);
  if (!data || data.length === 0) {
    return <div>No data available for preview.</div>;
  }

  return (
    <>
      <h1>Preview</h1>
      <DataTable data={data} />
    </>
  );
}
//         return rows.filter(row => {