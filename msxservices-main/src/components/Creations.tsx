import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const creations = [
  {
    id: 1,
    title: "Site de Gestion des Ventes",
    description: "Un site permettant de gérer les ventes de services avec un dashboard interactif.",
    url: "https://mon-site-ventes.com",
    created_at: "2025-02-12",
  },
  {
    id: 2,
    title: "Dashboard DDoS",
    description: "Un dashboard en React et Flask pour surveiller les attaques en temps réel.",
    url: "https://mon-dashboard-ddos.com",
    created_at: "2025-01-28",
  },
  {
    id: 3,
    title: "Spoofer HWID",
    description: "Un outil de spoofing avancé pour masquer les informations matérielles d'un PC.",
    url: "https://mon-spoofer-hwid.com",
    created_at: "2025-01-10",
  },
];

const CreationsHero = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Mes Créations</h1>
        <Button onClick={() => navigate("/")} className="mb-6 bg-gray-500 text-white hover:bg-gray-600">
          Retour au menu
        </Button>
        <div className="grid md:grid-cols-3 gap-8">
          {creations.length > 0 ? (
            creations.map((creation) => (
              <Card key={creation.id} className="p-6 hover:shadow-lg transition-shadow animate-fade-in">
                <h2 className="text-xl font-semibold mb-2">{creation.title}</h2>
                <p className="text-gray-600 mb-2">{creation.description}</p>
                <p className="text-gray-500 text-sm">Créé le: {new Date(creation.created_at).toLocaleDateString()}</p>
                <Button className="mt-4 w-full bg-blue-500 text-white hover:bg-blue-600" asChild>
                  <a href={creation.url} target="_blank" rel="noopener noreferrer">Visiter</a>
                </Button>
              </Card>
            ))
          ) : (
            <p>Aucune création trouvée.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreationsHero;
