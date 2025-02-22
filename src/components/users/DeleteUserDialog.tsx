import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useUsers } from '@/hooks/useUsers';
import { Loader2 } from 'lucide-react';
import { usersService } from '@/services/users';

interface DeleteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  userId: string;
}

export function DeleteUserDialog({
  open,
  onOpenChange,
  onSuccess,
  userId,
}: DeleteUserDialogProps) {
  const [userName, setUserName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { deleteUser } = useUsers();

  useEffect(() => {
    if (open && userId) {
      setIsLoading(true);
      usersService.getUserById(userId)
        .then(user => {
          setUserName(`${user.firstName} ${user.lastName}`);
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [open, userId]);

  const handleDelete = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await deleteUser(userId);
      onSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {userName}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete User'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 