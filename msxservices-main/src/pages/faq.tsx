import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqData = [
  {
    question: "Comment passer une commande ?",
    answer:
      "Pour passer une commande, ajoutez les services souhaités à votre panier puis finalisez le paiement."
  },
  {
    question: "Quels sont les modes de paiement acceptés ?",
    answer:
      "Nous acceptons les paiements par carte bancaire, et virement bancaire sécurisé."
  },
  {
    question: "Puis-je obtenir une facture ?",
    answer:
      "Une facture peut vous être fournis, mais pas instantanément après l'achat."
  },
  {
    question: "Comment contacter le support ?",
    answer:
      "Vous pouvez nous contacter via notre formulaire en ligne ou par email à clement10600@gmail.com ."
  },
  {
    question: "Quels sont les délais de traitement des commandes ?",
    answer:
      "Les délais varient en fonction du service commandé. En général, vous recevrez une confirmation sous 24 à 48 heures."
  },
  {
    question: "Puis-je modifier ou annuler ma commande après paiement ?",
    answer:
      "Non, une fois la commande validée, elle ne peut pas être modifiée ou annulée. Assurez-vous de bien vérifier vos choix avant de finaliser votre achat."
  },
  {
    question: "Mes informations personnelles sont-elles sécurisées ?",
    answer:
      "Oui, nous utilisons des protocoles de sécurité avancés pour garantir la confidentialité et la protection de vos données personnelles."
  },
  {
    question: "Proposez-vous des remises ou des codes promo ?",
    answer:
      "Non, peut être si MSX Services se développe."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Foire Aux Questions</h1>
      <div className="space-y-4">
        {faqData.map((item, index) => (
          <Card
            key={index}
            className="p-4 cursor-pointer hover:shadow-lg transition"
            onClick={() => toggleFAQ(index)}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">{item.question}</h2>
              {openIndex === index ? <ChevronUp /> : <ChevronDown />}
            </div>
            {openIndex === index && (
              <p className="mt-2 text-gray-600 animate-fade-in">{item.answer}</p>
            )}
          </Card>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Button variant="outline" onClick={() => window.history.back()}>
          Retour
        </Button>
      </div>
    </div>
  );
};

export default FAQ;
