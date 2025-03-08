export type ReviewStatus = 'pending' | 'reviewed' | 'rejected';
export type CalculationStatus = 'none' | 'pending' | 'completed' | 'failed' | 'SUCCESS';
export type ImportSource = 'MANUAL' | 'CSV' | 'API';

export interface Impact {
  id: string;
  method: string;
  value: number;
  unit: string;
  version: string;
  createdAt: string;
  share?: number;
  activityType?: 'main' | 'transformation';
}

export interface MaterialImpacts {
  mainActivityImpacts: Impact[];
  transformationActivityImpacts: Impact[];
}

export interface Material {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unit: string;
  material_origin?: string;
  assembling_location?: string;
  activityUuid?: string;
  activityName?: string;
  activityUnit?: string;
  activityOrigin?: string;
  referenceProduct?: string;
  transformationActivityUuid?: string;
  transformationActivityName?: string;
  transformationActivityUnit?: string;
  transformationActivityOrigin?: string;
  transformationReferenceProduct?: string;
  finalProduct?: boolean;
  productId: string;
  customerId: string;
  product_review_status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
  impacts?: MaterialImpacts;
  completion?: boolean;
}

export interface ProductSummary {
  itemId: string;
  weight: number;
  weightDiff: number;
  impacts: Impact[];
  impactDiff: number;
}

export interface ProductMaterial {
  id: string;
  productId: string;
  materialId: string;
  material: {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
  };
  quantity: number;
  unit: string;
  activityUuid?: string;
  activityName?: string;
  activityUnit?: string;
  activityOrigin?: string;
  referenceProduct?: string;
  transformationActivityUuid?: string;
  transformationActivityName?: string;
  transformationActivityUnit?: string;
  transformationActivityOrigin?: string;
  transformationReferenceProduct?: string;
  material_origin?: string;
  assembling_location?: string;
  impacts?: MaterialImpacts;
  completion?: boolean;
}

export interface Product {
  id: string;
  name: string;
  reference: string;
  category: string;
  description?: string;
  calculation_status: CalculationStatus;
  review_status: ReviewStatus;
  review_comment?: string;
  customerId: string;
  import_source: ImportSource;
  createdAt: string;
  updatedAt: string;
  productMaterials: ProductMaterial[];
  summary?: ProductSummary;
  completionLevel: number;
  unitFootprint?: number;
  totalFootprint?: number;
}

export interface ReviewProductDto {
  action: 'approve' | 'reject';
  comment?: string;
  materialUpdates?: Array<{
    materialId: string;
    updates: {
      name?: string;
      quantity?: number;
      unit?: string;
      description?: string;
      mainActivityUuid?: string;
      transformationActivityUuid?: string;
      finalProduct?: boolean;
    };
  }>;
}

export interface PaginatedProductsResponse {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ReviewStats {
  pending: number;
  reviewed: number;
  rejected: number;
}

export interface ProductsListQueryParams {
  page?: number;
  pageSize?: number;
  status?: ReviewStatus;
  search?: string;
  customerId?: string;
}