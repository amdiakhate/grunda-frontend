import { createFileRoute } from '@tanstack/react-router';
import { MaterialsList } from '@/components/materials/MaterialsList';

export const Route = createFileRoute('/admin/materials/')({
  component: MaterialsList,
}); 