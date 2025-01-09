import { EcoinventActivity } from "../interfaces/ecoinvent";
import { Material } from "../interfaces/product";
import { api } from "./api";

export const materialsService = {
    async searchEcoinventActivities(material: Material): Promise<EcoinventActivity[]> {
        try {  
           const response = await api.get<{numberOfActivities: number, activities: EcoinventActivity[]}>(`/materials/${material.id}/activities`);
           return response.activities;
        } catch (error) {
           console.error('Error searching ecoinvent activities:', error);
           throw error;
        }
     }
}