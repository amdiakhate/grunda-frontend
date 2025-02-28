export type ReviewStatus = 'pending' | 'reviewed' | 'rejected';

export interface MaterialListItem {
  id: string;
  name: string;
  description?: string;
  activityName?: string;
  quantity: number;
  unit: string;
  userId: string;
  userName: string;
  product_review_status: ReviewStatus;
  updatedAt: string;
  product_affected: number;
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
} 