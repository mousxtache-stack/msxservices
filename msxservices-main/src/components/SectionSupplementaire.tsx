import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, FileText, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SectionSupplementaire = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "FAQ & Assistance",
      description: "Trouvez des réponses à vos questions fréquentes.",
      icon: <HelpCircle className="h-6 w-6 text-black-500" />,
      route: "/faq",
    },
    {
      title: "Factures & Paiements",
      description: "Téléchargez vos factures et consultez vos paiements.",
      icon: <FileText className="h-6 w-6 text-blackK-500" />,
      route: "/factures",
    },
    {
      title: "Sécurité & Confidentialité",
      description: "Consultez nos mesures de sécurité et politiques.",
      icon: <ShieldCheck className="h-6 w-6 text-black-500" />,
      route: "/security",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6">
      {sections.map((section, index) => (
        <Card
          key={index}
          className="p-4 cursor-pointer hover:shadow-lg transition-shadow rounded-xl"
          onClick={() => navigate(section.route)}
        >
          <CardHeader className="flex items-center gap-4">
            {section.icon}
            <CardTitle className="text-lg font-semibold">{section.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {section.description}
            </p>
          </CardContent>
        </Card>
        
      ))}
       <div className="h-24" /> {/* Ajoute un espace blanc en bas pour permettre le défilement */}
    </div>

  );
};

export default SectionSupplementaire;
