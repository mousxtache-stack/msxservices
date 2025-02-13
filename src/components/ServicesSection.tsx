// src/components/ServicesSection.tsx
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SpotlightCard from './SpotlightCard';
import { Button } from "@/components/ui/button";
import { Code, Smartphone, Zap, LayoutDashboard, Cloud, Sparkles, Brush, Globe, Landmark, GalleryVerticalEnd, GalleryVertical } from "lucide-react";
import { useState } from "react";
import ScrollToTopButton from "./ScrollToTopButton"; // Importation du composant ScrollToTopButton
import { Scrollbar } from 'react-scrollbars-custom'; // Importation correcte
import SpotlightCard2 from './SpotlightCard2'; 

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
  {
    title: "Dashboard DDoS",
    price: 100,
    displayPrice: "à partir de 100€",
    description: "Surveillez les attaques en temps réel",
    icon: LayoutDashboard,
    features: ["Détection et alertes", "Gestion des règlements", "Support premium"],
  },
  {
    title: "Portofolio Simple",
    price: 25,
    displayPrice: "à partir de 25€",
    description: "Portofolio pour vous exprimez !",
    icon: GalleryVertical,
    features: ["Analyse et suivi", "Automatisation des transactions", "Assistance avancée"],
  },
  {
    title: "Portofolio Complexe",
    price: 50,
    displayPrice: "à partir de 50€",
    description: "Portofolio pour vous exprimez !",
    icon: GalleryVerticalEnd,
    features: ["Personnalisation dynamique", "Optimisation", "Accès au 'features' du Portofolio Simple"],
  },
];

const otherServices = [
  {
    title: "HWID Spoofer",
    price: 20,
    displayPrice: "à partir de 20€",
    description: "Masquer les informations matérielles de votre PC",
    icon: Cloud,
    features: ["Anonyme", "Sécurisé", "Haute disponibilité"],
  },
  {
    title: "PC Optimization",
    price: 15,
    displayPrice: "à partir de 15€",
    description: "Optimisation PC pour améliorer vos performances",
    icon: Zap,
    features: ["Rapidité", "Performances", "Stratégie d'optimisation"],
  },
  {
    title: "Intégration API",
    price: 40,
    displayPrice: "à partir de 40€",
    description: "Intégration d'API variées pour votre site",
    icon: Landmark,
    features: ["Stripe", "Paypal", "Carte de crédit"],
  },
  {
    title: "Design Figma",
    price: 20,
    displayPrice: "à partir de 20€",
    description: "Un design Figma en fonction de vos besoins",
    icon: Brush,
    features: ["Rapidité", "Choix", "Conversion"],
  },
  {
    title: "Modification de site Web",
    price: 30,
    displayPrice: "à partir de 30€/mois",
    description: "Modification de votre site web de votre choix",
    icon: Globe,
    features: ["Modification", "Choix", "Assistance Premium"],
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
    <>
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl font-bold mb-4">Nos Services</h2>
            <p className="text-xl text-secondary/80">Des solutions adaptées à vos besoins</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service) => (
              <SpotlightCard
                key={service.title}
                className="p-6 bg-white hover:shadow-lg transition-shadow animate-fade-in"
                spotlightColor="rgba(0, 229, 255, 0.52)"
              >
                <service.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                <p className="text-xl font-semibold text-primary mb-4">{service.displayPrice}</p>
                <p className="text-secondary/80 mb-6">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button onClick={() => handleAddToCart(service)} className="w-full">
                  Ajouter au panier
                </Button>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      <section id="other-services" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl font-bold mb-4">Autres Services</h2>
            <p className="text-xl text-secondary/80">Des services complémentaires pour vous aider</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {otherServices.map((service) => (
              <SpotlightCard
                key={service.title}
                className="p-6 bg-white hover:shadow-lg transition-shadow animate-fade-in"
                spotlightColor="rgba(0, 229, 255, 0.52)"
              >
                <service.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                <p className="text-xl font-semibold text-primary mb-4">{service.displayPrice}</p>
                <p className="text-secondary/80 mb-6">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button onClick={() => handleAddToCart(service)} className="w-full">
                  Ajouter au panier
                </Button>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* Le bouton pour remonter */}
      <ScrollToTopButton />
    </>
  );
};
