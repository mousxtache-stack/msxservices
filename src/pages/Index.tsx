
import { HeroSection } from "@/components/HeroSection";
import { ServicesSection } from "@/components/ServicesSection";
import { UserMenu } from "@/components/UserMenu";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-end">
          <UserMenu />
        </div>
      </div>
      <HeroSection />
      <ServicesSection />
    </div>
  );
};

export default Index;
