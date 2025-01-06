import {    useState } from 'react';
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Papa from 'papaparse';
import CSVRow from '../../../interfaces/csvrow';
import { requiredFields } from '../../../interfaces/required-fields';
import { useStore } from '../../../useStore';

export const Route = createLazyFileRoute('/products/steps/upload-file')({
  component: RouteComponent,
});



function RouteComponent() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const setStore = useStore();




  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first!');
      return;
    }

    setUploading(true);
    // if (file.type === 'text/csv') {
    // }
  };



  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="border-2 border-dashed border-gray-200 rounded-lg flex flex-col gap-1 p-6 items-center">
          <FileIcon className="w-12 h-12" />
          <span className="text-sm font-medium text-gray-500">Drag and drop a file here or click to browse</span>
          <span className="text-xs text-gray-500">Only CSV files are accepted</span>
        </div>
        <div className="space-y-2 text-sm">
          <Label htmlFor="file" className="text-sm font-medium">
            File
          </Label>
          <Input id="file" type="file" placeholder="File" accept=".csv" onChange={handleFileChange} />
          {file && <span className="block text-sm text-gray-600">File ready to upload: {file.name}</span>}
        </div>
      </CardContent>
      <CardFooter>
        <Button size="lg" onClick={handleUpload} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>
      </CardFooter>
    </Card>
  )
}

function FileIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  )
}
