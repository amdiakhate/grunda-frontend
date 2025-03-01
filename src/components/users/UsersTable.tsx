import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { User } from "@/interfaces/user";
import { formatDate } from "@/utils/date";
import { EditUserDialog } from "./EditUserDialog";
import { useAuthContext } from "@/contexts/AuthContext";
import { useNavigate } from "@tanstack/react-router";
import { UserPlus2, Edit2 } from "lucide-react";

interface UsersTableProps {
  users: User[];
  onEditSuccess: () => void;
}

export function UsersTable({ users, onEditSuccess }: UsersTableProps) {
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const { user: currentUser, impersonate } = useAuthContext();
  const navigate = useNavigate();

  const handleImpersonate = async (userId: string) => {
    try {
      await impersonate({ userId });
      navigate({ to: '/dashboard' });
    } catch (error) {
      console.error('Failed to impersonate user:', error);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Dernière connexion</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                {user.firstName} {user.lastName}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Jamais'}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingUserId(user.id)}
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
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <EditUserDialog
        open={!!editingUserId}
        onOpenChange={(open) => !open && setEditingUserId(null)}
        onSuccess={() => {
          setEditingUserId(null);
          onEditSuccess();
        }}
        userId={editingUserId!}
      />
    </>
  );
} 