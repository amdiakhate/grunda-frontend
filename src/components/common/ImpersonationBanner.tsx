import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export function ImpersonationBanner() {
  const { user, isImpersonating, stopImpersonating } = useAuthContext();

  if (!isImpersonating || !user) {
    return null;
  }

  return (
    <div className="bg-yellow-100 border-b border-yellow-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-yellow-800">
        <AlertCircle className="h-5 w-5 flex-shrink-0" />
        <span className="text-sm">
          Vous êtes connecté en tant que {user.firstName} {user.lastName}
          {user.impersonatedBy && ` (impersonné par ${user.impersonatedBy})`}
        </span>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={stopImpersonating}
        className="text-yellow-800 hover:text-yellow-900 border-yellow-300 hover:bg-yellow-200 whitespace-nowrap"
      >
        Arrêter l'impersonation
      </Button>
    </div>
  );
} 