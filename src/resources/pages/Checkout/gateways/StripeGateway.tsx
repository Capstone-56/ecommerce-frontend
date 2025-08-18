import {
  AddressElement,
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripeClient";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useState, useEffect, useMemo } from "react";
import { userState, cartState, locationState } from "@/domain/state";
import { UserService } from "@/services/user-service";
import type { StripeAddressElementChangeEvent } from "@stripe/stripe-js";
import { Constants } from "@/domain/constants";

type CreateIntentResponse = { clientSecret: string };

const API_BASE = import.meta.env.VITE_API_BASE;

const StripeGateway = () => {
  const cart = cartState((s) => s.cart);
  const userLocation = locationState((s) => s.userLocation);
  const [shipping, setShipping] = useState<any | null>(null);

  const countryToCurrency: Record<string, string> = {
    AU: "AUD",
    US: "USD",
    CA: "CAD",
    SG: "SGD",
    IT: "EUR",
    FR: "EUR",
    DE: "EUR",
  };

  const currency = useMemo(() => {
    const code = (userLocation || "").toUpperCase();
    return countryToCurrency[code] || "USD"; // default to USD
  }, [userLocation]);

  const calculateTotal = (): number =>
    cart.reduce((total, item) => total + item.productItem.product.price * item.quantity, 0);

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
      if (!amount || !userLocation) {
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
        const res = await fetch(`${API_BASE}/api/payments/create-intent`, {
          method: "POST",
          headers,
          credentials: "include",
          body: JSON.stringify({
            amount,
            currency: currency.toLowerCase(),
            country: userLocation,
            cart: cart.map((ci) => ({
              product: { id: ci.productItem.product.id },
              quantity: ci.quantity,
            })),
          }),
        });
        if (!res.ok) throw new Error(await res.text());
        const data: CreateIntentResponse = await res.json();
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

const CheckoutForm = ({
  clientSecret,
  onShippingConfirmed,
}: {
  clientSecret: string | null;
  onShippingConfirmed: (s: any) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const username = userState((s) => s.userName);
  const cart = cartState((state) => state.cart);
  const userLocation = locationState((state) => state.userLocation);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [shippingExpanded, setShippingExpanded] = useState(true);
  const [shippingConfirmed, setShippingConfirmed] = useState(false);

  const [addressComplete, setAddressComplete] = useState(false);

  const [loading, setLoading] = useState(false);

  // map for formatting prices
  const countryToLocale: Record<string, string> = {
    AU: "en-AU",
    US: "en-US",
    CA: "en-CA",
    SG: "en-SG",
    IT: "it-IT",
    FR: "fr-FR",
    DE: "de-DE",
  };

  const countryToCurrency: Record<string, string> = {
    AU: "AUD",
    US: "USD",
    CA: "CAD",
    SG: "SGD",
    IT: "EUR",
    FR: "EUR",
    DE: "EUR",
  };

  const currency = useMemo(() => {
    const code = (userLocation || "").toUpperCase();
    return countryToCurrency[code] || "USD";
  }, [userLocation]);

  const locale = useMemo(() => {
    const code = (userLocation || "").toUpperCase();
    return countryToLocale[code] || "en-US";
  }, [userLocation]);

  const calculateTotal = (): number =>
    cart.reduce((total, item) => total + item.productItem.price * item.quantity, 0);

  const formatTotal = (amount: number): string => {
    const formatted = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(amount);
    const ambiguous = ["USD", "AUD", "CAD", "SGD"];
    return ambiguous.includes(currency)
      ? `${formatted} ${currency}`
      : formatted;
  };

  // Prefill user details
  useEffect(() => {
    (async () => {
      if (!username) return;
      try {
        const userService = new UserService();
        const data = await userService.getUser(username);
        setName(`${data.firstName} ${data.lastName}`);
        setEmail(data.email);
      } catch (e) {
        console.error("Failed to fetch user profile:", e);
      }
    })();
  }, [username]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);

    // PaymentElement handles payment method selection + validation
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        receipt_email: email,
        payment_method_data: { billing_details: { name, email } },
        return_url: `${window.location.origin}${Constants.ORDER_COMPLETE_ROUTE}`,
      },
      redirect: "if_required",
    });

    setLoading(false);

    if (error) {
      console.error(error.message);
      return;
    }
    // Card and other non-redirect have a PI immediately
    if (paymentIntent?.id) {
      window.location.href = `${
        Constants.ORDER_COMPLETE_ROUTE
      }?pi=${encodeURIComponent(paymentIntent.id)}`;
    } else {
      // Redirect methods will land on ORDER_COMPLETE_ROUTE via return_url
      window.location.href = `${Constants.ORDER_COMPLETE_ROUTE}`;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        {/* User details */}
        <Typography variant="h6">Your Details</Typography>
        <TextField
          label="Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Shipping form */}
        <Typography variant="h6" sx={{ mb: 1 }}>
          Shipping
        </Typography>

        <Box sx={{ borderRadius: 2, backgroundColor: "#fafafa" }}>
          <Accordion
            expanded={shippingExpanded}
            onChange={() => setShippingExpanded(!shippingExpanded)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              {shippingConfirmed ? (
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body1">
                    Shipping address confirmed
                  </Typography>
                  <CheckCircleIcon color="success" fontSize="small" />
                </Box>
              ) : (
                <Typography variant="body1">
                  Enter your shipping address
                </Typography>
              )}
            </AccordionSummary>

            <AccordionDetails sx={{ mt: 1 }}>
              <AddressElement
                options={{
                  mode: "shipping",
                  allowedCountries: userLocation
                    ? [userLocation.toUpperCase()]
                    : [],
                }}
                onChange={(e: StripeAddressElementChangeEvent) => {
                  setAddressComplete(e.complete);
                }}
              />
              <Box mt={2} display="flex" justifyContent="flex-end">
                {/* Updated so that confirming shipping address does not validate card details */}
                <Button
                  type="button"
                  variant="contained"
                  disabled={!addressComplete}
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    if (!elements) return;
                    const addressElement = elements.getElement(AddressElement);
                    if (!addressElement) return;

                    const { value } = await addressElement.getValue();
                    onShippingConfirmed(value);

                    setShippingConfirmed(true);
                    setShippingExpanded(false);
                  }}
                >
                  Confirm Shipping Address
                </Button>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>

        {/* Payment form */}
        <Typography variant="h6">Payment</Typography>
        <Box
          sx={{
            border: "1px solid #ccc",
            borderRadius: 2,
            padding: 2,
            backgroundColor: "#fafafa",
          }}
        >
          {!clientSecret ? (
            <Box display="flex" alignItems="center" gap={2}>
              <CircularProgress size={20} />
              <Typography variant="body2">Preparing secure payment…</Typography>
            </Box>
          ) : (
            <PaymentElement options={{ layout: "tabs" }} />
          )}
        </Box>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={
            !name ||
            !email ||
            !stripe ||
            !elements ||
            !shippingConfirmed ||
            !clientSecret ||
            loading
          }
          fullWidth
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            `Pay ${formatTotal(Number(calculateTotal()))}`
          )}
        </Button>
      </Stack>
    </form>
  );
};

export default StripeGateway;

