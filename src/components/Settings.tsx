
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Settings = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSaveSettings = async () => {
    setLoading(true);
    setError(null);

    try {
      const updates: { email?: string; password?: string } = {};
      if (email) updates.email = email;
      if (password) updates.password = password;

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

  return (
    <div className="settings-page max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-semibold text-center mb-6">Réglages du profil</h1>
      <Card className="p-6 hover:shadow-lg transition-shadow animate-fade-in">
        <div className="settings-form">
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

          <Button
            onClick={() => navigate("/")}
            className="w-full bg-gray-500 text-white rounded-md mt-4 hover:bg-gray-600"
          >
            Retour au menu
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
