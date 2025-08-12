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
import { UserState, cartState, locationState } from "@/domain/state";
import { UserService } from "@/services/user-service";

type CreateIntentResponse = { clientSecret: string };

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
    cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

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
        // need to update this with actual API endpoint when its ready
        const res = await fetch("/api/payments/xxxxxxxx", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount,
            currency: currency.toLowerCase(),
            country: userLocation,
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
    <Elements stripe={stripePromise} options={elementsOptions}>
      <Container maxWidth="sm" sx={{ mt: 6 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom>
            Checkout
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Please enter your shipping and payment details to complete your
            order.
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
    </Elements>
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

  const username = UserState((state) => state.userName);
  const cart = cartState((state) => state.cart);
  const userLocation = locationState((state) => state.userLocation);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [shippingExpanded, setShippingExpanded] = useState(true);
  const [shippingConfirmed, setShippingConfirmed] = useState(false);

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
    cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

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
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        receipt_email: email,
        payment_method_data: { billing_details: { name, email } },
      },
      redirect: "if_required",
    });

    setLoading(false);

    if (error) {
      console.error(error.message);
      return;
    }

    alert(
      "Payment confirmed client-side. Need to show order status page, and use webhooks to confirm the status"
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
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
              />
              <Box mt={2} display="flex" justifyContent="flex-end">
                <Button
                  type="button"
                  variant="contained"
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    if (!elements) return;
                    const result = await elements.submit(); // validates AddressElement
                    if (result.error) {
                      console.error(
                        "Address validation error:",
                        result.error.message
                      );
                      return;
                    }

                    // Get the actual shipping address data from AddressElement
                    const addressElement = elements.getElement(AddressElement);
                    if (addressElement) {
                      const { value } = await addressElement.getValue();
                      onShippingConfirmed(value);
                    }

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
