import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export const EmptyCart = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="p-6 text-center">
      <p>Votre panier est vide</p>
      <Button 
        onClick={() => navigate("/")}
        className="mt-4"
      >
        Retour aux services
      </Button>
    </Card>
  );
};