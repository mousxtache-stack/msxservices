import { useNavigate } from "react-router-dom";
import { UserRound, ShoppingCart, Settings, LogOut } from "lucide-react";  // Ajout des icônes
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/AuthProvider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";  // Assurez-vous que supabase est correctement importé

export const UserMenu = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();  // Se déconnecter de Supabase
      navigate("/auth");  // Redirige l'utilisateur vers la page de connexion
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
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
        {/* Panier */}
        <DropdownMenuItem 
          onClick={() => handleNavigate("/cart")} 
          className="flex items-center gap-2  hover:text-white hover:bg-red-500"
        >
          <ShoppingCart className="h-5 w-5" />
          Panier
        </DropdownMenuItem>

        {/* Dashboard */}
        <DropdownMenuItem 
          onClick={() => handleNavigate("/dashboard")} 
          className="flex items-center gap-2  hover:text-white hover:bg-red-500"
        >
          <UserRound className="h-5 w-5" />
          Dashboard
        </DropdownMenuItem>

        {/* Réglages */}
        <DropdownMenuItem 
          onClick={() => handleNavigate("/settings")} 
          className="flex items-center gap-2  hover:text-white hover:bg-red-500"
        >
          <Settings className="h-5 w-5" />
          Réglages
        </DropdownMenuItem>

        {/* Se déconnecter */}
        <DropdownMenuItem 
          onClick={handleLogout} 
          className="flex items-center gap-2 text-red-500  hover:text-white hover:bg-red-500"
        >
          <LogOut className="h-5 w-5" />
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
