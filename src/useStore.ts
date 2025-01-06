import { create } from 'zustand';
import CSVRow from './interfaces/csvrow';

interface StoreState {
    data: CSVRow[];
    isLoading: boolean;
    error: string | null;
    setData: (data: CSVRow[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useStore = create<StoreState>((set) => ({
    data: [],
    isLoading: false,
    error: null,
    setData: (data) => set({ data }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error })
}));