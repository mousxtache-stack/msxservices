import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { OrderList } from "@/components/dashboard/OrderList";
import { useState } from "react";

const Dashboard = () => {
  const { user } = useAuth();
  const [banningUserId, setBanningUserId] = useState(null);

  console.log("Utilisateur connecté:", user);

  const { data: users, isLoading: usersLoading, refetch: refetchUsers } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) throw error;
      return data;
    },
  });

  const logUserConnection = async () => {
    if (!user) return;
  
    const ipRes = await fetch("https://api64.ipify.org?format=json");
    const ipData = await ipRes.json();
    const userIp = ipData.ip;
  
    const { error } = await supabase.from("logs").insert({
      user_id: user.id,
      user_email: user.email,
      ip_address: userIp
    });
  
    if (error) console.error("Erreur lors de l'ajout du log:", error);
  };
  
  const { data: logs, isLoading: logsLoading } = useQuery({
    queryKey: ["logs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("logs").select("*").order("timestamp", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  

  const banUser = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from("profiles")
        .update({ banned: true })
        .eq("id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      refetchUsers();
    }
  });
  

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Dashboard Admin</h1>

        <h2 className="text-2xl font-bold mb-4">Gestion des utilisateurs</h2>
        {usersLoading ? (
          <p>Chargement...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {users?.map((user) => (
              <Card key={user.id} className="p-6">
                <h3 className="text-xl font-semibold">{user.full_name}</h3>
                <p className="text-gray-600">Email: {user.email}</p>
                <p className="text-gray-500">Rôle: {user.role}</p>
                {user.banned ? (
                  <p className="text-red-500">Banni</p>
                ) : (
                  <Button
                    variant="destructive"
                    onClick={() => banUser.mutate(user.id)}
                    disabled={banningUserId === user.id}
                  >
                    Bannir
                  </Button>
                )}
              </Card>
            ))}
          </div>
        )}

        <h2 className="text-2xl font-bold mt-8 mb-4">Logs des connexions</h2>
        {logsLoading ? (
          <p>Chargement...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="border p-2">Utilisateur</th>
                  <th className="border p-2">Adresse IP</th>
                  <th className="border p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {logs?.map((log) => (
                  <tr key={log.id} className="border">
                    <td className="p-2">{log.user_email}</td>
                    <td className="p-2">{log.ip_address}</td>
                    <td className="p-2">{new Date(log.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
