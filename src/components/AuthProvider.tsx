import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";


interface AuthContextType {
  user: User | null;
  role: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
const fetchUserRole = async (userId: string) => {
  const { data, error } = await supabase
    .from("user_roles") // 🔍 Vérifie bien qu'on interroge la bonne table
    .select("role")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("❌ Erreur récupération rôle:", error);
  } else {
    console.log("✅ Rôle récupéré :", data.role);
    setRole(data.role);
  }
};


    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        console.log("🔍 Utilisateur connecté:", session.user);
        fetchUserRole(session.user.id); // Récupère le rôle
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        console.log("🔍 Changement d'état - Utilisateur :", session.user);
        fetchUserRole(session.user.id);
      } else {
        console.log("❌ Déconnexion détectée");
        setRole(null);
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};


export const sendTestEmail = async () => {
  const user = supabase.auth.user();
  if (!user) {
    alert("Vous devez être connecté pour tester l'email.");
    return;
  }

  const { error } = await supabase.auth.update({
    email: user.email, // On demande à Supabase de renvoyer un email de confirmation
  });

  if (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
    alert("Erreur lors de l'envoi de l'email de test.");
  } else {
    alert("Email de confirmation envoyé !");
  }
};

