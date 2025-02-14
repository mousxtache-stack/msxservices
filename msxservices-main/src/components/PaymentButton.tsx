import React from 'react';

const PaymentButton = ({ orderId }: { orderId: string }) => {
  const handlePayment = async () => {
    try {
      // Appel API pour récupérer le lien de paiement
      const response = await fetch('/api/create-payment-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      const data = await response.json();
      
      if (data.paymentLinkUrl) {
        window.location.href = data.paymentLinkUrl; // Redirige l'utilisateur vers le lien de paiement Stripe
      } else {
        alert('Erreur lors de la création du lien de paiement');
      }
    } catch (error) {
      console.error('Erreur lors de la création du lien de paiement', error);
    }
  };

  return (
    <button onClick={handlePayment} className="btn">
      Payer avec Stripe
    </button>
  );
};

export default PaymentButton;
