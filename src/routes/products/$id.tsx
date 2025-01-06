import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Product } from '../../interfaces/product'
import { productsService } from '../../services/products'
import { DataTable } from '../../components/products/datatable'
import { Button } from '../../components/ui/button'
export const Route = createFileRoute('/products/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  // get the product id from the url
  const productId = useParams({ from: '/products/$id' }).id
  // get the product from the api
  const [product, setProduct] = useState<Product | null>(null)
  // const product = useStore((state) => state.products.find((product) => product.id === productId));

  useEffect(() => {
    const fetchProduct = async () => {
      const product = await productsService.getById(productId);
      setProduct(product);
    };
    fetchProduct();
  }, [productId]);

  if(!product) {
    return <div>Loading...</div>
  }
  
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-sm text-gray-500">{product.category}</p>
        </div>
        <Button asChild>
          <Link to="/products/list">
            Back to Products
          </Link>
        </Button>
      </div>

      {/* nice table container and spaced in the page */}
      <div className="rounded-md border p-4 mt-4 w-full">
        <DataTable data={product} />
      </div>
    </>
  )
}