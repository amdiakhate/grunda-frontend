import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useCallback, useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '../../../components/ui/button'
import { Card } from '../../../components/ui/card'
import { productsService, JobStatusResponse } from '../../../services/products'
import { useToast } from '../../../hooks/use-toast'
import { Toaster } from '../../../components/ui/toaster'
import { Loader2, CheckCircle2, Upload, FileDown, HelpCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '../../../components/ui/alert'
import { CSVValidationError } from '../../../components/ui/csv-validation-error'
import { downloadCSVTemplate } from '../../../utils/download-helpers'
import { JobStatusProgress } from '../../../components/ui/job-status-progress'
import { useUploadStore } from '../../../stores/useUploadStore'

export const Route = createFileRoute('/products/steps/upload-file')({
  component: UploadFileRoute,
})

function UploadFileRoute() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [validationError, setValidationError] = useState<{
    errors: string[];
    details?: string;
    validationRules?: Record<string, string>;
    suggestions?: string[];
  } | null>(null)
  
  // State for asynchronous processing
  const [isPolling, setIsPolling] = useState(false)
  
  // Use global store
  const { 
    currentJob, 
    setCurrentJob, 
    updateCurrentJob, 
    addRecentJob 
  } = useUploadStore()
  
  // Effect to check if there's an ongoing job on load
  useEffect(() => {
    if (currentJob && (currentJob.status === 'pending' || currentJob.status === 'processing')) {
      // Resume polling for an ongoing job
      setIsPolling(true)
      productsService.pollJobStatus(
        currentJob.jobId,
        handleJobStatusUpdate
      ).catch(handlePollingError)
        .finally(() => {
          setIsPolling(false)
        });
    }
  }, []);
  
  // Job status update handler
  const handleJobStatusUpdate = (status: JobStatusResponse) => {
    updateCurrentJob(status);
    
    // If processing completed successfully
    if (status.status === 'completed') {
      setUploadSuccess(true);
      toast({
        title: 'Processing Completed',
        description: status.message || 'Your file has been successfully processed.',
      });
      
      // Add job to history
      addRecentJob(status);
      
      // No automatic redirect - let the user decide what to do next
    }
    
    // If processing failed
    if (status.status === 'failed') {
      toast({
        variant: 'destructive',
        title: 'Processing Failed',
        description: status.message || 'The processing of your file has failed.',
      });
      
      // Add job to history
      addRecentJob(status);
    }
  };
  
  // Polling error handler
  const handlePollingError = (error: Error | unknown) => {
    console.error('Error during polling:', error);
    toast({
      variant: 'destructive',
      title: 'Tracking Error',
      description: 'Unable to track processing status. Please check the product list later.',
    });
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return

      try {
        setIsUploading(true)
        setValidationError(null)
        setCurrentJob(null)
        
        const response = await productsService.uploadFile(acceptedFiles[0])
        
        // Check if response contains validation errors
        if (response.errors && response.errors.length > 0) {
          setValidationError({
            errors: response.errors,
            details: response.details,
            validationRules: response.validationRules,
            suggestions: response.suggestions,
          })
          setIsUploading(false)
          return
        }
        
        // Check if we have a jobId for asynchronous processing
        if (response.jobId) {
          setIsPolling(true)
          
          // Initialize job status
          const initialJobStatus: JobStatusResponse = {
            jobId: response.jobId,
            status: 'pending',
            message: 'Initializing processing...',
            progress: 0
          };
          
          // Update store
          setCurrentJob(initialJobStatus);
          
          // Start polling
          productsService.pollJobStatus(
            response.jobId,
            handleJobStatusUpdate
          ).catch(handlePollingError)
            .finally(() => {
              setIsPolling(false)
              setIsUploading(false)
            });
        } else {
          // Legacy behavior for compatibility
          setUploadSuccess(true)
          toast({
            title: 'Upload successful',
            description: response.message || 'File has been received and will be processed',
          })
          
          // No immediate redirect - let the user decide what to do next
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Upload failed',
          description:
            error instanceof Error
              ? error.message
              : 'An error occurred during upload',
        })
        setIsUploading(false)
      }
    },
    [navigate, toast, setCurrentJob, updateCurrentJob, addRecentJob],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
    disabled: isUploading || uploadSuccess || isPolling,
  })

  // Function to cancel processing and return to initial state
  const handleCancel = () => {
    if (currentJob && (currentJob.status === 'pending' || currentJob.status === 'processing')) {
      // Here you could add an API call to cancel the job if the backend supports it
      toast({
        title: 'Processing Cancelled',
        description: 'You can upload a new file.',
      })
    }
    
    setCurrentJob(null)
    setValidationError(null)
    setUploadSuccess(false)
  }

  return (
    <div className="space-y-8">
      <Toaster />

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Upload Products</h1>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => downloadCSVTemplate()}
          className="flex items-center gap-2"
        >
          <FileDown className="h-4 w-4" />
          Download Template
        </Button>
      </div>

      {uploadSuccess ? (
        <div className="space-y-4">
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertTitle className="text-green-700">Processing Completed</AlertTitle>
            <AlertDescription className="text-green-600">
              {currentJob?.message || "Successfully processed your file."}
              {currentJob?.result && (
                <div className="mt-2">
                  <p>Products processed: {currentJob.result.totalProducts || 0}</p>
                  <p>Materials matched: {currentJob.result.materialsMatched || 0} / Total materials: {currentJob.result.totalMaterials || 0}</p>
                  {currentJob.result.materialsUnmatched && currentJob.result.materialsUnmatched > 0 && (
                    <p>Materials requiring review: {currentJob.result.materialsUnmatched}</p>
                  )}
                </div>
              )}
            </AlertDescription>
          </Alert>
          
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setUploadSuccess(false);
                setCurrentJob(null);
              }}
            >
              Upload New File
            </Button>
            <Button
              variant="default"
              onClick={() => navigate({ to: '/products/list' })}
            >
              View Products
            </Button>
          </div>
        </div>
      ) : currentJob ? (
        <div className="space-y-4">
          <JobStatusProgress 
            status={currentJob.status}
            progress={currentJob.progress}
            message={currentJob.message}
            result={currentJob.result}
          />
          
          {(currentJob.status === 'pending' || currentJob.status === 'processing') && (
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={true}
              >
                Cancel
              </Button>
            </div>
          )}
          
          {currentJob.status === 'completed' && (
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setUploadSuccess(false);
                  setCurrentJob(null);
                }}
              >
                Upload New File
              </Button>
              <Button
                variant="default"
                onClick={() => navigate({ to: '/products/list' })}
              >
                View Products
              </Button>
            </div>
          )}
          
          {currentJob.status === 'failed' && currentJob.errors && currentJob.errors.length > 0 && (
            <CSVValidationError 
              errors={currentJob.errors}
              details={currentJob.details}
              validationRules={currentJob.validationRules}
              suggestions={currentJob.suggestions}
            />
          )}
          
          {currentJob.status === 'failed' && (
            <Card className="p-4 bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Upload className="h-4 w-4" />
                  <span>Try uploading a new file</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => downloadCSVTemplate()}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <FileDown className="h-3 w-3" />
                    Get Template
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="default"
                    size="sm"
                  >
                    Upload New File
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      ) : validationError ? (
        <div className="space-y-4">
          <CSVValidationError 
            errors={validationError.errors}
            details={validationError.details}
            validationRules={validationError.validationRules}
            suggestions={validationError.suggestions}
          />
          
          <Card className="p-4 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Upload className="h-4 w-4" />
                <span>Try uploading a corrected file</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => downloadCSVTemplate()}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <FileDown className="h-3 w-3" />
                  Get Template
                </Button>
                <Button
                  onClick={() => setValidationError(null)}
                  variant="default"
                  size="sm"
                >
                  Upload New File
                </Button>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          <Card className="p-8">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
                          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
                          ${isUploading || isPolling ? 'pointer-events-none' : ''}`}
            >
              <input {...getInputProps()} />
              <div className="space-y-4">
                <div className="text-gray-600">
                  {isUploading ? (
                    <div className="flex flex-col items-center space-y-2">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <p className="text-lg">Uploading file...</p>
                    </div>
                  ) : isDragActive ? (
                    <p className="text-lg">Drop the CSV file here</p>
                  ) : (
                    <>
                      <p className="text-lg">Drag and drop your CSV file here</p>
                      <p className="text-sm">or click to select a file</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>
          
          <div className="flex items-center gap-2 text-sm text-gray-500 p-2">
            <HelpCircle className="h-4 w-4" />
            <p>
              Make sure your CSV file follows the required format. 
              <button 
                onClick={() => downloadCSVTemplate()}
                className="text-blue-600 hover:underline ml-1"
              >
                Download a template
              </button> to get started.
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => navigate({ to: '/products/list' })}
          disabled={isUploading || isPolling}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
