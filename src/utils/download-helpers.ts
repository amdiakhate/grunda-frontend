import { API_BASE_URL } from "@/services/api";
import { authService } from "@/services/auth";

/**
 * Downloads the CSV template with authentication token
 */
export const downloadCSVTemplate = async () => {
  try {
    const token = authService.getToken();
    if (!token) {
      console.error("Authentication token not found");
      return;
    }

    const response = await fetch(`${API_BASE_URL}/products/template/csv`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to download template: ${response.statusText}`);
    }

    // Get the filename from the Content-Disposition header if available
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = 'products_template.csv';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1];
      }
    }

    // Create a blob from the response
    const blob = await response.blob();
    
    // Create a download link and trigger the download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Error downloading CSV template:", error);
    alert("Failed to download CSV template. Please try again.");
  }
}; 