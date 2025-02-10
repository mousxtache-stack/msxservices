import React, { useState, useEffect } from "react";
import { Code, Zap, Trash } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";


const Settings = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [purchaseHistory, setPurchaseHistory] = useState<any[]>([]);
  const [isTestEmailLoading, setIsTestEmailLoading] = useState<boolean>(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState<boolean>(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Récupérer l'email actuel de l'utilisateur et l'historique des achats
  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      fetchPurchaseHistory();
    }
  }, [user]);

  // Fonction pour récupérer l'historique des achats de l'utilisateur
  const fetchPurchaseHistory = async () => {
    if (user) {
      const { data, error } = await supabase
        .from("purchases")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Erreur lors de la récupération de l'historique des achats :", error.message);
        setError("Impossible de récupérer l'historique.");
      } else {
        setPurchaseHistory(data);
      }
    }
  };

  // Fonction de test d'email
  const handleTestEmail = async () => {
    setIsTestEmailLoading(true);
    try {
      const { error } = await supabase.auth.api
        .sendEmailVerification(email);
      if (error) throw error;

      toast({
        title: "Email de test envoyé",
        description: "Un email de test a été envoyé à l'adresse fournie.",
        icon: <Zap />,
        variant: "success",
      });
    } catch (error: any) {
      console.error("Erreur lors de l'envoi de l'email de test :", error.message);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'email de test.",
        icon: <Code />,
        variant: "destructive",
      });
    } finally {
      setIsTestEmailLoading(false);
    }
  };

  // Fonction pour supprimer le compte de l'utilisateur
  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      const { error } = await supabase.auth.api.deleteUser(user.id);
      if (error) throw error;

      toast({
        title: "Compte supprimé",
        description: "Votre compte a été supprimé avec succès.",
        icon: <Trash />,
        variant: "destructive",
      });

      navigate("/auth"); // Redirection après suppression du compte
    } catch (error: any) {
      console.error("Erreur lors de la suppression du compte :", error.message);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le compte.",
        icon: <Code />,
        variant: "destructive",
      });
    } finally {
      setIsDeletingAccount(false);
    }
  };

  // Fonction pour télécharger la facture
  const handleDownloadInvoice = async (purchaseId: number) => {
    try {
      // Requête pour récupérer la facture associée à l'achat
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .eq("purchase_id", purchaseId)
        .single();

      if (error) throw error;

      // Télécharger le fichier facture
      const invoiceFile = data.file_url;
      const a = document.createElement("a");
      a.href = invoiceFile;
      a.download = `facture_${purchaseId}.pdf`;
      a.click();

      toast({
        title: "Téléchargement de la facture",
        description: "La facture est en cours de téléchargement.",
        icon: <Zap />,
        variant: "success",
      });
    } catch (error: any) {
      console.error("Erreur lors du téléchargement de la facture :", error.message);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger la facture.",
        icon: <Code />,
        variant: "destructive",
      });
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    setError(null); // Réinitialiser l'erreur

    try {
      const updates: Record<string, string> = {};

      // Mise à jour de l'email si renseigné
      if (email) updates.email = email;
      // Mise à jour du mot de passe si renseigné
      if (password) updates.password = password;

      if (Object.keys(updates).length === 0) {
        setError("Veuillez remplir au moins un champ.");
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.updateUser(updates);
      if (error) throw error;

      toast({
        title: "Réglages enregistrés",
        description: "Vos informations ont été mises à jour avec succès.",
        icon: <Zap />,
        variant: "success",
      });
      navigate("/dashboard"); // Redirection après mise à jour
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement des réglages :", error.message);
      setError("Une erreur est survenue.");

      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour.",
        icon: <Code />,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page max-w-lg mx-auto p-6">
      
      <h1 className="text-2xl font-semibold text-center mb-6">Réglages du profil</h1>
      <Card className="p-6 hover:shadow-lg transition-shadow animate-fade-in">
        <div className="settings-form">
          {/* Email Field */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md mt-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Entrez votre email"
            />
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md mt-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Entrez votre nouveau mot de passe"
            />
          </div>

          {/* Error Message */}
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

          {/* Save Button */}
          <Button
            onClick={handleSaveSettings}
            disabled={loading}
            className="w-full bg-[rgb(70,200,240)] text-white rounded-md mt-4 hover:bg-[rgb(60,180,220)] disabled:bg-[rgb(150,200,230)]"
          >
            {loading ? "Enregistrement..." : "Enregistrer les réglages"}
          </Button>

          {/* Test Email Button */}
          <Button
            onClick={handleTestEmail}
            disabled={isTestEmailLoading}
            className="w-full bg-[rgb(70,200,240)] text-white rounded-md mt-4 hover:bg-[rgb(60,180,220)] disabled:bg-[rgb(150,200,230)]"
          >
            {isTestEmailLoading ? "Envoi de l'email..." : "Tester l'email"}
          </Button>

          {/* Delete Account Button */}
          <Button
            onClick={handleDeleteAccount}
            disabled={isDeletingAccount}
            className="w-full bg-red-500 text-white rounded-md mt-4 hover:bg-red-600 disabled:bg-red-300"
          >
            {isDeletingAccount ? "Suppression en cours..." : "Supprimer mon compte"}
          </Button>
        </div>
      </Card>
      <br></br>
      <Card className="p-6 hover:shadow-lg transition-shadow animate-fade-in">
        <div className="settings-form">
          {/* Email Field */}
          <div className="mt-6">
            <center>
        <h2 className="text-xl font-semibold">Historique des achats</h2></center>
        
        <ul className="list-disc pl-5 mt-4">
          {purchaseHistory.length === 0 ? (
            <li>Aucun achat effectué.</li>
          ) : (
            purchaseHistory.map((purchase) => (
              <li key={purchase.id} className="mt-2">
                Achat #{purchase.id} - {purchase.date}
                <Button
                  onClick={() => handleDownloadInvoice(purchase.id)}
                  className="ml-4 text-sm"
                >
                  Télécharger la facture
                </Button>
              </li>
            ))
          )}
        </ul>
      </div>
      <div className="mt-6">
      <center>
        <h2 className="text-xl font-semibold">Vos informations personnelles</h2></center>
        <ul className="list-disc pl-5 mt-4">
          <li>Nom : {user.display_name}</li>
          <li>Email : {user.email}</li>
        </ul>
      </div>
      <br></br>
      <div className="mb-6">
      <center>
        <h2 className="text-xl font-semibold">Contactez notre Support</h2></center>
        <ul className="list-disc pl-5 mt-4">
En cas de besoin, sentez vous libre pour nous contactez à l'adresse suivante : clement10600@gmail.com .
        </ul>
      </div>
        </div>
      </Card>
      <br></br>
      <Card className="p-6 hover:shadow-lg transition-shadow animate-fade-in">
  <div className="settings-form">
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
