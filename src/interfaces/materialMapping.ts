export interface MaterialMapping {
  id: string;
  materialPattern: string;
  activityName: string;
  finalProduct: boolean;
  alternateNames?: string[];
  referenceProduct?: string;
  transformationActivityName?: string;
  density?: number;
  lossRate?: number;
  activityOrigin?: string;
  activityUnit?: string;
  comment?: string;
  materialsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type SortField = 'materialPattern' | 'activityName' | 'materialsCount' | 'createdAt' | 'updatedAt';
export type SortOrder = 'asc' | 'desc';

export interface MaterialMappingSearchParams {
  page?: number;
  limit?: number;
  pageSize?: number;
  search?: string;
  finalProductOnly?: boolean;
  sortBy?: SortField;
  sortOrder?: SortOrder;
}

export interface PaginatedMaterialMappings {
  items: MaterialMapping[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  total?: number;
  page?: number;
  pageSize?: number;
}

export interface CreateMaterialMappingDto {
  materialPattern: string;
  activityName: string;
  finalProduct: boolean;
  alternateNames?: string[];
  referenceProduct?: string;
  transformationActivityName?: string;
  density?: number;
  lossRate?: number;
  activityOrigin?: string;
  activityUnit?: string;
  comment?: string;
}

export interface UpdateMaterialMappingDto extends Partial<Omit<CreateMaterialMappingDto, 'materialPattern'>> {
  materialPattern?: string;
}

export interface MaterialMappingListDto {
  id: string;
  materialPattern: string;
  alternateNames: string[];
  referenceProduct: string;
  comment?: string;
  materialsCount: number;
  activityName: string;
  finalProduct: boolean;
  transformationActivityName?: string;
  density?: number;
  lossRate?: number;
  createdAt: string;
  updatedAt: string;
} 