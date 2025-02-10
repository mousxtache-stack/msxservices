import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import Stripe from 'https://esm.sh/stripe@13.3.0'

// PayPal API URL (Sandbox ou Live)
const PAYPAL_API = Deno.env.get('PAYPAL_ENV') === 'live' 
  ? 'https://api.paypal.com' 
  : 'https://api.sandbox.paypal.com';

// Récupérer les clés PayPal
const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID') || '';
const PAYPAL_SECRET = Deno.env.get('PAYPAL_SECRET') || '';

// Fonction pour récupérer un token PayPal
async function getPayPalToken() {
  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });
  
  const data = await response.json();
  return data.access_token;
}

// Fonction pour créer un paiement PayPal
async function createPayPalOrder(orderId: string, totalAmount: number) {
  const token = await getPayPalToken();

  const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'EUR',
          value: totalAmount.toFixed(2)
        }
      }]
    })
  });

  const data = await response.json();
  return data;
}

// Initialisation Stripe
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { orderId, paymentMethod } = await req.json();

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

    let responsePayload;

    if (paymentMethod === 'stripe') {
      // 🔵 PAIEMENT STRIPE
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(order.total_amount * 100),
        currency: 'eur',
        automatic_payment_methods: { enabled: true },
        metadata: { orderId: order.id },
      });

      await supabaseClient
        .from('orders')
        .update({ payment_intent_id: paymentIntent.id, payment_status: 'awaiting_payment' })
        .eq('id', orderId);

      responsePayload = { clientSecret: paymentIntent.client_secret };

    } else if (paymentMethod === 'paypal') {
      // 🟡 PAIEMENT PAYPAL
      const paypalOrder = await createPayPalOrder(orderId, order.total_amount);

      if (!paypalOrder.id) {
        throw new Error('Failed to create PayPal order');
      }

      await supabaseClient
        .from('orders')
        .update({ payment_intent_id: paypalOrder.id, payment_status: 'awaiting_payment' })
        .eq('id', orderId);

      responsePayload = { paypalOrderId: paypalOrder.id };

    } else {
      throw new Error('Invalid payment method');
    }

    return new Response(
      JSON.stringify(responsePayload),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
