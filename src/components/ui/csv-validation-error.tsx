import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Info, CheckCircle, ChevronDown, ChevronUp, FileDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { downloadCSVTemplate } from "@/utils/download-helpers";

interface CSVValidationErrorProps {
  errors: string[];
  details?: string;
  validationRules?: Record<string, string>;
  suggestions?: string[];
}

export function CSVValidationError({
  errors,
  details,
  validationRules,
  suggestions,
}: CSVValidationErrorProps) {
  const [showRules, setShowRules] = useState(false);

  return (
    <div className="space-y-4">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>CSV Validation Failed</AlertTitle>
        <AlertDescription>
          {details || "The uploaded CSV file contains validation errors."}
        </AlertDescription>
      </Alert>

      <div className="border rounded-md p-4 bg-red-50">
        <h3 className="font-medium text-red-800 mb-2">Errors Found:</h3>
        <ul className="list-disc pl-5 space-y-1 text-red-700">
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      </div>

      {validationRules && (
        <div className="border rounded-md overflow-hidden">
          <button
            type="button"
            onClick={() => setShowRules(!showRules)}
            className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Validation Rules</span>
            </div>
            {showRules ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          
          {showRules && (
            <div className="px-4 py-3 border-t">
              <div className="space-y-2">
                {Object.entries(validationRules).map(([field, rule]) => (
                  <div key={field} className="grid grid-cols-[1fr,2fr] gap-2">
                    <div className="font-medium">{field}:</div>
                    <div>{rule}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {suggestions && suggestions.length > 0 && (
        <div className="border rounded-md p-4 bg-blue-50">
          <h3 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Suggestions:
          </h3>
          <ul className="list-disc pl-5 space-y-1 text-blue-700">
            {suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-white"
              onClick={() => downloadCSVTemplate()}
            >
              <FileDown className="h-3 w-3" />
              Download CSV Template
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 