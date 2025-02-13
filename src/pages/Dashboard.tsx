import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { OrderList } from "@/components/dashboard/OrderList";

const Dashboard = () => {
  const { user } = useAuth();
  
  console.log("Utilisateur connecté:", user);

  // Récupération du profil (avec le rôle)
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) {
        console.error("Erreur récupération du profil:", error);
        throw error;
      }
      
      console.log("Profil récupéré:", data);
      return data;
    },
    enabled: !!user,
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["orders", profile?.role], // On suit aussi le rôle pour réactualiser si besoin
    queryFn: async () => {
      if (!profile) {
        console.warn("Profil non encore chargé, attente...");
        return [];
      }
  
      if (profile.role === "admin") {
        console.log("Admin détecté, récupération de toutes les commandes...");
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });
  
        if (error) {
          console.error("Erreur récupération commandes (Admin):", error);
          throw error;
        }
  
        console.log("Commandes récupérées (Admin):", data);
        return data;
      } else {
        console.log("Utilisateur normal, récupération des commandes personnelles...");
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user?.id)
          .order("created_at", { ascending: false });
  
        if (error) {
          console.error("Erreur récupération commandes (Utilisateur):", error);
          throw error;
        }
  
        console.log("Commandes récupérées (Utilisateur):", data);
        return data;
      }
    },
    enabled: !!user && profile !== undefined,
  });

  const { data: editors, isLoading: editorsLoading } = useQuery({
    queryKey: ["editors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("editors") // 🔥 Table "editors"
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erreur récupération des éditeurs:", error);
        throw error;
      }

      console.log("Éditeurs récupérés:", data);
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {profileLoading ? (
          <p>Chargement du profil...</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-2">Profil</h2>
              <p className="text-gray-600">{profile?.full_name || "Non renseigné"}</p>
              <p className="text-gray-600 font-semibold">Rôle: {profile?.role}</p>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-2">Commandes</h2>
              <p className="text-gray-600">{orders?.length || 0} commande(s)</p>
            </Card>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Historique des commandes</h2>
          {ordersLoading ? (
            <p>Chargement...</p>
          ) : (
            <OrderList orders={orders || []} />
          )}
        </div>

        {/* Affichage des éditeurs */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Éditeurs</h2>
          {editorsLoading ? (
            <p>Chargement des éditeurs...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {editors?.map((editor) => (
                <Card key={editor.id} className="p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold">{editor.name}</h3>
                  <p className="text-gray-600">{editor.email}</p>
                  <p className="text-gray-500">Ajouté le : {new Date(editor.created_at).toLocaleDateString()}</p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
