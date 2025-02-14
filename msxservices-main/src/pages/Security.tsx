import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SecurityPrivacy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Sécurité & Confidentialité</h1>
        
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Nos engagements en matière de sécurité</h2>
          <p className="text-gray-600">
            Nous utilisons les dernières technologies pour garantir la protection de vos données. Toutes les transactions
            sont sécurisées et chiffrées selon les normes les plus strictes.
          </p>
        </Card>
        
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Protection des données personnelles</h2>
          <p className="text-gray-600">
            Vos informations personnelles sont stockées en toute sécurité et ne sont jamais partagées sans votre consentement.
            Consultez notre politique de confidentialité pour plus de détails.
          </p>
        </Card>
        
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Mesures contre la fraude</h2>
          <p className="text-gray-600">
            Nous surveillons en permanence les activités suspectes et utilisons des mécanismes de détection avancés pour prévenir
            toute tentative de fraude.
          </p>
        </Card>
      </div>
      <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => window.location.href = "/"}>Retour à l'accueil</Button>
        </div>
    </div>
  );
};

export default SecurityPrivacy;
