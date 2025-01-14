export interface Product {
    id: string;
    name: string;
    category: string;
    unitFootprint: number;
    totalFootprint: number;
    completionLevel: number;
    materials: Material[];
    summary: ProductSummary;
}

export interface ProductSummary {
    itemId: string;           // A16709-1-32-1486-10
    weight: number;           // 12 kg
    weightDiff: number;       // -4% (under catalog average)
    impacts: {method : string, value: number, unit: string}[]; // 19 kg CO2e
    impactDiff: number;      // +1
}

export interface Material {
    id: string;
    name: string;
    description: string;
    activityUuid: string;
    activityName: string;
    category: string;
    referenceProduct: string;
    quantity: number;
    unit: string;
    origin: string;
    completion: boolean;
    impactResults: ImpactResult[];
    status: string;
    progress: number;
    details: string;
}

export interface ImpactResult {
    id: string;
    method: string;
    value: number;
    unit: string;
    version: string;
    createdAt: string;
    share: number; // percentage of the total impact for this method
}