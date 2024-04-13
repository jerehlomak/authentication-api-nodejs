const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createStripeSession = async (tour) => {
  const my_domain = 'https://tripescape.ng/'
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
              price_data: {                 
                currency: 'ngn',
                product_data: {         
                  name: tour.name,
                  images: tour.images
                },
                unit_amount: tour.amount * 100 // Amount in cents
              },
              quantity: 1,
            },
          ],
        mode: "payment",
        success_url: `${my_domain}/success`,
        cancel_url: `${my_domain}/cancel`
    });
    return session.id;
};

const stripeController = async (req, res) => {
    try {
        const { tour } = req.body;

        const sessionId = await createStripeSession(tour);
        res.json({ id: sessionId });
    } catch (error) {
        console.error("Error creating Stripe session:", error);
        res.status(500).json({ error: "Failed to create Stripe session" });
    }
};

module.exports = stripeController;
