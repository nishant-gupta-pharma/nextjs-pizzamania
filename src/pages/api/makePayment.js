import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16", // specify version for consistency
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { cartItems, deliveryPrice } = req.body;

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: "Invalid cart data" });
    }

    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
          metadata: {
            id: item.id || "unknown",
          },
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity || 1,
    }));

    // ✅ Append delivery charge if provided
    if (deliveryPrice && deliveryPrice > 0) {
      lineItems.push({
        price_data: {
          currency: "inr",
          product_data: {
            name: "Delivery Fee",
          },
          unit_amount: Math.round(deliveryPrice * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${req.headers.origin}/cart?status=success`,
      cancel_url: `${req.headers.origin}/cart?status=cancel`,
      locale: "auto",
      currency: "inr",
    });

    return res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("Stripe session error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
