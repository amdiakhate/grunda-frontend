import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Product, ReviewStatus, CalculationStatus, ImportSource } from '@/interfaces/product';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { MaterialMappingPanel } from '@/components/materials/MaterialMappingPanel';
import { MaterialMapping } from '@/interfaces/materialMapping';
import { adminService } from '@/services/admin';
import { 
  Loader2, 
  CheckCircle, 
  XCircle, 
  ArrowLeft,
  Package,
  ListFilter,
  History,
  AlertTriangle,
  Clock,
  FileText,
  Link2
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useProducts } from '@/hooks/useProducts';

export const Route = createFileRoute('/admin/products/$id')({
  component: ProductPage,
});

function ProductPage() {
  return (
    <ProtectedRoute requireAdmin>
      <ProductDetails />
    </ProtectedRoute>
  );
}

const statusColors: Record<ReviewStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  reviewed: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const calculationStatusColors: Record<CalculationStatus, string> = {
  none: 'bg-gray-100 text-gray-800',
  pending: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
};

const importSourceLabels: Record<ImportSource, string> = {
  MANUAL: 'Manual Entry',
  CSV: 'CSV Import',
  API: 'API Import',
};

function ProductDetails() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getProductById, reviewProduct } = useProducts();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);
  const [comment, setComment] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [processingMaterialId, setProcessingMaterialId] = useState<string>();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await getProductById(id);
        if (data === null) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Product not found",
          });
          navigate({ to: '/admin/products' });
          return;
        }
        setProduct(data);
        // Initialize comment with previous review comment if it exists
        if (data.review_comment) {
          setComment(data.review_comment);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load product details",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, getProductById, toast, navigate]);

  const handleReview = async (action: 'approve' | 'reject') => {
    if (!product || !id || reviewing) return;

    try {
      setReviewing(true);
      await reviewProduct(id, {
        action,
        comment: comment.trim() || undefined,
      }, false);
      
      // Update local product state
      setProduct(prev => prev ? {
        ...prev,
        review_status: action === 'approve' ? 'reviewed' : 'rejected',
      } : null);

      toast({
        title: "Success",
        description: `Product ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
      });

      // Navigate back to products list after a short delay
      setTimeout(() => {
        navigate({ to: '/admin/products' });
      }, 1500);

    } catch (error) {
      console.error('Failed to review product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to review product",
      });
    } finally {
      setReviewing(false);
    }
  };

  const handleMaterialMapping = async (materialId: string, mapping: MaterialMapping) => {
    try {
      setProcessingMaterialId(materialId);
      
      // If mapping is empty, it means we're removing the mapping
      if (!mapping.id) {
        await adminService.removeMaterialMapping(materialId);
        setProduct(prev => {
          if (!prev) return null;
          return {
            ...prev,
            materials: prev.materials.map(m => 
              m.id === materialId ? {
                ...m,
                activityUuid: undefined,
                activityName: undefined,
                activityUnit: undefined,
                activityOrigin: undefined,
                transformationActivityUuid: undefined,
                transformationActivityName: undefined,
                transformationActivityUnit: undefined,
                transformationActivityOrigin: undefined,
                referenceProduct: undefined,
                transformationReferenceProduct: undefined,
              } : m
            )
          };
        });
        
        toast({
          title: "Success",
          description: "Activity mapping removed successfully",
        });
      } else {
        const result = await adminService.matchMaterial(materialId, mapping.id);
        
        if (result.success) {
          setProduct(prev => {
            if (!prev) return null;
            return {
              ...prev,
              materials: prev.materials.map(m => 
                m.id === materialId ? {
                  ...m,
                  activityUuid: result.activity.uuid,
                  activityName: result.activity.name,
                  activityUnit: result.activity.unit,
                  activityOrigin: result.activity.location,
                  referenceProduct: result.activity.referenceProduct,
                  transformationActivityUuid: result.transformation?.uuid,
                  transformationActivityName: result.transformation?.name,
                  transformationActivityUnit: result.transformation?.unit,
                  transformationActivityOrigin: result.transformation?.location,
                  transformationReferenceProduct: result.transformation?.referenceProduct,
                } : m
              )
            };
          });
          
          toast({
            title: "Success",
            description: result.message,
          });
        }
      }
    } catch (error) {
      console.error('Failed to match material:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to match material. Please try again.";
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setProcessingMaterialId(undefined);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-lg font-medium">Product not found</p>
        <Button variant="outline" onClick={() => navigate({ to: '/admin/products' })}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
      </div>
    );
  }

  const getStatusIcon = (status: ReviewStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'reviewed':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6" />
            {product.name}
          </h1>
          <p className="text-muted-foreground">Reference: {product.reference}</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge
            className={statusColors[product.review_status]}
            variant="outline"
          >
            <span className="flex items-center gap-2">
              {getStatusIcon(product.review_status)}
              {product.review_status.charAt(0).toUpperCase() + product.review_status.slice(1)}
            </span>
          </Badge>
          <Button variant="outline" onClick={() => navigate({ to: '/admin/products' })}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="materials" className="flex items-center gap-2">
            <ListFilter className="h-4 w-4" />
            Materials
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
              <CardDescription>Basic details about the product</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Category</dt>
                  <dd className="text-sm mt-1">{product.category}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Import Source</dt>
                  <dd className="text-sm mt-1">
                    <Badge variant="outline">
                      {importSourceLabels[product.import_source]}
                    </Badge>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Calculation Status</dt>
                  <dd className="text-sm mt-1">
                    <Badge
                      className={calculationStatusColors[product.calculation_status]}
                      variant="outline"
                    >
                      {product.calculation_status}
                    </Badge>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Last Updated</dt>
                  <dd className="text-sm mt-1">
                    {new Date(product.updatedAt).toLocaleString()}
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-sm font-medium text-muted-foreground">Description</dt>
                  <dd className="text-sm mt-1">{product.description || 'No description provided'}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Review Card - Now shown for all products */}
          <Card>
            <CardHeader>
              <CardTitle>
                {product.review_status === 'pending' ? 'Review Product' : 'Update Review Status'}
              </CardTitle>
              <CardDescription>
                {product.review_status === 'pending'
                  ? 'Approve or reject this product with optional comments'
                  : `This product is currently ${product.review_status}. You can update its review status.`}
                {product.review_comment && (
                  <div className="mt-2 p-3 bg-muted rounded-md">
                    <p className="text-sm font-medium mb-1">Previous Review Comment:</p>
                    <p className="text-sm">{product.review_comment}</p>
                  </div>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Review Comment</label>
                  <Textarea
                    placeholder="Add a comment about your decision..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    disabled={reviewing}
                  />
                </div>
                <div className="flex gap-4">
                  <Button
                    onClick={() => handleReview('approve')}
                    disabled={reviewing}
                    className="flex-1"
                    variant={product.review_status === 'reviewed' ? 'outline' : 'default'}
                  >
                    {reviewing ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    {product.review_status === 'reviewed' ? 'Update Approval' : 'Approve'}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleReview('reject')}
                    disabled={reviewing}
                    className="flex-1"
                  >
                    {reviewing ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-2" />
                    )}
                    {product.review_status === 'rejected' ? 'Update Rejection' : 'Reject'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Materials List</CardTitle>
              <CardDescription>
                All materials associated with this product
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {product.materials.map((material) => (
                  <div
                    key={material.id}
                    className="p-4 rounded-lg border space-y-2 relative"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{material.name}</h3>
                        {material.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {material.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">
                          {material.quantity} {material.unit}
                        </Badge>
                        <MaterialMappingPanel
                          materialId={material.id}
                          currentMappingId={material.activityUuid}
                          onMappingSelect={(mapping) => handleMaterialMapping(material.id, mapping)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      {/* Main Activity */}
                      {material.activityName && (
                        <div className="col-span-2 p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-start gap-2">
                            <Link2 className="h-4 w-4 mt-0.5 text-primary" />
                            <div className="flex-1">
                              <dt className="text-sm font-medium text-muted-foreground">Main Activity</dt>
                              <dd className="text-sm mt-1 space-y-1">
                                <div className="font-medium">{material.activityName}</div>
                                {material.referenceProduct && (
                                  <div className="text-sm text-muted-foreground">
                                    Reference Product: {material.referenceProduct}
                                  </div>
                                )}
                                {material.activityOrigin && (
                                  <div className="text-sm text-muted-foreground">
                                    Origin: {material.activityOrigin}
                                  </div>
                                )}
                                {material.activityUnit && (
                                  <div className="text-sm text-muted-foreground">
                                    Unit: {material.activityUnit}
                                  </div>
                                )}
                              </dd>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Transformation Activity */}
                      {material.transformationActivityName && (
                        <div className="col-span-2 p-3 bg-muted/30 rounded-lg mt-2">
                          <div className="flex items-start gap-2">
                            <Link2 className="h-4 w-4 mt-0.5 text-primary rotate-90" />
                            <div className="flex-1">
                              <dt className="text-sm font-medium text-muted-foreground">Transformation Activity</dt>
                              <dd className="text-sm mt-1 space-y-1">
                                <div className="font-medium">{material.transformationActivityName}</div>
                                {material.transformationReferenceProduct && (
                                  <div className="text-sm text-muted-foreground">
                                    Reference Product: {material.transformationReferenceProduct}
                                  </div>
                                )}
                                {material.transformationActivityOrigin && (
                                  <div className="text-sm text-muted-foreground">
                                    Origin: {material.transformationActivityOrigin}
                                  </div>
                                )}
                                {material.transformationActivityUnit && (
                                  <div className="text-sm text-muted-foreground">
                                    Unit: {material.transformationActivityUnit}
                                  </div>
                                )}
                              </dd>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Other Details */}
                      {material.assembling_location && (
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Assembly Location</dt>
                          <dd className="text-sm mt-1">{material.assembling_location}</dd>
                        </div>
                      )}
                      {material.material_origin && (
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Material Origin</dt>
                          <dd className="text-sm mt-1">{material.material_origin}</dd>
                        </div>
                      )}
                    </div>
                    {processingMaterialId === material.id && (
                      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
                        <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full space-y-4">
                          <div className="flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          </div>
                          <div className="text-center space-y-2">
                            <h3 className="font-semibold text-lg">Updating Material Activity</h3>
                            <p className="text-muted-foreground">
                              {!material.activityUuid 
                                ? 'Removing current activity mapping...'
                                : 'Updating activity mapping and refreshing material information...'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Review History</CardTitle>
              <CardDescription>
                Timeline of product reviews and changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground text-center py-8">
                Review history feature coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 