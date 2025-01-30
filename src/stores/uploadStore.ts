import { create } from 'zustand';
import { MaterialSuggestion, UploadResponse, MaterialRequiringReview } from '../interfaces/csvUpload';

interface UploadStore {
    uploadResponse: UploadResponse | null;
    selectedMappings: Record<string, MaterialSuggestion>;
    setUploadResponse: (response: UploadResponse | null) => void;
    setSelectedMappings: (mappings: Record<string, MaterialSuggestion>) => void;
    updateMaterial: (material: MaterialRequiringReview) => void;
    reset: () => void;
}

export const useUploadStore = create<UploadStore>((set) => ({
    uploadResponse: null,
    selectedMappings: {},
    setUploadResponse: (response) => set({ uploadResponse: response }),
    setSelectedMappings: (mappings) => set({ selectedMappings: mappings }),
    updateMaterial: (material) => set((state) => ({
        uploadResponse: state.uploadResponse ? {
            ...state.uploadResponse,
            materialsRequiringReview: state.uploadResponse.materialsRequiringReview.map(m =>
                m.id === material.id ? material : m
            )
        } : null
    })),
    reset: () => set({ uploadResponse: null, selectedMappings: {} }),
})); 