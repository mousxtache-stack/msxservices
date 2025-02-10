
import { Card } from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { OrderList } from "@/components/dashboard/OrderList";

const Dashboard = () => {
  const { user } = useAuth();
  
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-2">Profil</h2>
            <p className="text-gray-600">{profile?.full_name || 'Non renseigné'}</p>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-2">Commandes</h2>
            <p className="text-gray-600">{orders?.length || 0} commande(s)</p>
          </Card>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Historique des commandes</h2>
          {ordersLoading ? (
            <p>Chargement...</p>
          ) : (
            <OrderList orders={orders || []} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
