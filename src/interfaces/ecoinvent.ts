export interface EcoinventActivity {
    id: string;
    name: string;
    referenceProduct: string;
    location: string;
    confidence: number;
    source?: string;
    unit?: string;
} 