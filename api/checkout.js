const Stripe = require('stripe');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const origin = 'https://' + req.headers.host;
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: 1900,
            product_data: { name: 'Audit complet Rayon Abo' }
          },
          quantity: 1
        }
      ],
      success_url: origin + '/merci.html',
      cancel_url: origin + '/paiement.html'
    });
    res.status(200).json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: 'checkout_failed' });
  }
};
