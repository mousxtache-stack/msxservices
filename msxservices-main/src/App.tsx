import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Cart from "./pages/Cart";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import CreationsList from "@/pages/Creations";
import SettingsPage from "./pages/Settings"; // Assurez-vous d'importer la page des réglages
import { ContactSection } from "./components/ContactSection";
import { Helmet } from 'react-helmet'; // Import de Helmet
import FAQ from "./pages/faq";
import SecurityPrivacy from "./pages/Security";
import DashboardAdminUser from "./components/DashboardAdminUser";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Helmet>
            <title>MSX WebServices</title>
            <object type="image/svg+xml" data="/logo.svg" className="h-12 w-auto"></object>

          </Helmet>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<SettingsPage />} /> {/* Nouvelle route pour les réglages */}
            <Route path="*" element={<NotFound />} />
            <Route path="/creations" element={<CreationsList />} />
            <Route path="/contact" element={<ContactSection />} /> {/* Route pour la section Contact */}
            <Route path="/faq" element={<FAQ />} /> {/* Route pour la section FAQ */}
            <Route path="/Security" element={<SecurityPrivacy />} /> {/* Route pour la section FAQ */}
            <Route path="/DashboardAdminUser" element={<DashboardAdminUser />} /> {/* Route pour la section FAQ */}
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
