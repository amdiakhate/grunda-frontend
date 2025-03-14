import { CheckCircle2, AlertCircle, Clock, Loader2 } from "lucide-react";
import { JobStatus } from "@/services/products";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface JobStatusProgressProps {
  status: JobStatus;
  progress?: number | {
    percentage: number;
    stage: string;
    message: string;
  };
  message?: string;
  result?: {
    totalProducts?: number;
    totalMaterials?: number;
    materialsMatched?: number;
    materialsUnmatched?: number;
    status?: string;
    statusMessage?: string;
  };
}

export function JobStatusProgress({
  status,
  progress = 0,
  message,
  result,
}: JobStatusProgressProps) {
  // Get progress percentage and details
  const getProgressDetails = () => {
    if (typeof progress === 'number') {
      return {
        percentage: progress,
        stage: null,
        message: null
      };
    } else if (progress && typeof progress === 'object') {
      return {
        percentage: progress.percentage,
        stage: progress.stage,
        message: progress.message
      };
    }
    return {
      percentage: 0,
      stage: null,
      message: null
    };
  };

  const progressDetails = getProgressDetails();

  // Determine appearance based on status
  const getStatusDisplay = () => {
    switch (status) {
      case "pending":
        return {
          icon: <Clock className="h-4 w-4 text-yellow-500" />,
          title: "Pending Processing",
          description: message || "Your file is waiting to be processed...",
          color: "bg-yellow-100 border-yellow-200",
          textColor: "text-yellow-700",
        };
      case "processing":
        return {
          icon: <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />,
          title: "Processing in Progress",
          description: message || progressDetails.message || "Your file is being processed...",
          color: "bg-blue-50 border-blue-200",
          textColor: "text-blue-700",
        };
      case "completed":
        return {
          icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
          title: "Processing Completed",
          description: message || "Your file has been successfully processed.",
          color: "bg-green-50 border-green-200",
          textColor: "text-green-700",
        };
      case "failed":
        return {
          icon: <AlertCircle className="h-4 w-4 text-red-500" />,
          title: "Processing Failed",
          description: message || "The processing of your file has failed.",
          color: "bg-red-50 border-red-200",
          textColor: "text-red-700",
        };
      default:
        return {
          icon: <Clock className="h-4 w-4" />,
          title: "Unknown Status",
          description: message || "Unknown processing status.",
          color: "bg-gray-50 border-gray-200",
          textColor: "text-gray-700",
        };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div className="space-y-4">
      <Alert className={`${statusDisplay.color}`}>
        {statusDisplay.icon}
        <AlertTitle className={statusDisplay.textColor}>{statusDisplay.title}</AlertTitle>
        <AlertDescription className={statusDisplay.textColor}>
          {statusDisplay.description}
        </AlertDescription>
      </Alert>

      {(status === "pending" || status === "processing") && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <span>Progress</span>
              {progressDetails.stage && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {progressDetails.stage}
                </Badge>
              )}
            </div>
            <span>{Math.round(progressDetails.percentage)}%</span>
          </div>
          <Progress value={progressDetails.percentage} className="h-2" />
          {progressDetails.message && progressDetails.message !== statusDisplay.description && (
            <p className="text-sm text-blue-600 mt-1">{progressDetails.message}</p>
          )}
        </div>
      )}

      {status === "completed" && result && (
        <div className="border rounded-md p-4 bg-green-50">
          <h3 className="font-medium text-green-800 mb-2">Processing Summary:</h3>
          <ul className="space-y-1 text-sm text-green-700">
            <li>Products processed: {result.totalProducts || 0}</li>
            <li>Total materials: {result.totalMaterials || 0}</li>
            <li>Materials matched: {result.materialsMatched || 0}</li>
            <li>Materials unmatched: {result.materialsUnmatched || 0}</li>
            {result.statusMessage && <li>Message: {result.statusMessage}</li>}
          </ul>
        </div>
      )}
    </div>
  );
} 