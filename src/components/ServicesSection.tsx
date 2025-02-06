
import { Code, Smartphone, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

const services = [
  {
    title: "Site Vitrine",
    price: "à partir de 999€",
    description: "Un site élégant pour présenter votre activité",
    icon: Smartphone,
    features: ["Design sur mesure", "Responsive", "Optimisé SEO"],
  },
  {
    title: "E-commerce",
    price: "à partir de 1999€",
    description: "Vendez vos produits en ligne",
    icon: Zap,
    features: ["Paiement sécurisé", "Gestion des stocks", "Interface admin"],
  },
  {
    title: "Application Web",
    price: "sur devis",
    description: "Solutions personnalisées pour votre entreprise",
    icon: Code,
    features: ["Développement sur mesure", "API intégrée", "Support premium"],
  },
];

export const ServicesSection = () => {
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
                {service.price}
              </p>
              <p className="text-secondary/80 mb-6">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
