import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { JobStatusResponse } from '@/services/products';

interface UploadStoreState {
  // État du dernier job d'upload
  currentJob: JobStatusResponse | null;
  
  // Liste des jobs récents
  recentJobs: JobStatusResponse[];
  
  // Actions
  setCurrentJob: (job: JobStatusResponse | null) => void;
  updateCurrentJob: (job: Partial<JobStatusResponse>) => void;
  addRecentJob: (job: JobStatusResponse) => void;
  clearRecentJobs: () => void;
}

export const useUploadStore = create<UploadStoreState>()(
  persist(
    (set) => ({
      currentJob: null,
      recentJobs: [],
      
      setCurrentJob: (job) => set({ currentJob: job }),
      
      updateCurrentJob: (jobUpdate) => 
        set((state) => ({
          currentJob: state.currentJob 
            ? { ...state.currentJob, ...jobUpdate } 
            : null
        })),
      
      addRecentJob: (job) => 
        set((state) => {
          // Filtrer les jobs existants pour éviter les doublons
          const filteredJobs = state.recentJobs.filter(
            (existingJob) => existingJob.jobId !== job.jobId
          );
          
          // Ajouter le nouveau job au début de la liste
          return {
            recentJobs: [job, ...filteredJobs].slice(0, 10) // Garder seulement les 10 derniers
          };
        }),
      
      clearRecentJobs: () => set({ recentJobs: [] })
    }),
    {
      name: 'upload-store',
      partialize: (state) => ({ 
        recentJobs: state.recentJobs.filter(job => job.status === 'completed' || job.status === 'failed')
      })
    }
  )
); 