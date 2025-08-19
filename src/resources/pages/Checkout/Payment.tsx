import { JSX, useEffect, useState } from "react";
import StripeGateway from "@/resources/pages/Checkout/gateways/Stripe/StripeGateway";
import { locationState } from "@/domain/state";
import { Typography, Container, Box } from "@mui/material";

const Payment = () => {
  const userLocation = locationState((state) => state.userLocation);
  const [selectedGateway, setSelectedGateway] = useState<JSX.Element | null>(null);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);

  const gatewayMap: Record<string, JSX.Element> = {
    AU: <StripeGateway />,
    CA: <StripeGateway />,
    SG: <StripeGateway />,
    IT: <StripeGateway />,
    FR: <StripeGateway />,
    DE: <StripeGateway />,
    US: <StripeGateway />,
  };

  useEffect(() => {
    if (!userLocation) {
      setIsSupported(false);
      return;
    }

    const gateway = gatewayMap[userLocation.toUpperCase()];
    if (gateway) {
      setSelectedGateway(gateway);
      setIsSupported(true);
    } else {
      setIsSupported(false);
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

  return selectedGateway;
};

export default Payment;
