import { create } from 'zustand';
import { MaterialSuggestion, UploadResponse } from '../interfaces/csvUpload';

interface UploadStore {
    uploadResponse: UploadResponse | null;
    selectedMappings: Record<string, MaterialSuggestion>;
    setUploadResponse: (response: UploadResponse | null) => void;
    setSelectedMappings: (mappings: Record<string, MaterialSuggestion>) => void;
    reset: () => void;
}

export const useUploadStore = create<UploadStore>((set) => ({
    uploadResponse: null,
    selectedMappings: {},
    setUploadResponse: (response) => set({ uploadResponse: response }),
    setSelectedMappings: (mappings) => set({ selectedMappings: mappings }),
    reset: () => set({ uploadResponse: null, selectedMappings: {} }),
})); 