import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Product } from "@/interfaces/product";
import { Info } from "lucide-react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatImpactValue } from "@/utils/format";
import { Link } from '@tanstack/react-router';
import { Search, Upload, ChevronRight, Star, StarHalf } from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
  categories: string[];
  isLoading: boolean;
}

export function ProductCatalog({ products, categories, isLoading }: ProductCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<'impact' | 'date' | 'name'>('impact');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtrer les produits
  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.reference.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Trier les produits
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'impact') {
      return (a.unitFootprint || 0) - (b.unitFootprint || 0);
    } else if (sortBy === 'date') {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  // Paginer les produits
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

  // Formater la valeur d'impact
  const formatImpact = (value: number | undefined) => {
    if (value === undefined || value === null) return '-';
    return `${formatImpactValue(value)} kg CO2e`;
  };

  // Générer les étoiles de popularité
  const renderPopularity = (product: Product) => {
    // Utiliser le niveau de complétion comme indicateur de popularité pour l'exemple
    // Dans un cas réel, vous utiliseriez une vraie métrique de popularité
    const popularity = product.completionLevel / 20; // Convertir en échelle de 0-5
    
    const fullStars = Math.floor(popularity);
    const hasHalfStar = popularity % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {Array(fullStars).fill(0).map((_, i) => (
          <Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && <StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
        {Array(5 - fullStars - (hasHalfStar ? 1 : 0)).fill(0).map((_, i) => (
          <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">Product catalog</h1>
        <Button className="flex items-center gap-2" variant="default">
          <Upload className="h-4 w-4" />
          Upload products
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2"
          >
            <option value="">All categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'impact' | 'date' | 'name')}
            className="rounded-md border border-input bg-background px-3 py-2"
          >
            <option value="impact">Sort by impact</option>
            <option value="date">Sort by date</option>
            <option value="name">Sort by name</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-sm text-muted-foreground">Loading products...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {paginatedProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden transition-all hover:shadow-md">
                <div className="relative aspect-video bg-muted">
                  {/* Placeholder pour l'image du produit */}
                  <div className="flex h-full items-center justify-center bg-gray-100">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <img 
                        src={`/product-images/${product.category.toLowerCase().replace(/\s+/g, '-')}.svg`} 
                        alt={product.name}
                        className="h-16 w-16 opacity-50"
                        onError={(e) => {
                          // Fallback si l'image n'existe pas
                          (e.target as HTMLImageElement).src = '/product-images/default.svg';
                        }}
                      />
                      <span className="mt-2 text-xs">{product.category}</span>
                    </div>
                  </div>
                  
                  {/* Badge de catégorie */}
                  <Badge className="absolute left-2 top-2">{product.category}</Badge>
                </div>
                
                <CardContent className="p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="font-medium line-clamp-2">{product.name}</h3>
                    <Badge variant="outline" className="ml-2 shrink-0">
                      {product.reference}
                    </Badge>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    {/* Popularité */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Popularity</span>
                      {renderPopularity(product)}
                    </div>
                    
                    {/* Impact environnemental */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Environmental impact</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="flex items-center gap-1">
                              <span className="font-medium">{formatImpact(product.unitFootprint)}</span>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Global Warming Potential per unit</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    
                    {/* SKU */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">SKU</span>
                      <span className="font-mono text-sm">{product.id.substring(0, 8)}</span>
                    </div>
                    
                    {/* Details button */}
                    <Button 
                      asChild 
                      variant="outline" 
                      className="mt-2 w-full"
                    >
                      <Link 
                        to="/products/detail" 
                        search={{ id: product.id }}
                        className="flex items-center justify-center gap-1"
                      >
                        View details
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedProducts.length)} of {sortedProducts.length} products
              </div>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <Button
                      key={pageNumber}
                      variant={currentPage === pageNumber ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
                {totalPages > 5 && <span className="flex items-center px-2">...</span>}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
          
          {paginatedProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </>
      )}
    </div>
  );
} 