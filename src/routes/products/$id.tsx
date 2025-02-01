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
import { Loader2, LineChart, Filter, PieChart, ListFilter, ArrowLeft, CheckCircle2, AlertTriangle, Clock, AlertCircle, Calculator, ArrowDown } from 'lucide-react'
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
            {defaultImpactResults && defaultImpactResults.length > 0 ? (
              <ImpactFilter impactResults={defaultImpactResults} />
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
                          <div className="border-t pt-3">
                            <Button
                              variant="secondary"
                              onClick={() => {
                                const element = document.querySelector('#material-details');
                                element?.scrollIntoView({ behavior: 'smooth' });
                              }}
                              className="w-full gap-2"
                            >
                              <ArrowDown className="h-4 w-4" />
                              Complete Material Mapping First
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </p>
                </div>
              </div>
            )}
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
            {defaultImpactResults && defaultImpactResults.length > 0 ? (
              <MaterialsTreemap materials={product.materials} />
            ) : (
              <div className="flex flex-col items-center justify-center py-8 space-y-2 text-center">
                <div className="p-4 rounded-full bg-muted">
                  <PieChart className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium">Impact Distribution Not Available</h3>
                <p className="text-sm text-muted-foreground">
                  Run an impact analysis to view the distribution of environmental impacts across materials.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
    
        {/* Technical Details Section */}
        <Card id="material-details">
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