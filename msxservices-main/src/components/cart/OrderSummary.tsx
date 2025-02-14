
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OrderSummaryProps {
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  isSubmitting: boolean;
  onCustomerNameChange: (value: string) => void;
  onCustomerEmailChange: (value: string) => void;
  onCustomerPhoneChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const OrderSummary = ({
  totalAmount,
  customerName,
  customerEmail,
  customerPhone,
  isSubmitting,
  onCustomerNameChange,
  onCustomerEmailChange,
  onCustomerPhoneChange,
  onSubmit,
}: OrderSummaryProps) => {
  return (
    <div>
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Récapitulatif</h2>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span>Total</span>
            <span className="font-semibold">{totalAmount}€</span>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="customerName">Nom complet</Label>
            <Input
              id="customerName"
              value={customerName}
              onChange={(e) => onCustomerNameChange(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="customerEmail">Email</Label>
            <Input
              id="customerEmail"
              type="email"
              value={customerEmail}
              onChange={(e) => onCustomerEmailChange(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="customerPhone">Téléphone (optionnel)</Label>
            <Input
              id="customerPhone"
              type="tel"
              value={customerPhone}
              onChange={(e) => onCustomerPhoneChange(e.target.value)}
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
  );
};