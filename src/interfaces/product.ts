export interface Product {
    id: string;
    name: string;
    category: string;
    unitFootprint: number;
    totalFootprint: number;
    completionLevel: number;
    materials: Material[];
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
}