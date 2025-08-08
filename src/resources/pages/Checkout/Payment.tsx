import { useEffect, useState } from "react";
import StripeGateway from "@/resources/pages/Checkout/gateways/StripeGateway";
import { locationState } from "@/domain/state";
import { Typography, Container, Box } from "@mui/material";

// Not the best approach, will need to refactor if we implement more gateways in the future

// all the countries that are directly supported by Stripe
const supportedCountries = [
  "Australia",
  "Canada",
  "Singapore",
  "Italy",
  "France",
  "Germany",
  "UnitedStates",
];

const Payment = () => {
  const userLocation = locationState((state) => state.userLocation);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);

  useEffect(() => {
    if (!userLocation) {
      setIsSupported(false);
    } else {
      setIsSupported(supportedCountries.includes(userLocation));
    }
  }, [userLocation]);

  if (isSupported === null) {
    return null;
  }

  if (!isSupported) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Box textAlign="center">
          <Typography variant="h4" gutterBottom>
            Sorry!
          </Typography>
          <Typography variant="body1">
            Your country (<strong>{userLocation ?? "Unknown"}</strong>) is not yet supported for payments.
          </Typography>
        </Box>
      </Container>
    );
  }

  return <StripeGateway />;
};

export default Payment;
