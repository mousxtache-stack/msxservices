
import { useNavigate } from "react-router-dom";
import { UserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/AuthProvider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const UserMenu = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  if (!user) {
    return (
      <button
        onClick={() => handleNavigate("/auth")}
        className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900"
      >
        <UserRound className="h-6 w-6" />
        <span>Se connecter</span>
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="inline-flex items-center gap-2">
          <Avatar>
            <AvatarFallback>
              <UserRound className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => handleNavigate("/cart")}>
          Panier
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleNavigate("/dashboard")}>
          Dashboard
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
