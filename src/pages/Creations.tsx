import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import SpotlightCard from '@/components/SpotlightCard'; // Import SpotlightCard
import { Code, LayoutDashboard, Zap, LayoutTemplate, RefreshCcw, ListTodo, Notebook } from "lucide-react";

const creations = [
  {
    id: 1,
    title: "Site de Gestion des Ventes",
    description: "Un site permettant de gérer les ventes de services avec un dashboard interactif.",
    url: "https://webservice-blond.vercel.app/",
    created_at: "2025-02-08",
    icon: Code,
  },
  {
    id: 2,
    title: "Dashboard DDoS",
    description: "Un dashboard en React et Flask pour surveiller les attaques en temps réel. (Vendu)",
    url: "404",
    created_at: "2025-01-28",
    icon: LayoutDashboard,
  },
  {
    id: 3,
    title: "Spoofer HWID",
    description: "Un outil de spoofing avancé pour masquer les informations matérielles d'un PC. (A vendre)",
    url: "https://discord.gg/mousxtache",
    created_at: "2025-01-10",
    icon: Zap,
  },
  {
    id: 5,
    title: "Template JS site",
    description: "Templates de Site internet crée à 90% en JavaScript.",
    url: "https://mousxtache-stack.github.io/website-byme-index/index.html",
    created_at: "2024-07-23",
    icon: LayoutTemplate,
  },
  {
    id: 4,
    title: "Optimisateur PC",
    description: "Un outil de qui optimise un PC.",
    url: "https://discord.gg/MKQg2DNwwj",
    created_at: "2024-10-12",
    icon: Zap,
  },
  {
    id: 6,
    title: "Générateur d'Image",
    description: "Un outil qui génère des images par l'IA.",
    url: "https://vividimagica.lovable.app/",
    created_at: "2025-02-12",
    icon: RefreshCcw,
  },
  {
    id: 7,
    title: "TaskChronos",
    description: "Un outil qui vous permet de noter, et gérer vos tâches, chronologiquement.",
    url: "https://task-chronos.vercel.app/",
    created_at: "2025-02-03",
    icon: ListTodo,
  },
  {
    id: 8,
    title: "Bloc-notes",
    description: "Un outil qui vous permet de créer des notes.",
    url: "https://violet-notescape.lovable.app/auth",
    created_at: "2025-02-12",
    icon: Notebook,
  },
  {
    id: 9,
    title: "Portofolio",
    description: "Un PortoFolio, au cas où vous en auriez besoin.",
    url: "https://mousxtache-stack.github.io/portofolio/",
    created_at: "2025-01-07",
    icon: Zap,
  }
];

const CreationsHero = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Mes Créations</h1>
        <div className="grid md:grid-cols-3 gap-8">
          {creations.length > 0 ? (
            creations.map((creation) => (
              <SpotlightCard
                key={creation.id}
                className="p-6 bg-white hover:shadow-lg transition-shadow animate-fade-in"
                spotlightColor="rgba(0, 229, 255, 0.52)"
              >
                <creation.icon className="h-12 w-12 text-primary mb-4" />
                <h2 className="text-2xl font-bold mb-2">{creation.title}</h2>
                <p className="text-primary font-semibold text-lg mb-4">Créé le: {new Date(creation.created_at).toLocaleDateString()}</p>
                <p className="text-secondary/80 mb-6">{creation.description}</p>
                <Button className="w-full bg-[#33C3F0] text-white hover:bg-[#33C3F0]" asChild>
  <a href={creation.url} target="_blank" rel="noopener noreferrer">Visiter</a>
</Button>

              </SpotlightCard>
            ))
          ) : (
            <p className="text-center">Aucune création trouvée.</p>
          )}
        </div>
        <br />
         <Card className="p-2 hover:shadow-lg transition-shadow animate-fade-in">
          <div className="settings-form">
            <Button
              onClick={() => navigate("/")}
              className="w-full bg-blue-100 text-black rounded-md mt-2 hover:bg-black-100"
            >
              Retour au menu
            </Button>
          </div>
        </Card>
        
      </div>
    </div>
  );
};

export default CreationsHero;
