import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripeClient";
import {
  Box,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import { cartState, locationState } from "@/domain/state";
import { Currency, COUNTRY_CURRENCY_MAP } from "@/domain/enum/currency";
import CheckoutForm from "./CheckoutForm";
import api from "@/api";

type CreateIntentResponse = { clientSecret: string };

const StripeGateway = () => {
  const cart = cartState((s) => s.cart);
  const userLocation = locationState((s) => s.userLocation);
  const [shipping, setShipping] = useState<any | null>(null);

  const currency = useMemo(() => {
    const code = (userLocation || "").toUpperCase();
    return COUNTRY_CURRENCY_MAP[code] || Currency.USD;
  }, [userLocation]);

  const calculateTotal = (): number =>
    cart.reduce(
      (total, item) => total + item.productItem.price * item.quantity,
      0
    );

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const elementsOptions = useMemo(
    () =>
      clientSecret
        ? { clientSecret, appearance: { theme: "stripe" as const } }
        : undefined,
    [clientSecret]
  );

  // Create PaymentIntent whenever currency/cart changes
  useEffect(() => {
    const createIntent = async () => {
      const amount = calculateTotal();
      if (!amount) {
        setClientSecret(null);
        return;
      }
      setCreating(true);
      try {
        const token = localStorage.getItem("token");
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
        const res = await api.post(
          `/api/stripe/create-intent`,
          {
            amount,
            currency: currency.toLowerCase(),
            country: userLocation ? userLocation.toLowerCase() : undefined,
            cart: cart.map((ci) => ({
              product: { id: ci.productItem.id },
              quantity: ci.quantity,
            })),
          },
          {
            headers,
            withCredentials: true,
          }
        );
        if (res.status < 200 || res.status >= 300)
          throw new Error(res.data || "Request failed");
        const data: CreateIntentResponse = res.data;
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error("Failed to create PaymentIntent:", err);
        setClientSecret(null);
      } finally {
        setCreating(false);
      }
    };

    createIntent();
  }, [currency, userLocation, cart]);

  if (creating && !clientSecret) {
    return (
      <Container maxWidth="sm" sx={{ mt: 6 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom>
            Checkout
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <CircularProgress size={20} />
            <Typography>Preparing secure payment…</Typography>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Checkout
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Please enter your shipping and payment details to complete your order.
        </Typography>

        {clientSecret && elementsOptions && (
          <Elements
            key={clientSecret}
            stripe={stripePromise}
            options={elementsOptions}
          >
            <CheckoutForm
              clientSecret={clientSecret}
              onShippingConfirmed={setShipping}
            />
          </Elements>
        )}
      </Paper>
    </Container>
  );
};

export default StripeGateway;