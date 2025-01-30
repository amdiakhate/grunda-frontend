export interface MaterialSuggestion {
    name: string;
    confidence: number;
    activityName: string;
    activityUuuid?: string;
    referenceProduct: string;
    isBestMatch: boolean;
    confidenceLevel: 'low' | 'medium' | 'high';
    confidencePercentage: number;
    newMapping?: boolean;
}

export interface MaterialRequiringReview {
    id: string;
    name: string;
    occurrences: number;
    suggestions: MaterialSuggestion[];
}

export interface UploadSummary {
    totalProducts: number;
    totalMaterials: number;
    materialsMatched: number;
    materialsUnmatched: number;
    status: 'needs_review' | 'ready' | 'error';
    statusMessage: string;
}

export interface UploadResponse {
    message: string;
    summary: UploadSummary;
    materialsRequiringReview: MaterialRequiringReview[];
    importId: string;
} 