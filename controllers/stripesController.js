const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const stripeController = async (req, res) => {
    try {
        const { tour } = req.body;

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
                    unit_amount: Math.round(tour.amount * 100) // Amount in cents
                  },
                  quantity: 1,
                },
              ],
            mode: "payment",
            success_url: "http://localhost:5000?success=true",
            cancel_url: "http://localhost:5000?canceled=true"
        });
        console.log(session)
        res.send({ url: session.url })
    } catch (error) {
        console.error("Error creating Stripe session:", error);
        res.status(500).json({ error: "Failed to create Stripe session" });
    }
};


module.exports = stripeController