
import { Code, Smartphone, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";

const services = [
  {
    title: "Site Vitrine",
    price: 999,
    displayPrice: "à partir de 999€",
    description: "Un site élégant pour présenter votre activité",
    icon: Smartphone,
    features: ["Design sur mesure", "Responsive", "Optimisé SEO"],
  },
  {
    title: "E-commerce",
    price: 1999,
    displayPrice: "à partir de 1999€",
    description: "Vendez vos produits en ligne",
    icon: Zap,
    features: ["Paiement sécurisé", "Gestion des stocks", "Interface admin"],
  },
  {
    title: "Application Web",
    price: 2999,
    displayPrice: "sur devis",
    description: "Solutions personnalisées pour votre entreprise",
    icon: Code,
    features: ["Développement sur mesure", "API intégrée", "Support premium"],
  },
];

export const ServicesSection = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async (service: typeof services[0]) => {
    if (!user) {
      navigate("/auth");
      return;
    }

    try {
      const { error } = await supabase.from("cart_items").insert({
        user_id: user.id,
        service_title: service.title,
        price: service.price,
      });

      if (error) throw error;

      toast({
        title: "Service ajouté au panier",
        description: `${service.title} a été ajouté à votre panier.`,
      });
      
      // Navigate to cart after adding item
      navigate("/cart");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le service au panier.",
      });
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl font-bold mb-4">Nos Services</h2>
          <p className="text-xl text-secondary/80">
            Des solutions adaptées à vos besoins
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card key={service.title} className="p-6 hover:shadow-lg transition-shadow animate-fade-in">
              <service.icon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
              <p className="text-xl font-semibold text-primary mb-4">
                {service.displayPrice}
              </p>
              <p className="text-secondary/80 mb-6">{service.description}</p>
              <ul className="space-y-2 mb-6">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button 
                onClick={() => handleAddToCart(service)}
                className="w-full"
              >
                Ajouter au panier
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
