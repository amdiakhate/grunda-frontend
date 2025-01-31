import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { useEffect, useState, useCallback } from 'react'
import { ImpactResult, Material, Product } from '../../interfaces/product'
import { productsService } from '../../services/products'
import { DataTable } from '../../components/products/datatable'
import { Button } from '../../components/ui/button'
import { ImpactFilter } from '../../components/common/impactFilter'
import { Summary } from '../../components/products/summary'
import { MaterialsTreemap } from '../../components/products/materialsTreemap'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { ProductActions } from "@/components/products/productActions";
import { toast } from '../../hooks/use-toast'
import { Loader2, LineChart, Filter, PieChart, ListFilter, ArrowLeft } from 'lucide-react'
import { Badge } from '../../components/ui/badge'

export const Route = createFileRoute('/products/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const productId = useParams({ from: '/products/$id' }).id;
  const [product, setProduct] = useState<Product | null>(null);
  const [defaultImpactResults, setDefaultImpactResults] = useState<ImpactResult[] | null>(null);
  const [calculationLoading, setCalculationLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const fetchProduct = useCallback(async () => {
    try {
      const product = await productsService.getById(productId);
      setProduct(product);
      setCalculationLoading(product.calculation_status === 'pending');
      const materialWithImpactResults = product.materials.find(
        (material: Material) => material.impactResults.length > 0
      );
      if (materialWithImpactResults) {
        setDefaultImpactResults(materialWithImpactResults.impactResults);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: "Error",
        description: "Failed to load product data",
        variant: "destructive",
      });
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [productId, fetchProduct]);

  // Fonction pour mettre à jour le produit après un changement de mapping
  const handleProductUpdate = useCallback(async () => {
    setIsUpdating(true);
    try {
      await fetchProduct();
    } finally {
      setIsUpdating(false);
    }
  }, [fetchProduct]);

  const startCalculation = async () => {
    try {
      await productsService.calculateProductImpact(productId);
      toast({
        title: "Impact calculation started",
        description: "This might take several minutes",
      });
      fetchProduct();

    } catch (error) {
      console.error('Error calculating product impact:', error);
      toast({
        title: "Error",
        description: "An error occurred while calculating the product impact",
        variant: "destructive",
      });
    }

}

  if(!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Loading product details...</p>
      </div>
    );
  }
  
  return (
    <div className={`space-y-6 transition-opacity duration-300 ${isUpdating ? 'opacity-50' : 'opacity-100'}`}>
      {/* Header Section */}
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 border-b pb-4">
        <div className="flex justify-between items-center pt-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
              <Badge variant="outline" className="text-sm">
                {product.category}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Last updated {new Date(product.updatedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ProductActions 
              calculationLoading={calculationLoading}
              onStartCalculation={startCalculation}
              onDuplicate={() => {/* ... */}}
              onHistory={() => {/* ... */}}
              onDelete={() => {/* ... */}}
              onExport={() => {/* ... */}}
              onShare={() => {/* ... */}}
            />
            <Button asChild variant="outline">
              <Link to="/products/list" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Products
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6">
        {/* Summary Section */}
        {product.summary && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Summary summary={product.summary} />
            </CardContent>
          </Card>
        )}

        {/* Impact Filter Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Impact Metrics
            </CardTitle>
            <CardDescription>
              Select the environmental impact metrics to analyze
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImpactFilter impactResults={defaultImpactResults || []} />
          </CardContent>
        </Card>

        {/* Insights Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Material Impact Distribution
            </CardTitle>
            <CardDescription>
              Visual breakdown of environmental impact by material
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <MaterialsTreemap materials={product.materials} />
          </CardContent>
        </Card>
    
        {/* Technical Details Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListFilter className="h-5 w-5" />
              Material Details
            </CardTitle>
            <CardDescription>
              Detailed view of all materials and their environmental impacts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable data={product} onUpdate={handleProductUpdate} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}