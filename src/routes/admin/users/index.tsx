import { createFileRoute } from '@tanstack/react-router';
import { useState, useCallback, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useUsers } from '@/hooks/useUsers';
import { UserRole } from '@/interfaces/user';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { CreateUserDialog } from '@/components/users/CreateUserDialog';
import { EditUserDialog } from '@/components/users/EditUserDialog';
import { DeleteUserDialog } from '@/components/users/DeleteUserDialog';
import { Loader2, Plus, Search, UserPlus2, Edit2, Trash2 } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/users/')({
  component: UsersPage,
});

function UsersPage() {
  return (
    <ProtectedRoute requireAdmin>
      <UsersList />
    </ProtectedRoute>
  );
}

function UsersList() {
  const [page, setPage] = useState(1);
  const [role, setRole] = useState<UserRole | 'all'>('all');
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const pageSize = 10;

  const { users, loading, total, fetchUsers } = useUsers();
  const { user: currentUser, impersonate } = useAuthContext();
  const navigate = useNavigate();

  // Charger les utilisateurs avec les filtres
  const loadUsers = useCallback(() => {
    fetchUsers({
      page,
      pageSize,
      role: role === 'all' ? undefined : role,
      search: search || undefined,
    });
  }, [fetchUsers, page, pageSize, role, search]);

  // Chargement initial
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Gérer la recherche
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadUsers();
  };

  // Gérer le changement de rôle
  const handleRoleChange = (value: string) => {
    setRole(value as UserRole | 'all');
    setPage(1);
    loadUsers();
  };

  const handleImpersonate = async (userId: string) => {
    try {
      await impersonate({ userId });
      navigate({ to: '/dashboard' });
      // Force reload to ensure all contexts are updated
      window.location.reload();
    } catch (error) {
      console.error('Failed to impersonate user:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </form>
        <Select value={role} onValueChange={handleRoleChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="CUSTOMER">Customer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="ml-2">Loading users...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedUserId(user.id);
                          setIsEditOpen(true);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      {currentUser?.role === 'ADMIN' && user.role === 'CUSTOMER' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleImpersonate(user.id)}
                        >
                          <UserPlus2 className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedUserId(user.id);
                          setIsDeleteOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Showing {users.length} of {total} users
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setPage((p) => Math.max(1, p - 1));
            }}
            disabled={page === 1 || loading}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setPage((p) => p + 1);
            }}
            disabled={page * pageSize >= total || loading}
          >
            Next
          </Button>
        </div>
      </div>

      <CreateUserDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={() => {
          setIsCreateOpen(false);
          loadUsers();
        }}
      />

      {selectedUserId && (
        <>
          <EditUserDialog
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            userId={selectedUserId}
            onSuccess={() => {
              setIsEditOpen(false);
              setSelectedUserId(null);
              loadUsers();
            }}
          />
          <DeleteUserDialog
            open={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
            userId={selectedUserId}
            onSuccess={() => {
              setIsDeleteOpen(false);
              setSelectedUserId(null);
              loadUsers();
            }}
          />
        </>
      )}
    </div>
  );
} 