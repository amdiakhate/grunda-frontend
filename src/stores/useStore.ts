import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface StoreState {
    isLoading: boolean;
    error: string | null;
    displayedImpact: { method: string; unit: string } | null;
    isCalculating: boolean;
    calculationStatus: string | null;
    data?: any;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setDisplayedImpact: (impact: { method: string; unit: string } | null) => void;
}

export const useStore = create<StoreState>()(
    persist(
        (set) => ({
            displayedImpact: null,
            isCalculating: false,
            calculationStatus: null,
            data: null,
            isLoading: false,
            error: null,
            setDisplayedImpact: (impact) => set({ displayedImpact: impact }),
            setLoading: (loading) => set({ isLoading: loading }),
            setError: (error) => set({ error })
        }),
        {
            name: 'impact-storage',
            partialize: (state) => ({ displayedImpact: state.displayedImpact })
        }
    )
);