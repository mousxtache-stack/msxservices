import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import Particles from './Particles';
import { useNavigate } from 'react-router-dom';  // Importer useNavigate pour la navigation

export const HeroSection = () => {
  const { user } = useAuth();
  const userName = user?.email ? user.email.split("@")[0] : "Utilisateur";
  const navigate = useNavigate(); // Initialiser le hook useNavigate

  const handleRedirect = () => {
    navigate("/creations");  // Utiliser navigate pour rediriger vers /creations
  };

  const smoothScroll = (targetY: number, duration = 300) => {
    const startY = window.scrollY;
    const diff = targetY - startY;
    let startTime: number | null = null;
  
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      window.scrollTo(0, startY + diff * progress);
  
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
  
    requestAnimationFrame(step);
  };

  const handleScrollToServices = () => {
    const section = document.getElementById("services");
    if (section) {
      const topOffset = section.getBoundingClientRect().top + window.scrollY;
      smoothScroll(topOffset);
    }
  };

  return (
    <section className="min-h-screen relative overflow-hidden bg-muted">
      {/* Conteneur flex avec deux sections */}
      <div className="flex w-full h-full">
        {/* Partie gauche - fond Particles */}
        <div className="w-full h-full absolute left-0 top-0 z-0">
          <Particles
            particleColors={['#000000', '#000000']}
            particleCount={200}
            particleSpread={10}
            speed={0.1}
            particleBaseSize={100}
            moveParticlesOnHover={true}
            alphaParticles={false}
            disableRotation={false}
          />
        </div>

        {/* Partie droite - texte */}
        <div className="w-full md:w-1/2 absolute flex flex-col items-center justify-center text-center z-10 px-4 top-0 bottom-0 left-1/2 transform -translate-x-1/2">
          {/* Message de bienvenue */}
          <div className="text-3xl font-semibold text-black mb-6">
            Bienvenue <span className="font-bold">{userName}</span>
          </div>

          <div className="max-w-3xl mx-auto animate-slide-up">
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
              <Button size="lg" className="bg-black hover:bg-gray" onClick={handleScrollToServices}>
                Découvrir nos services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <div className="hero-section">
                <Button size="lg" variant="outline" onClick={handleRedirect}>
                  Voir nos réalisations
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
