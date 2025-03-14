import { createFileRoute } from '@tanstack/react-router'
import { useUploadStore } from '../../stores/useUploadStore'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import { CheckCircle2, AlertCircle, Clock, ArrowRight, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { JobStatus } from '../../services/products'
import { useToast } from '../../hooks/use-toast'
import { Toaster } from '../../components/ui/toaster'

export const Route = createFileRoute('/products/upload-history')({
  component: UploadHistoryRoute,
})

function UploadHistoryRoute() {
  const { recentJobs, clearRecentJobs } = useUploadStore()
  const { toast } = useToast()
  
  // Function to get icon and color based on status
  const getStatusInfo = (status: JobStatus) => {
    switch (status) {
      case 'completed':
        return {
          icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
          color: 'text-green-700',
          bgColor: 'bg-green-50',
          label: 'Completed'
        }
      case 'failed':
        return {
          icon: <AlertCircle className="h-4 w-4 text-red-500" />,
          color: 'text-red-700',
          bgColor: 'bg-red-50',
          label: 'Failed'
        }
      case 'pending':
        return {
          icon: <Clock className="h-4 w-4 text-yellow-500" />,
          color: 'text-yellow-700',
          bgColor: 'bg-yellow-50',
          label: 'Pending'
        }
      case 'processing':
        return {
          icon: <Clock className="h-4 w-4 text-blue-500" />,
          color: 'text-blue-700',
          bgColor: 'bg-blue-50',
          label: 'Processing'
        }
      default:
        return {
          icon: <Clock className="h-4 w-4" />,
          color: 'text-gray-700',
          bgColor: 'bg-gray-50',
          label: 'Unknown'
        }
    }
  }
  
  // Function to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date'
    
    try {
      const date = new Date(dateString)
      return format(date, 'MMMM dd, yyyy at HH:mm', { locale: enUS })
    } catch {
      return dateString
    }
  }
  
  // Function to clear history
  const handleClearHistory = () => {
    clearRecentJobs()
    toast({
      title: 'History Cleared',
      description: 'The processing history has been cleared.',
    })
  }

  return (
    <div className="space-y-8">
      <Toaster />
      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Processing History</h1>
        {recentJobs.length > 0 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleClearHistory}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear History
          </Button>
        )}
      </div>
      
      {recentJobs.length === 0 ? (
        <Card className="p-8 text-center text-gray-500">
          <p>No recent processing to display.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {recentJobs.map((job) => {
            const statusInfo = getStatusInfo(job.status)
            
            return (
              <Card key={job.jobId} className={`p-4 ${statusInfo.bgColor} border`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {statusInfo.icon}
                      <span className={`font-medium ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                      <span className="text-sm text-gray-500">
                        {job.jobId}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600">
                      {job.message || 'No message'}
                    </p>
                    
                    {job.createdAt && (
                      <p className="text-xs text-gray-500">
                        {formatDate(job.createdAt)}
                      </p>
                    )}
                    
                    {job.result && (
                      <div className="text-xs text-gray-600 mt-2">
                        <p>Products: {job.result.totalProducts || 0}</p>
                        <p>Materials: {job.result.totalMaterials || 0} (matched: {job.result.materialsMatched || 0})</p>
                      </div>
                    )}
                  </div>
                  
                  {job.status === 'completed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className={`bg-white flex items-center gap-1`}
                      onClick={() => window.location.href = '/products/list'}
                    >
                      View Products
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
} 