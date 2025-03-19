import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Product } from '@/interfaces/product';
import { productsService } from '@/services/products';
import { ProductDetailView } from '@/components/products/ProductDetailView';
import { Loader2 } from 'lucide-react';

export const Route = createFileRoute('/products/detail')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      id: search.id as string,
    };
  },
});

function RouteComponent() {
  const { id } = Route.useSearch();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        navigate({ to: '/products/list' });
        return;
      }

      try {
        setLoading(true);
        const fetchedProduct = await productsService.getProductById(id);
        setProduct(fetchedProduct);
      } catch (error) {
        console.error('Error fetching product:', error);
        // toast({
        //   variant: 'destructive',
        //   title: 'Erreur',
        //   description: 'Impossible de charger les détails du produit',
        // });
        navigate({ to: '/products/list' });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleBack = () => {
    navigate({ to: '/products/list' });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Chargement des détails du produit...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-sm text-muted-foreground">Produit non trouvé</p>
      </div>
    );
  }

  return <ProductDetailView product={product} onBack={handleBack} />;
} 