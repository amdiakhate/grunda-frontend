import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { useEffect, useState, useCallback } from 'react'
import { ImpactResult, Material, Product } from '../../interfaces/product'
import { productsService } from '../../services/products'
import { DataTable } from '../../components/products/datatable'
import { Button } from '../../components/ui/button'
import { ImpactFilter } from '../../components/common/impactFilter'
import { Summary } from '../../components/products/summary'
import { MaterialsTreemap } from '../../components/products/materialsTreemap'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { ProductActions } from "@/components/products/productActions";
import { ImpactProgress } from '../../components/products/impactProgress'

export const Route = createFileRoute('/products/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const productId = useParams({ from: '/products/$id' }).id;
  const [product, setProduct] = useState<Product | null>(null);
  const [defaultImpactResults, setDefaultImpactResults] = useState<ImpactResult[] | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const fetchProduct = useCallback(async () => {
    const product = await productsService.getById(productId);
    setProduct(product);
    const materialWithImpactResults = product.materials.find(
      (material: Material) => material.impactResults.length > 0
    );
    if (materialWithImpactResults) {
      setDefaultImpactResults(materialWithImpactResults.impactResults);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [productId, fetchProduct]);

  const handleReloadComplete = () => {
    setIsCalculating(false);
    fetchProduct();
  };

  if(!product) {
    return <div>Loading...</div>
  }
  
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-sm text-muted-foreground">{product.category}</p>
        </div>
        <div className="flex items-center gap-4">
          <ProductActions 
            productId={productId}
            onReloadComplete={handleReloadComplete}
            onCalculatingChange={setIsCalculating}
            onDuplicate={() => {/* ... */}}
            onHistory={() => {/* ... */}}
            onDelete={() => {/* ... */}}
            onExport={() => {/* ... */}}
            onShare={() => {/* ... */}}
          />
          <Button asChild variant="outline">
            <Link to="/products/list">Back to Products</Link>
          </Button>
        </div>
      </div>
     
      <div className="w-full mb-4">
        {product.summary && <Summary summary={product.summary} />}
      </div>

      <div className="flex gap-4 mb-4">
        <ImpactFilter impactResults={defaultImpactResults || []} />
      </div>

      <Card className="col-span-full mb-4">
        <CardHeader>
          <CardTitle>Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <MaterialsTreemap materials={product.materials} />
        </CardContent>
      </Card>
    
      <Card>
        <CardHeader>
          <CardTitle>Technical Details</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable data={product} />
        </CardContent>
      </Card>

      <ImpactProgress 
        materials={product.materials} 
        isVisible={isCalculating} 
      />
    </>
  )
}