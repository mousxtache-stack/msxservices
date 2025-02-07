
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CheckoutForm } from "@/components/CheckoutForm";

const stripePromise = loadStripe("pk_test_51OsC74LZMGFXxyWFKcLxW5oWk4Vy4WJUPRnkS0PmghGGZT5ZuRxkrTVHv7fBQfGkJ8JuURFcPR60tSLUNWW2JtB400Wc4sJqAV");

interface CartItem {
  id: string;
  service_title: string;
  price: number;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchCartItems();
    
    // Check for order status after payment
    const orderId = searchParams.get("orderId");
    if (orderId) {
      checkOrderStatus(orderId);
    }
  }, [user, navigate, searchParams]);

  const checkOrderStatus = async (orderId: string) => {
    try {
      const { data: order, error } = await supabase
        .from("orders")
        .select("payment_status")
        .eq("id", orderId)
        .single();

      if (error) throw error;

      if (order.payment_status === "succeeded") {
        toast({
          title: "Paiement réussi !",
          description: "Votre commande a été validée avec succès.",
        });
        setCartItems([]); // Clear cart after successful payment
      }
    } catch (error) {
      console.error("Error checking order status:", error);
    }
  };

  const fetchCartItems = async () => {
    try {
      const { data, error } = await supabase
        .from("cart_items")
        .select("*")
        .order("created_at");

      if (error) throw error;

      setCartItems(data || []);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger votre panier.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", itemId);

      if (error) throw error;

      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
      toast({
        title: "Article supprimé",
        description: "L'article a été retiré de votre panier.",
      });
    } catch (error) {
      console.error("Error removing item:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer l'article.",
      });
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || cartItems.length === 0) return;

    setIsSubmitting(true);
    try {
      // Calculate total amount
      const totalAmount = cartItems.reduce((sum, item) => sum + item.price, 0);

      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          total_amount: totalAmount,
          status: "pending",
          payment_status: "pending"
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map((item) => ({
        order_id: orderData.id,
        service_title: item.service_title,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Initialize payment
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          orderId: orderData.id,
        }),
      });

      const { clientSecret, error: paymentError } = await response.json();
      if (paymentError) throw new Error(paymentError);

      setClientSecret(clientSecret);
      setCurrentOrderId(orderData.id);

    } catch (error) {
      console.error("Error submitting order:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de valider la commande.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price, 0);

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#0f172a',
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Votre Panier</h1>
        
        {cartItems.length === 0 ? (
          <Card className="p-6 text-center">
            <p>Votre panier est vide</p>
            <Button 
              onClick={() => navigate("/")}
              className="mt-4"
            >
              Retour aux services
            </Button>
          </Card>
        ) : clientSecret ? (
          <div className="max-w-md mx-auto">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Paiement</h2>
              <Elements 
                stripe={stripePromise} 
                options={{ 
                  clientSecret,
                  appearance
                }}
              >
                <CheckoutForm orderId={currentOrderId!} />
              </Elements>
            </Card>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card className="p-6">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-4 border-b last:border-0"
                  >
                    <div>
                      <h3 className="font-medium">{item.service_title}</h3>
                      <p className="text-sm text-gray-600">{item.price}€</p>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      Supprimer
                    </Button>
                  </div>
                ))}
              </Card>
            </div>

            <div>
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Récapitulatif</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span className="font-semibold">{totalAmount}€</span>
                  </div>
                </div>

                <form onSubmit={handleSubmitOrder} className="space-y-4">
                  <div>
                    <Label htmlFor="customerName">Nom complet</Label>
                    <Input
                      id="customerName"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="customerEmail">Email</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="customerPhone">Téléphone (optionnel)</Label>
                    <Input
                      id="customerPhone"
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "En cours..." : "Procéder au paiement"}
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
