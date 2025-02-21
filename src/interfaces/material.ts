export interface MaterialDetails {
  id: string;
  name: string;
  description?: string;
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
  assembling_location?: string;
  material_origin?: string;
  quantity?: number;
  unit?: string;
  product_review_status?: string;
}

export interface MaterialListQueryParams {
  page?: number;
  pageSize?: number;
  query?: string;
  status?: string;
}

export interface MaterialsListResponse {
  items: MaterialDetails[];
  total: number;
} 