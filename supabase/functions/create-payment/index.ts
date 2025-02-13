
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import Stripe from 'https://esm.sh/stripe@13.3.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Récupérer la clé secrète Stripe depuis les variables d'environnement
<<<<<<< HEAD
    const stripeSecretKey = Deno.env.get('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');
=======
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
>>>>>>> 2f797ec6778708bca0b2fdc2364c1818e8a3ace1
    if (!stripeSecretKey) {
      throw new Error('La clé secrète Stripe n\'est pas configurée');
    }

    const stripe = new Stripe(stripeSecretKey, {
      httpClient: Stripe.createFetchHttpClient(),
      apiVersion: '2023-10-16', // Utilisation d'une version spécifique de l'API
    });

    const { orderId } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Récupérer la commande
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      throw new Error('Order not found');
    }

    console.log('Création de l\'intention de paiement pour la commande:', orderId);
    console.log('Montant:', order.total_amount);

    // Créer l'intention de paiement Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total_amount * 100), // Conversion en centimes
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      metadata: { orderId: order.id },
    });

    console.log('Intention de paiement créée:', paymentIntent.id);

    // Mettre à jour la commande avec l'ID de l'intention de paiement
    await supabaseClient
      .from('orders')
      .update({ 
        payment_intent_id: paymentIntent.id, 
        payment_status: 'awaiting_payment' 
      })
      .eq('id', orderId);

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erreur dans create-payment:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});