
import { Card } from "@/components/ui/card";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";

interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  total_amount: number;
  status: string;
  payment_status: string;
}

interface OrderListProps {
  orders: Order[];
}

export const OrderList = ({ orders }: OrderListProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (orders.length === 0) {
    return (
      <Card className="p-6 text-center text-gray-500">
        Aucune commande pour le moment
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">{order.customer_name}</p>
              <p className="text-sm text-gray-500">
                {formatDistance(new Date(order.created_at), new Date(), {
                  addSuffix: true,
                  locale: fr,
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{order.total_amount}€</p>
              <span 
                className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(order.payment_status)}`}
              >
                {order.payment_status === 'succeeded' ? 'Payé' : 'En attente'}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
