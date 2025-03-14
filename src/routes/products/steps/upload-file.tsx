import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '../../../components/ui/button'
import { productsService } from '../../../services/products'
import { useToast } from '../../../hooks/use-toast'
import { Toaster } from '../../../components/ui/toaster'
import { CheckCircle2, FileDown } from 'lucide-react'
import { CSVValidationError } from '../../../components/ui/csv-validation-error'
import { downloadCSVTemplate } from '../../../utils/download-helpers'
import { useUploadStore } from '../../../stores/useUploadStore'

export const Route = createFileRoute('/products/steps/upload-file')({
  component: UploadFileRoute,
})

// Page de succès statique
function SuccessPage({ onBackToDashboard }: { onBackToDashboard: () => void }) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Upload products</h1>
      </div>
      
      <div className="border rounded-lg p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="bg-green-500 rounded-full p-2 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">File successfully uploaded</h2>
            <div className="space-y-2 text-gray-600">
              <p>We received your file.</p>
              <p>Our algorithms will start mapping your materials before a final review by our scientists.</p>
              <p>Please allow us 48 hours for the whole process.</p>
              <p className="mt-4">We'll email you when your data is ready.</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <Button
            variant="outline"
            onClick={onBackToDashboard}
            className="flex items-center gap-2"
          >
            Back to dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}

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
  
  // Use global store
  const { setCurrentJob } = useUploadStore()

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
        
        // Set upload as successful
        setUploadSuccess(true)
        setIsUploading(false)
        
        // Store job ID if available
        if (response.jobId) {
          setCurrentJob({
            jobId: response.jobId,
            status: 'completed',
            message: 'File successfully uploaded'
          })
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
    [navigate, toast, setCurrentJob],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
    disabled: isUploading || uploadSuccess,
  })

  // Function to reset state for a new upload
  const handleNewUpload = () => {
    setUploadSuccess(false)
    setCurrentJob(null)
    setValidationError(null)
  }
  
  // Function to navigate to dashboard
  const handleBackToDashboard = () => {
    navigate({ to: '/dashboard' })
  }

  // Si l'upload est réussi, afficher la page de succès
  if (uploadSuccess) {
    return <SuccessPage onBackToDashboard={handleBackToDashboard} />;
  }

  return (
    <div className="space-y-8">
      <Toaster />

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Upload products</h1>
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

      {validationError ? (
        <div className="space-y-4">
          <CSVValidationError 
            errors={validationError.errors}
            details={validationError.details}
            validationRules={validationError.validationRules}
            suggestions={validationError.suggestions}
          />
          
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={handleNewUpload}
            >
              Try Again
            </Button>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'
          } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          
          {isUploading ? (
            <div className="py-4">
              <div className="flex justify-center mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
              <p className="text-lg font-medium">Uploading your file...</p>
              <p className="text-sm text-gray-500">Please wait while we process your file.</p>
            </div>
          ) : isDragActive ? (
            <div className="py-8">
              <p className="text-lg font-medium text-primary">Drop your CSV file here</p>
            </div>
          ) : (
            <div className="py-8">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-lg font-medium">
                Drag and drop your CSV file here, or click to browse
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Supported format: CSV
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
