
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <section className="min-h-[80vh] flex items-center justify-center relative overflow-hidden bg-muted">
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-3xl mx-auto text-center animate-slide-up">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary">
            Création de sites web premium
          </span>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-secondary">
            Donnez vie à votre présence en ligne
          </h1>
          <p className="text-xl mb-8 text-secondary/80">
            Des sites web modernes, rapides et optimisés pour convertir vos visiteurs en clients
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Découvrir nos services
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Voir nos réalisations
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
