import { useEffect, useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/pagination';
import { Loader2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { materialMappingsService } from '@/services/materialMappings';
import { MaterialMappingForm } from '@/components/materials/MaterialMappingForm';
import type {
  MaterialMappingListDto,
  MaterialMappingSearchParams,
  CreateMaterialMappingDto,
  SortField,
} from '@/interfaces/materialMapping';

export const Route = createFileRoute('/admin/material-mappings/')({
  component: MaterialMappingsPage,
});

function MaterialMappingsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [mappings, setMappings] = useState<MaterialMappingListDto[]>([]);
  const [total, setTotal] = useState(0);
  const pageSize = 10;
  const [searchParams, setSearchParams] = useState<MaterialMappingSearchParams>({
    page: 1,
    pageSize,
    search: '',
    sortBy: 'updatedAt',
    sortOrder: 'desc',
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const loadMappings = async () => {
    try {
      setIsLoading(true);
      const response = await materialMappingsService.getAll(searchParams);
      setMappings(response.items);
      setTotal(response.total);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load material mappings"
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMappings();
  }, [searchParams]);

  const handleSearch = (search: string) => {
    setSearchParams(prev => ({ ...prev, search, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({ ...prev, page }));
  };

  const handleSort = (field: SortField) => {
    setSearchParams(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  const getSortIcon = (field: SortField) => {
    if (searchParams.sortBy !== field) {
      return <ArrowUpDown className="h-4 w-4 ml-2" />;
    }
    return searchParams.sortOrder === 'asc' 
      ? <ArrowUp className="h-4 w-4 ml-2" />
      : <ArrowDown className="h-4 w-4 ml-2" />;
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this mapping?')) return;

    try {
      await materialMappingsService.delete(id);
      toast({
        title: "Success",
        description: "Material mapping deleted successfully"
      });
      loadMappings();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete material mapping"
      });
      console.error(error);
    }
  };

  // Générer des lignes vides pour maintenir une hauteur constante
  const emptyRows = pageSize - mappings.length;
  const emptyRowsArray = Array(emptyRows).fill(null);

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Material Mappings</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create New Mapping</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Material Mapping</DialogTitle>
            </DialogHeader>
            <MaterialMappingForm
              onSubmit={async (data) => {
                try {
                  await materialMappingsService.create(data as CreateMaterialMappingDto);
                  toast({
                    title: "Success",
                    description: "Material mapping created successfully"
                  });
                  setIsCreateDialogOpen(false);
                  loadMappings();
                } catch (error) {
                  toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to create material mapping"
                  });
                  console.error(error);
                }
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Search mappings..."
          value={searchParams.search}
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border min-h-[600px] flex flex-col">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button 
                  variant="ghost" 
                  className="h-8 flex items-center gap-1"
                  onClick={() => handleSort('materialPattern')}
                >
                  Pattern
                  {getSortIcon('materialPattern')}
                </Button>
              </TableHead>
              <TableHead>Alternate Names</TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  className="h-8 flex items-center gap-1"
                  onClick={() => handleSort('activityName')}
                >
                  Activity
                  {getSortIcon('activityName')}
                </Button>
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  className="h-8 flex items-center gap-1"
                  onClick={() => handleSort('materialsCount')}
                >
                  Materials Count
                  {getSortIcon('materialsCount')}
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  className="h-8 flex items-center gap-1"
                  onClick={() => handleSort('updatedAt')}
                >
                  Last Updated
                  {getSortIcon('updatedAt')}
                </Button>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-[500px]">
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                </TableCell>
              </TableRow>
            ) : mappings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-[500px]">
                  <div className="flex justify-center items-center h-full text-muted-foreground">
                    No mappings found
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <>
                {mappings.map((mapping) => (
                  <TableRow key={mapping.id}>
                    <TableCell>{mapping.materialPattern}</TableCell>
                    <TableCell>
                      {mapping.alternateNames.map((name) => (
                        <Badge key={name} variant="secondary" className="mr-1">
                          {name}
                        </Badge>
                      ))}
                    </TableCell>
                    <TableCell>
                      {mapping.activityName}
                      {mapping.transformationActivityName && (
                        <div className="text-sm text-gray-500">
                          Transform: {mapping.transformationActivityName}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={mapping.finalProduct ? 'default' : 'secondary'}>
                        {mapping.finalProduct ? 'Final' : 'Intermediate'}
                      </Badge>
                    </TableCell>
                    <TableCell>{mapping.materialsCount}</TableCell>
                    <TableCell>{new Date(mapping.updatedAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link
                          to="/admin/material-mappings/$id"
                          params={{ id: mapping.id }}
                          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                        >
                          Edit
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(mapping.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {emptyRows > 0 && emptyRowsArray.map((_, index) => (
                  <TableRow key={`empty-${index}`}>
                    <TableCell colSpan={7} className="h-[52px]"></TableCell>
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Showing {mappings.length} of {total} mappings
        </div>
        <Pagination
          total={total}
          pageSize={searchParams.pageSize || 10}
          currentPage={searchParams.page || 1}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
} 