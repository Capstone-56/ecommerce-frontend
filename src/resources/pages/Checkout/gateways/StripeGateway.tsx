import {
  AddressElement,
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
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
import { useState, useEffect } from "react";
import { UserState, cartState, locationState } from "@/domain/state";
import { UserService } from "@/services/user-service";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardComplete, setCardComplete] = useState(false);

  const [loading, setLoading] = useState(false);
  const username = UserState((state) => state.userName);
  const cart = cartState((state) => state.cart);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [shippingExpanded, setShippingExpanded] = useState(true);
  const [shippingConfirmed, setShippingConfirmed] = useState(false);

  const userLocation = locationState((state) => state.userLocation);

  // all the countries in client's country list that are supported by Stripe
  const countryToCurrency: Record<string, string> = {
    Australia: "AUD",
    UnitedStates: "USD",
    Canada: "CAD",
    Singapore: "SGD",
    Italy: "EUR",
    France: "EUR",
    Germany: "EUR",
  };

  // currency symbols for supported countries
  const currencySymbols: Record<string, string> = {
    USD: "$",
    AUD: "$",
    CAD: "$",
    SGD: "$",
    EUR: "€",
  };

  // map countries to their ISO codes for Stripe's allowedCountries
  const countryToCode: Record<string, string> = {
    Australia: "AU",
    UnitedStates: "US",
    Canada: "CA",
    Singapore: "SG",
    Italy: "IT",
    France: "FR",
    Germany: "DE",
  };

  // map countries to their locale for formatting the price
  const countryToLocale: Record<string, string> = {
    Australia: "en-AU",
    UnitedStates: "en-US",
    Canada: "en-CA",
    Singapore: "en-SG",
    Italy: "it-IT",
    France: "fr-FR",
    Germany: "de-DE",
  };

  const calculateTotal = (): number =>
    cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const formatTotal = (amount: number): string => {
    const currency = countryToCurrency[userLocation || ""] || "USD";
    const locale = countryToLocale[userLocation || ""] || "en-US";

    const formatted = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(amount);

    const ambiguousCurrencies = ["USD", "AUD", "CAD", "SGD"];

    return ambiguousCurrencies.includes(currency)
      ? `${formatted} ${currency}`
      : formatted;
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!username) return;
      try {
        const userService = new UserService();
        const data = await userService.getUser(username);
        setName(`${data.firstName} ${data.lastName}`);
        setEmail(data.email);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };
    fetchUserProfile();
  }, [username]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      alert("This would confirm the payment with backend.");
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <Typography variant="h6">Your Details</Typography>
        {/* User's name and email should autofill */}
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

        <Box
          sx={{
            borderRadius: 2,
            backgroundColor: "#fafafa",
          }}
        >
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
                  allowedCountries:
                    userLocation && countryToCode[userLocation]
                      ? [countryToCode[userLocation]]
                      : [],
                }}
              />
              <Box mt={2} display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  onClick={async () => {
                    if (!elements) return;

                    const result = await elements.submit();
                    if (result.error) {
                      console.error(
                        "Address validation error:",
                        result.error.message
                      );
                      return;
                    }
                    // change accordion summary text once address is confirmed
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

        <Typography variant="h6">Pay by Card</Typography>
        <Box
          sx={{
            border: "1px solid #ccc",
            borderRadius: 2,
            padding: 2,
            backgroundColor: "#fafafa",
          }}
        >
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
            onChange={(event) => {
              setCardComplete(event.complete);
            }}
          />
        </Box>
        {/* Payment button is disabled until both shipping address and 
            card details have been correctly inputted */}
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={!stripe || loading || !shippingConfirmed || !cardComplete}
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

const StripeGateway = () => {
  const [stripePromise] = useState(() =>
    loadStripe(
      "pk_test_51RE12kFZeA9h4jlt8K5dAqH8QnfndYFEJRQ06XzVXpGRl2CezlmuXO7dKTCvJGD4nO7Zau08Dzz2jutRKwuXi8IM00GEYs8CoX"
    )
  );
  return (
    <Elements stripe={stripePromise}>
      <Container maxWidth="sm" sx={{ mt: 6 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom>
            Checkout
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Please enter your shipping and payment details to complete your
            order.
          </Typography>
          <CheckoutForm />
        </Paper>
      </Container>
    </Elements>
  );
};

export default StripeGateway;

