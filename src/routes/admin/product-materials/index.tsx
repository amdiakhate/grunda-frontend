import { createFileRoute } from '@tanstack/react-router'
import { ProductMaterialsList } from '@/components/materials/ProductMaterialsList'

export const Route = createFileRoute('/admin/product-materials/')({
  component: ProductMaterialsList,
})
