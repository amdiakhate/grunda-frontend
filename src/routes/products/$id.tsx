import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { useEffect, useState, useCallback } from 'react'
import { Impact, Product, ProductMaterial } from '../../interfaces/product'
import { productsService } from '../../services/products'
import { DataTable } from '../../components/products/datatable'
import { Button } from '../../components/ui/button'
import { ImpactFilter } from '../../components/common/impactFilter'
import { Summary } from '../../components/products/summary'
import { MaterialsTreemap } from '../../components/products/materialsTreemap'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { ProductActions } from "@/components/products/productActions";
import { toast } from '../../hooks/use-toast'
import { Loader2, LineChart, Filter, PieChart, ListFilter, ArrowLeft, CheckCircle2, AlertTriangle, Clock, AlertCircle, Calculator } from 'lucide-react'
import { Badge } from '../../components/ui/badge'

export const Route = createFileRoute('/products/$id')({
  component: RouteComponent,
})

function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

function RouteComponent() {
  const productId = useParams({ from: '/products/$id' }).id;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [calculationLoading, setCalculationLoading] = useState(false);
  const [defaultImpacts, setDefaultImpacts] = useState<Impact[] | null>(null);

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedProduct = await productsService.getProductById(productId);
      setProduct(fetchedProduct);

      // Trouver le premier matériau avec des impacts pour définir l'impact par défaut
      if (fetchedProduct.productMaterials && fetchedProduct.productMaterials.length > 0) {
        const materialWithImpacts = fetchedProduct.productMaterials.find(
          (pm) => pm.impacts && 
          Array.isArray(pm.impacts.mainActivityImpacts) && 
          pm.impacts.mainActivityImpacts.length > 0
        );

        if (materialWithImpacts && materialWithImpacts.impacts) {
          setDefaultImpacts(materialWithImpacts.impacts.mainActivityImpacts);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load product details',
      });
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const startCalculation = async () => {
    if (!product) return;

    try {
      setCalculationLoading(true);
      await productsService.calculateProduct(product.id);
      toast({
        title: 'Calculation started',
        description: 'The product calculation has been initiated',
      });
      // Reload product after a short delay to get updated status
      setTimeout(() => fetchProduct(), 2000);
    } catch (error) {
      console.error('Error starting calculation:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to start product calculation',
      });
    } finally {
      setCalculationLoading(false);
    }
  };

  if (loading || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/products/list"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <Badge variant="outline" className="ml-2">
            {product.reference}
          </Badge>
        </div>
        <ProductActions product={product} onRefresh={fetchProduct} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Review Status</div>
                  <div className="text-sm text-muted-foreground">
                    Current review state of the product
                  </div>
                </div>
                <Badge
                  className={
                    product.review_status === 'reviewed'
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : product.review_status === 'rejected'
                      ? 'bg-red-100 text-red-800 hover:bg-red-200'
                      : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                  }
                >
                  {product.review_status === 'reviewed' && (
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                  )}
                  {product.review_status === 'rejected' && (
                    <AlertCircle className="mr-1 h-3 w-3" />
                  )}
                  {product.review_status === 'pending' && (
                    <Clock className="mr-1 h-3 w-3" />
                  )}
                  {product.review_status.charAt(0).toUpperCase() +
                    product.review_status.slice(1)}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Calculation Status</div>
                  <div className="text-sm text-muted-foreground">
                    Environmental impact calculation status
                  </div>
                </div>
                <Badge
                  className={
                    product.calculation_status === 'completed'
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : product.calculation_status === 'failed'
                      ? 'bg-red-100 text-red-800 hover:bg-red-200'
                      : product.calculation_status === 'pending'
                      ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                  }
                >
                  {product.calculation_status === 'completed' && (
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                  )}
                  {product.calculation_status === 'failed' && (
                    <AlertCircle className="mr-1 h-3 w-3" />
                  )}
                  {product.calculation_status === 'pending' && (
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  )}
                  {product.calculation_status.charAt(0).toUpperCase() +
                    product.calculation_status.slice(1)}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Completion Level</div>
                  <div className="text-sm text-muted-foreground">
                    Percentage of materials with activity mappings
                  </div>
                </div>
                <Badge
                  className={
                    product.completionLevel === 100
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : product.completionLevel >= 50
                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }
                >
                  {formatPercentage(product.completionLevel)}
                </Badge>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  {product.completionLevel === 100 ? (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-600">
                          All Materials Mapped
                        </span>
                      </div>
                      All materials have been mapped to activities. You can now:
                      <div className="mt-4">
                        <Button
                          onClick={startCalculation}
                          disabled={calculationLoading}
                          className="w-full gap-2"
                        >
                          {calculationLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Calculator className="h-4 w-4" />
                          )}
                          {calculationLoading
                            ? "Analysis in Progress..."
                            : "Run Full Analysis"}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-warning" />
                        <span className="font-medium text-warning">Incomplete Mapping</span>
                      </div>
                      Only {formatPercentage(product.completionLevel)}% of materials are mapped. You can:
                      <div className="mt-4 space-y-3">
                        <Button
                          onClick={startCalculation}
                          disabled={calculationLoading}
                          variant="outline"
                          className="w-full gap-2"
                        >
                          {calculationLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Calculator className="h-4 w-4" />
                          )}
                          {calculationLoading ? "Analysis in Progress..." : "Run Partial Analysis"}
                        </Button>
                        <p className="text-xs text-muted-foreground italic">
                          Note: Results will be incomplete and may not reflect the full environmental impact
                        </p>
                      </div>
                    </>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Materials Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListFilter className="h-5 w-5" />
              Materials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable data={product} />
          </CardContent>
        </Card>

        {/* Materials Treemap */}
        {defaultImpacts && defaultImpacts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Impact Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MaterialsTreemap materials={product.productMaterials} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}