import { HeroSection } from "@/components/HeroSection";
import { ServicesSection } from "@/components/ServicesSection";
import { ContactSection } from "@/components/ContactSection";
import SectionSupplementaire from "@/components/SectionSupplementaire";
import { UserMenu } from "@/components/UserMenu";
import { Scrollbar } from "react-scrollbars-custom";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { useLocation, Link, useNavigate } from "react-router-dom";  // Import de useNavigate ou Link
import Dock from "./Dock"; // Assure-toi que Dock.tsx est bien importé

// Import des icônes
import { VscHome, VscArchive, VscAccount, VscSettingsGear, VscGitStashPop, VscHeart, VscDashboard, VscVmOutline, } from "react-icons/vsc";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import SecurityPrivacy from "./Security";

function App() {
  const location = useLocation();
  const navigate = useNavigate(); // Hook pour la navigation programmatique

  // Définition des éléments du Dock
  const items = [
    {
      icon: <VscHome size={18} />,
      label: "Home",
      onClick: () => navigate("/"),  // Redirection vers Home
    },
    {
      icon: <VscHeart size={18} />,
      label: "Panier",  // Changement du label en "Panier"
      onClick: () => navigate("/cart"),  // Redirection vers Panier
    },
    {
      icon: <MdOutlineSpaceDashboard size={18} />,
      label: "Dashboard",
      onClick: () => navigate("/dashboard"),  // Redirection vers Profile
    },

    {
      icon: <VscSettingsGear size={18} />,
      label: "Settings",
      onClick: () => navigate("/settings"),  // Redirection vers Settings
    },
  ];

  return (
    <div className="min-h-screen bg-white relative">
      {/* Afficher le UserMenu sauf sur la page d'index */}
      {location.pathname !== "/" && (
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-end">
            <UserMenu />
          </div>
        </div>
      )}

      {/* Afficher la navbar sauf sur la page d'index */}
      {location.pathname !== "/" && <Navbar />}

      <Scrollbar style={{ width: "100%", height: "100vh" }}>
        <HeroSection />
        <ServicesSection />
        <ContactSection />
        <SectionSupplementaire />
      </Scrollbar>

      <ScrollToTopButton />

      {/* Dock positionné de manière fixe en bas de l'écran */}
      <div className="fixed bottom-0 left-0 w-full z-10">
        <Dock items={items} panelHeight={68} baseItemSize={50} magnification={70} />
      </div>
    </div>
  );
}

export default App;
