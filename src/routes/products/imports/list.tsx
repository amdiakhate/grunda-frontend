import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react';
import { Import } from '../../../interfaces/import';
import { productsService } from '../../../services/products';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
export const Route = createFileRoute('/products/imports/list')({
  component: RouteComponent,
})

function RouteComponent() {

  const [importFiles, setImports] = useState<Import[]>([]);

  useEffect(() => {
    const fetchImports = async () => {
      const importFiles = await productsService.getImports();
      setImports(importFiles);
    };
    fetchImports();
  }, []);

  if(importFiles.length === 0) {
    return <div>No imports found</div>
  }

  return (
    <>
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Imports</h1>
        </div>
      <div className="rounded-md border p-4 mt-4 w-full">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Filename</TableHead>
            <TableHead>Number of Products</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {importFiles.map(importFile => (
            <TableRow key={importFile.id}>
              <TableCell>{importFile.filename}</TableCell>
              <TableCell>{importFile.numberOfProducts}</TableCell>
              {/* <TableCell>{importFile.createdAt.toLocaleDateString()}</TableCell> */}
            </TableRow>
          ))}
          </TableBody>
        </Table>
      </div>

    </> 
  )


  return <div>Hello "/products/imports/list"!</div>
}
