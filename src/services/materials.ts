import { EcoinventActivity } from "../interfaces/ecoinvent";
import { Material, Product } from "../interfaces/product";
import { api } from "./api";

export const materialsService = {
    async searchEcoinventActivities(product: Product,  material: Material): Promise<EcoinventActivity[]> {
        try {  
           const response = await api.get<{numberOfActivities: number, activities: EcoinventActivity[]}>(`/products/${product.id}/materials/${material.id}/activities`);
           return response.activities;
        } catch (error) {
           console.error('Error searching ecoinvent activities:', error);
           throw error;
        }
     },

     async setActivity(product: Product, material: Material, activity: EcoinventActivity): Promise<void> {
        try {
            await api.put(`/products/${product.id}/materials/${material.id}`, { 
               activityUuid: activity.id,
               activityName: activity.name,
               referenceProduct: activity.referenceProduct,
            });
        } catch (error) {
            console.error('Error setting activity:', error);
            throw error;
        }
     }
}