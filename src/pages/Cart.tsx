import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { loadStripe } from "@stripe/stripe-js";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { CartItemList } from "@/components/cart/CartItemList";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { PaymentSection } from "@/components/cart/PaymentSection";
import { toast } from "sonner";

const stripePromise = loadStripe('pk_live_51QpqefKbgfBGG4YhIz2mLSr65ooRvnUVWLzjlMeO38HNP4WsZvcOayLjU59J3EdRih2aXRHuAFLTvTEYcA5KobhE004IpsCArt');

interface CartItem {
  id: string;
  service_title: string;
  price: number;
}

// Vérification de la présence de la clé publique Stripe
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
if (!stripePublicKey) {
  console.error('La clé publique Stripe n\'est pas configurée');
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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (!stripePromise) {
      toast.error("Le système de paiement n'est pas correctement configuré.");
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
        toast.success("Paiement réussi ! Votre commande a été validée avec succès.");
        await clearCart();
      }
    } catch (error) {
      console.error("Error checking order status:", error);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;
      setCartItems([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
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
      toast.error("Impossible de charger votre panier.");
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
      toast.success("L'article a été retiré de votre panier.");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Impossible de supprimer l'article.");
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || cartItems.length === 0 || !stripePromise) return;

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
      toast.error("Impossible de valider la commande.");
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

  if (!stripePromise) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Le système de paiement n'est pas correctement configuré.</p>
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