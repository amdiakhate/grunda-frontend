import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '../../../components/ui/button'
import { Card } from '../../../components/ui/card'
import { useUploadStore } from '../../../stores/uploadStore'
import { productsService } from '../../../services/products'
import { useToast } from '../../../hooks/use-toast'
import { Toaster } from '../../../components/ui/toaster'
import { Loader2 } from 'lucide-react'

export const Route = createFileRoute('/products/steps/upload-file')({
  component: UploadFileRoute,
})

function UploadFileRoute() {
  const navigate = useNavigate()
  const { setUploadResponse } = useUploadStore()
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return

      try {
        setIsUploading(true)
        const response = await productsService.uploadCsv(acceptedFiles[0])
        setUploadResponse(response)
        navigate({ to: '/products/steps/preview' })
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
    [navigate, setUploadResponse, toast],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
    disabled: isUploading,
  })

  return (
    <div className="space-y-8">
      <Toaster />

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Upload Products</h1>
      </div>

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
