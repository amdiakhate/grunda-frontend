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

export type ReviewStatus = 'pending' | 'reviewed' | 'rejected';
export type MappingStatus = 'mapped' | 'unmapped';

export interface MaterialBasic {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaterialListItem {
  id: string;
  productId: string;
  materialId: string;
  material: MaterialBasic;
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
  product_review_status?: ReviewStatus;
  updatedAt?: string;
  product_affected?: number;
  userName?: string;
}

export interface MaterialDetails {
  id: string;
  name: string;
  description?: string;
  activityUuid?: string;
  activityName?: string;
  activityUnit?: string;
  activityOrigin?: string;
  assembling_location?: string;
  material_origin?: string;
  referenceProduct?: string;
  finalProduct?: boolean;
  transformationActivityName?: string;
  transformationActivityUuid?: string;
  transformationActivityUnit?: string;
  transformationActivityOrigin?: string;
  transformationReferenceProduct?: string;
  quantity: number;
  unit: string;
  productId: string;
  userId: string;
  userName: string;
  product_review_status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
  alternatives: MaterialAlternative[];
}

export interface MaterialAlternative {
  materialPattern: string;
  alternateNames: string[];
  referenceProduct: string;
  finalProduct: boolean;
  activityName: string;
  transformationActivityName?: string;
}

export interface MaterialsListResponse {
  items: MaterialListItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface MaterialListQueryParams {
  page?: number;
  pageSize?: number;
  status?: ReviewStatus;
  search?: string;
  showMapped?: boolean;
} 