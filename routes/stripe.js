const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const Product = require('../models/Product');

router.post("/create-checkout-session", async (req, res) => {
    const items = req.body.items;

    if (!items || items.length === 0) {
        return res.status(400).json({ error: "No items in cart to checkout." });
    }

    const hasInvalidItem = items.some(item => !item.id || !item.quantity);
    if (hasInvalidItem) {
        return res.status(400).json({ error: "One or more items in cart are invalid." });
    }

    try {
        // 1. Retrieve products from the database using the provided IDs.
        const itemIds = items.map(item => item.id);
        const productsInDb = await Product.find({ _id: { $in: itemIds } });

        // 2. Construct lineItems for Stripe.
        let lineItems = items.map(item => {
            const productInDb = productsInDb.find(p => p._id.toString() === item.id);

            if (!productInDb) {
                throw new Error(`Invalid product ID: ${item.id}`);
            }

            return {
                price_data: {
                    currency: "eur",
                    product_data: {
                        name: productInDb.title,
                    },
                    unit_amount: productInDb.price * 100,
                },
                quantity: item.quantity,
            };
        });

        // 3. Create a Stripe session.
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: lineItems,
            success_url: `${process.env.CLIENT_URL}/success.html`,
            cancel_url: `${process.env.CLIENT_URL}/cancel.html`,
        });

        res.json({ url: session.url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
