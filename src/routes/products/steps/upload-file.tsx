import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '../../../components/ui/button'
import { Card } from '../../../components/ui/card'
import { productsService } from '../../../services/products'
import { useToast } from '../../../hooks/use-toast'
import { Toaster } from '../../../components/ui/toaster'
import { Loader2, CheckCircle2, Upload, FileDown, HelpCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '../../../components/ui/alert'
import { CSVValidationError } from '../../../components/ui/csv-validation-error'
import { downloadCSVTemplate } from '../../../utils/download-helpers'

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

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return

      try {
        setIsUploading(true)
        setValidationError(null)
        const response = await productsService.uploadFile(acceptedFiles[0])
        
        if (response.success) {
          setUploadSuccess(true)
          toast({
            title: 'Upload successful',
            description: response.message || 'File has been received and will be processed',
          })
          // Redirect after 2 seconds
          setTimeout(() => {
            navigate({ to: '/products/list' })
          }, 2000)
        } else if (response.errors) {
          // Handle validation errors
          setValidationError({
            errors: response.errors,
            details: response.details,
            validationRules: response.validationRules,
            suggestions: response.suggestions,
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
      } finally {
        setIsUploading(false)
      }
    },
    [navigate, toast],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
    disabled: isUploading || uploadSuccess,
  })

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
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-700">Upload Successful</AlertTitle>
          <AlertDescription className="text-green-600">
            Your file has been received and will be processed by our team.
          </AlertDescription>
        </Alert>
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
                          ${isUploading ? 'pointer-events-none' : ''}`}
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
          disabled={isUploading}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
