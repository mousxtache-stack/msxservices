import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CartItem {
  id: string;
  service_title: string;
  price: number;
}

interface CartItemListProps {
  items: CartItem[];
  onRemoveItem: (id: string) => void;
}

export const CartItemList = ({ items, onRemoveItem }: CartItemListProps) => {
  return (
    <div className="md:col-span-2">
      <Card className="p-6">
        {items.map((item) => (
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
              onClick={() => onRemoveItem(item.id)}
            >
              Supprimer
            </Button>
          </div>
        ))}
      </Card>
    </div>
  );
};