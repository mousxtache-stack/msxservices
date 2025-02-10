
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, isAdmin: false });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkUserRole = async (userId: string) => {
      const { data, error } = await supabase
        .rpc('has_role', { role: 'admin' });
      
      if (error) {
        console.error('Error checking user role:', error);
        return false;
      }
      return data;
    };

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const isUserAdmin = await checkUserRole(session.user.id);
        setIsAdmin(isUserAdmin);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const isUserAdmin = await checkUserRole(session.user.id);
        setIsAdmin(isUserAdmin);
      } else {
        setIsAdmin(false);
        if (location.pathname === '/dashboard') {
          navigate('/auth');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

  // Protect dashboard route
  useEffect(() => {
    if (!loading && location.pathname === '/dashboard' && !isAdmin) {
      toast.error("Accès non autorisé. Vous devez être administrateur pour accéder au dashboard.");
      navigate('/');
    }
  }, [loading, isAdmin, location.pathname, navigate]);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
