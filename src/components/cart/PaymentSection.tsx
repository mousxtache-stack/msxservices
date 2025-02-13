
import { Card } from "@/components/ui/card";
import { Elements } from "@stripe/react-stripe-js";
import { Stripe } from "@stripe/stripe-js";
import { CheckoutForm } from "@/components/CheckoutForm";

interface PaymentSectionProps {
  clientSecret: string;
  stripePromise: Promise<Stripe | null>;
  orderId: string;
}

export const PaymentSection = ({ clientSecret, stripePromise, orderId }: PaymentSectionProps) => {
  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#0f172a',
    },
  };

  return (
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
          <CheckoutForm orderId={orderId} />
        </Elements>
      </Card>
    </div>
  );
};