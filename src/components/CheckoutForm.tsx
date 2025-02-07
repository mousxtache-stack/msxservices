
import { useState, useEffect } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface CheckoutFormProps {
  orderId: string;
}

export const CheckoutForm = ({ orderId }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/cart?orderId=${orderId}`,
        },
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Erreur de paiement",
          description: error.message,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du paiement.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isLoading}
        className="w-full"
      >
        {isLoading ? "Traitement..." : "Payer"}
      </Button>
    </form>
  );
};
