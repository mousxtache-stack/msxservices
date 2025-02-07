
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { loadStripe } from "@stripe/stripe-js";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { CartItemList } from "@/components/cart/CartItemList";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { PaymentSection } from "@/components/cart/PaymentSection";

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
        setCartItems([]);
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
      const totalAmount = cartItems.reduce((sum, item) => sum + item.price, 0);

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

      const orderItems = cartItems.map((item) => ({
        order_id: orderData.id,
        service_title: item.service_title,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      const { data: paymentData, error: paymentError } = await supabase.functions
        .invoke('create-payment', {
          body: { orderId: orderData.id }
        });

      if (paymentError) throw new Error(paymentError.message);
      if (!paymentData?.clientSecret) throw new Error('No client secret received');

      setClientSecret(paymentData.clientSecret);
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Votre Panier</h1>
        
        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : clientSecret ? (
          <PaymentSection 
            clientSecret={clientSecret}
            stripePromise={stripePromise}
            orderId={currentOrderId!}
          />
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <CartItemList 
              items={cartItems}
              onRemoveItem={handleRemoveItem}
            />
            <OrderSummary 
              totalAmount={totalAmount}
              customerName={customerName}
              customerEmail={customerEmail}
              customerPhone={customerPhone}
              isSubmitting={isSubmitting}
              onCustomerNameChange={setCustomerName}
              onCustomerEmailChange={setCustomerEmail}
              onCustomerPhoneChange={setCustomerPhone}
              onSubmit={handleSubmitOrder}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
