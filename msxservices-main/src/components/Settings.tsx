import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { User, Lock, Bell, ShoppingCart, Languages } from "lucide-react"; // Importation d'icônes
import {ThemeSwitcher} from "@/components/ThemeSwitcher";

const Settings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>(user?.user_metadata?.full_name || "");
  const [theme, setTheme] = useState<string>("light");
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("fr");

  const [purchases, setPurchases] = useState<any[]>([]);
  const [loadingPurchases, setLoadingPurchases] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPurchases = async () => {
      setLoadingPurchases(true);
      try {
        const { data, error } = await supabase
          .from("purchases")
          .select("*")
          .eq("user_id", user?.id);
        if (error) throw error;
        setPurchases(data || []);
      } catch (err) {
        console.error("Erreur lors du chargement des achats :", err);
      } finally {
        setLoadingPurchases(false);
      }
    };

    if (user?.id) {
      fetchPurchases();
    }
  }, [user?.id]);

  const handleSaveSettings = async () => {
    setLoading(true);
    setError(null);

    try {
      const updates: { email?: string; password?: string; full_name?: string; theme?: string; notifications?: boolean; language?: string } = {};
      if (email) updates.email = email;
      if (password) updates.password = password;
      if (name) updates.full_name = name;
      if (theme) updates.theme = theme;
      if (notificationsEnabled !== undefined) updates.notifications = notificationsEnabled;
      if (language) updates.language = language;

      if (Object.keys(updates).length === 0) {
        setError("Veuillez remplir au moins un champ.");
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.updateUser(updates);
      if (error) throw error;

      toast.success("Réglages enregistrés avec succès");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement des réglages :", error.message);
      setError("Une erreur est survenue.");
      toast.error("Une erreur est survenue lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Déconnexion réussie");
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
      toast.error("Une erreur est survenue lors de la déconnexion.");
    }
  };

  return (
    <div className="settings-page max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-6">Réglages du profil</h1>

      {/* Section "Compte" */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-primary flex items-center gap-2">
          <User className="w-6 h-6 text-primary" /> Compte
        </h2>
        <Card className="p-6 hover:shadow-lg transition-shadow mt-4 bg-gray-100">
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
              Nom complet
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md mt-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Entrez votre nom complet"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md mt-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Entrez votre email"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md mt-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Entrez votre nouveau mot de passe"
            />
          </div>

          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

          <Button
            onClick={handleSaveSettings}
            disabled={loading}
            className="w-full bg-blue-500 text-white rounded-md mt-4 hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? "Enregistrement..." : "Enregistrer les réglages"}
          </Button>
        </Card>
      </div>

      {/* Section "Sécurité" */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-primary flex items-center gap-2">
          <Lock className="w-6 h-6 text-primary" /> Sécurité
        </h2>
        <Card className="p-6 hover:shadow-lg transition-shadow mt-4 bg-gray-100">
          <div className="mb-6">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="form-checkbox"
              />
              <span className="ml-2">Activer les notifications par email</span>
            </label>
          </div>

          <Button
            onClick={handleSignOut}
            className="w-full bg-gray-600 text-white rounded-md mt-4 hover:bg-gray-700"
          >
            Se déconnecter
          </Button>
        </Card>
      </div>

      {/* Section "Préférences" */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-primary flex items-center gap-2">
          <Languages className="w-6 h-6 text-primary" /> Préférences
        </h2>
        <Card className="p-6 hover:shadow-lg transition-shadow mt-4 bg-gray-100">
          <div className="mb-6">
            <label htmlFor="theme" className="block text-sm font-semibold text-gray-700">
              Thème
            </label>
            <ThemeSwitcher />
          </div>

          <div className="mb-6">
            <label htmlFor="language" className="block text-sm font-semibold text-gray-700">
              Langue
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md mt-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="fr">Français</option>
              <option value="en">Anglais</option>
            </select>
          </div>
        </Card>
      </div>

      {/* Section "Historique des achats" */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-primary flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-primary" /> Historique des achats
        </h2>
        <Card className="p-6 hover:shadow-lg transition-shadow mt-4 bg-gray-100">
          {loadingPurchases ? (
            <p>Chargement...</p>
          ) : (
            <ul>
              {purchases.map((purchase) => (
                <li key={purchase.id} className="mb-4">
                  <div>
                    <strong>Produit :</strong> {purchase.product_name}
                  </div>
                  <div>
                    <strong>Prix :</strong> {purchase.price}€
                  </div>
                  <div>
                    <strong>Date :</strong> {new Date(purchase.created_at).toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Settings;
