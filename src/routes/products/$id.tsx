import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { useEffect, useState, useCallback } from 'react'
import { Impact, Material, Product } from '../../interfaces/product'
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
  return Math.round(value).toString();
}

function RouteComponent() {
  const productId = useParams({ from: '/products/$id' }).id;
  const [product, setProduct] = useState<Product | null>(null);
  const [defaultImpacts, setDefaultImpacts] = useState<Impact[] | null>(null);
  const [calculationLoading, setCalculationLoading] = useState(false);

  const fetchProduct = useCallback(async () => {
    if (!productId) return;
    
    try {
      const fetchedProduct = await productsService.getById(productId);
      if (!fetchedProduct) {
        throw new Error('Product not found');
      }
      
      setProduct(fetchedProduct);
      setCalculationLoading(fetchedProduct.calculation_status === 'pending');
      
      // Get default impacts from the first material that has impacts
      if (fetchedProduct.materials && fetchedProduct.materials.length > 0) {
        const materialWithImpacts = fetchedProduct.materials.find((material: Material) => {
          const impacts = material.impacts?.mainActivityImpacts;
          return Array.isArray(impacts) && impacts.length > 0;
        });
        
        if (materialWithImpacts?.impacts?.mainActivityImpacts) {
          setDefaultImpacts(materialWithImpacts.impacts.mainActivityImpacts);
        }
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

  // Initial fetch
  useEffect(() => {
    fetchProduct();
  }, [productId]); // Only depend on productId, not fetchProduct

  const startCalculation = async () => {
    if (!productId) return;
    
    try {
      setCalculationLoading(true);
      await productsService.calculateProductImpact(productId);
      toast({
        title: "Impact calculation started",
        description: "This might take several minutes",
      });
      await fetchProduct();
    } catch (error) {
      console.error('Error calculating product impact:', error);
      toast({
        title: "Error",
        description: "An error occurred while calculating the product impact",
        variant: "destructive",
      });
    } finally {
      setCalculationLoading(false);
    }
  };

  if(!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Loading product details...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 border-b pb-6">
        <div className="flex justify-between items-start pt-6 px-2">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold tracking-tight">{product.name}</h1>
              <Badge variant="outline" className="text-sm px-3 py-1">
                {product.category}
              </Badge>
              {product.completionLevel === 100 ? (
                <Badge variant="success" className="flex items-center gap-2 px-3 py-1">
                  <CheckCircle2 className="h-4 w-4" />
                  Complete
                </Badge>
              ) : product.completionLevel >= 75 ? (
                <Badge variant="warning" className="flex items-center gap-2 px-3 py-1">
                  <AlertTriangle className="h-4 w-4" />
                  Almost Complete ({formatPercentage(product.completionLevel)}%)
                </Badge>
              ) : product.completionLevel >= 50 ? (
                <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1">
                  <Clock className="h-4 w-4" />
                  In Progress ({formatPercentage(product.completionLevel)}%)
                </Badge>
              ) : (
                <Badge variant="destructive" className="flex items-center gap-2 px-3 py-1">
                  <AlertCircle className="h-4 w-4" />
                  Incomplete ({formatPercentage(product.completionLevel)}%)
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-6">
              <p className="text-sm text-muted-foreground">
                Last updated {new Date(product.updatedAt).toLocaleDateString()}
              </p>
              <div className="h-4 w-[1px] bg-border" />
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden" style={{ width: '120px' }}>
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${product.completionLevel}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatPercentage(product.completionLevel)}% complete
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <ProductActions 
              calculationLoading={calculationLoading}
              onStartCalculation={startCalculation}
              onDuplicate={() => {/* ... */}}
              onHistory={() => {/* ... */}}
              onDelete={() => {/* ... */}}
              onExport={() => {/* ... */}}
              onShare={() => {/* ... */}}
            />
            <Button asChild variant="outline" size="lg">
              <Link to="/products/list" className="flex items-center gap-2">
                <ArrowLeft className="h-5 w-5" />
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
            {defaultImpacts && defaultImpacts.length > 0 ? (
              <ImpactFilter impactResults={defaultImpacts} />
            ) : (
              <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center">
                <div className="p-4 rounded-full bg-muted">
                  <Calculator className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">No Impact Analysis Available</h3>
                  <p className="text-sm text-muted-foreground max-w-[400px]">
                    {product.completionLevel === 100 ? (
                      <>
                        All materials are mapped. You can now run an impact analysis to view environmental metrics.
                        <div className="mt-4">
                          <Button
                            onClick={startCalculation}
                            disabled={calculationLoading}
                            className="gap-2"
                          >
                            {calculationLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Calculator className="h-4 w-4" />
                            )}
                            {calculationLoading ? "Analysis in Progress..." : "Start Analysis"}
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
            )}
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
              <MaterialsTreemap materials={product.materials} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}