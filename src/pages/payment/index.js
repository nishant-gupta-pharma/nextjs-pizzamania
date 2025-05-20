// pages/payment.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { loadStripe } from "@stripe/stripe-js";
import { QRCodeCanvas } from "qrcode.react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function Payment() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [step, setStep] = useState("choose");
  const [timer, setTimer] = useState(120); // 2 minutes in seconds

  const stored = localStorage.getItem("paymentCart");
  const delivery = localStorage.getItem("deliveryPrice");
  useEffect(() => {
    if (!stored) return router.replace("/cart");

    const parsed = JSON.parse(stored);
    const deliveryPrice = delivery ? parseFloat(delivery) : 0;
    const subtotal = parsed.reduce((sum, item) => sum + item.price, 0);
    const totalWithDelivery = subtotal + deliveryPrice;

    setCartItems(parsed);
    setTotal(totalWithDelivery);
  }, [delivery, router, stored]);

  const payWithStripe = async () => {
    setStep("card");
    const stripe = await stripePromise;
    const res = await fetch("/api/makePayment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartItems, deliveryPrice: delivery }),
    });
    const { id } = await res.json();
    await stripe?.redirectToCheckout({ sessionId: id });
  };

  const handleQR = () => {
    setStep("qr");

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.replace("/cart?status=failed"); // Simulate failed payment
        }
        return prev - 1;
      });
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      router.replace("/cart?status=success"); // Simulate successful payment
    }, 10000); // Simulate payment success in 10 seconds
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const sec = (seconds % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  const upiString = `upi://pay?pa=merchant@upi&pn=DemoShop&am=${total}&cu=INR`;

  return (
    <div
      style={{
        minHeight: "90vh",
        backgroundImage:
          'url("https://png.pngtree.com/thumb_back/fh260/background/20241017/pngtree-abstract-wireframe-of-a-digital-online-payment-concept-with-a-hand-image_16404163.jpg")',
        backgroundSize: "cover",
      }}
      className="flex justify-center items-center flex-col pr-160"
    >
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        {step === "choose" && (
          <>
            <h1 className="text-3xl font-bold text-gray-300 mb-4">
              Choose Payment Method
            </h1>
            <div className="flex gap-4">
              <button
                onClick={payWithStripe}
                className="cursor-pointer border dark:border-gray-400 border-gray-900 rounded p-3 bg-gradient-to-r from-indigo-700 via-violet-700 to-orange-700 text-white hover:bg-opacity-90"
              >
                Pay with Card
              </button>
              <button
                onClick={handleQR}
                className="cursor-pointer border dark:border-gray-400 border-gray-900 rounded p-3 bg-gradient-to-r from-indigo-700 via-violet-700 to-orange-700 text-white hover:bg-opacity-90"
              >
                Pay with UPI / QR
              </button>
            </div>
          </>
        )}

        {step === "card" && (
          <div className="text-center bg-white bg-opacity-90 p-8 rounded-lg shadow-xl max-w-sm w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Redirecting to Card Payment...
            </h2>
            <div className="text-sm text-gray-600">
              Please wait while we redirect you securely to Stripe
            </div>
            <div className="mt-6 flex justify-center">
              <svg
                className="animate-spin h-8 w-8 text-indigo-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            </div>
          </div>
        )}

        {step === "qr" && (
          <div className="text-center bg-white bg-opacity-90 p-8 rounded-lg shadow-xl max-w-sm w-full">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              Scan to Pay ₹{total.toFixed(2)}
            </h2>
            <QRCodeCanvas value={upiString} size={220} />
            <p className="mt-4 text-gray-600 text-sm">
              Waiting for confirmation… ({formatTime(timer)})
            </p>
            <p className="mt-4 text-gray-600 text-sm">Scan with any UPI app</p>
            <p className="mt-1 text-xs text-gray-400">
              This will timeout after 2 minutes
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
