import { Card } from "@/components/ui/card";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  const [orderList, setOrderList] = useState<Order[]>(orders);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editedCustomerName, setEditedCustomerName] = useState<string>("");
  const [editedTotalAmount, setEditedTotalAmount] = useState<number>(0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "succeeded":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!window.confirm("Es-tu sûr de vouloir supprimer cette commande ?")) return;
  
    const { error } = await supabase
      .from("orders")
      .delete()
      .match({ id: orderId });
  
    if (error) {
      console.error("Erreur lors de la suppression :", error);
      alert("Échec de la suppression.");
    } else {
      console.log("Commande supprimée avec succès !");
      // Mise à jour de l'état local sans récupérer les données de Supabase
      setOrderList((prevList) => prevList.filter((order) => order.id !== orderId));
    }
  };
  

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    setEditedCustomerName(order.customer_name);
    setEditedTotalAmount(order.total_amount);
  };

  const handleSaveEdit = async () => {
    if (!editingOrder) return;

    const { error } = await supabase
      .from("orders")
      .update({
        customer_name: editedCustomerName,
        total_amount: editedTotalAmount,
      })
      .eq("id", editingOrder.id);

    if (error) {
      console.error("Erreur lors de la mise à jour :", error);
      alert("Échec de la modification.");
    } else {
      alert("Commande mise à jour avec succès !");
      setOrderList(
        orderList.map((order) =>
          order.id === editingOrder.id
            ? { ...order, customer_name: editedCustomerName, total_amount: editedTotalAmount }
            : order
        )
      );
      setEditingOrder(null);
    }
  };

  if (orderList.length === 0) {
    return <Card className="p-6 text-center text-gray-500">Aucune commande pour le moment</Card>;
  }

  return (
    <div className="space-y-4">
      {orderList.map((order) => (
        <Card key={order.id} className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">{order.customer_name}</p>
              <p className="text-sm text-gray-500">
                {formatDistance(new Date(order.created_at), new Date(), { addSuffix: true, locale: fr })}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{order.total_amount}€</p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(order.payment_status)}`}>
                {order.payment_status === "succeeded" ? "Payé" : "En attente"}
              </span>
              <div className="mt-2 space-x-2">
                <button className="text-red-600 hover:text-red-800" onClick={() => handleDelete(order.id)}>
                  Supprimer
                </button>
                <button className="text-blue-600 hover:text-blue-800" onClick={() => handleEdit(order)}>
                  Modifier
                </button>
              </div>
            </div>
          </div>
        </Card>
      ))}

      {editingOrder && (
        <div className="mt-4 bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Modifier la commande</h3>
          <div>
            <label className="block text-sm">Nom du client</label>
            <input
              type="text"
              value={editedCustomerName}
              onChange={(e) => setEditedCustomerName(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mt-2">
            <label className="block text-sm">Montant total</label>
            <input
              type="number"
              value={editedTotalAmount}
              onChange={(e) => setEditedTotalAmount(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mt-4 space-x-2">
            <button onClick={handleSaveEdit} className="px-4 py-2 bg-blue-600 text-white rounded">
              Sauvegarder
            </button>
            <button onClick={() => setEditingOrder(null)} className="px-4 py-2 bg-gray-600 text-white rounded">
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
