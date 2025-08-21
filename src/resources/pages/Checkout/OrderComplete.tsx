import { useEffect, useState } from "react";
import { Constants } from "@/domain/constants";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Stack,
  Divider,
  CircularProgress,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import api from "@/api";

type Status = "pending" | "paid" | "failed";
type OrderStatus = {
  status: Status;
  orderId?: number;
  amount?: number;
  currency?: string;
  reason?: string;
};

export default function OrderComplete() {
  const params = new URLSearchParams(window.location.search);
  const pi = params.get("pi") || params.get("payment_intent") || "";
  const [data, setData] = useState<OrderStatus>({ status: "pending" });

  useEffect(() => {
    if (!pi) return;

    let stopped = false;
    const poll = async () => {
      for (let i = 0; i < 30 && !stopped; i++) {
        try {
          const token = localStorage.getItem("token");
          const res = await api.get(`/api/orderstatus`, {
            params: {
              pi: pi
            },
            withCredentials: true, // send cookies for guests
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          });
          if (res.status >= 200 && res.status < 300) {
            const j = res.data;
            setData(j);
            if (j.status === "paid" || j.status === "failed") return;
          }
        } catch (_) {
        }
        await new Promise((r) => setTimeout(r, 2000));
      }
    };
    poll();
    return () => {
      stopped = true;
    };
  }, [pi]);

  const handleContinueShopping = () => {
    window.location.href = Constants.PRODUCTS_ROUTE;
  };
  const handleCheckout = () => {
    window.location.href = Constants.CHECKOUT_ROUTE;
  };

  const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Container maxWidth="sm">
      <Box minHeight="80vh" display="flex" alignItems="center" justifyContent="center">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            width: "100%",
            textAlign: "center",
          }}
        >
          {children}
        </Paper>
      </Box>
    </Container>
  );

  if (!pi) {
    return (
      <Shell>
        <Stack spacing={2} alignItems="center">
          <ErrorOutlineIcon color="warning" sx={{ fontSize: 48 }} />
          <Typography variant="h5" fontWeight={600}>
            Missing order reference
          </Typography>
          <Typography variant="body2" color="text.secondary">
            We couldn’t find your order. Please return to checkout.
          </Typography>
          <Button onClick={handleCheckout} variant="contained" size="large" sx={{ mt: 1 }}>
            Return to Checkout
          </Button>
        </Stack>
      </Shell>
    );
  }

  if (data.status === "pending") {
    return (
      <Shell>
        <Stack spacing={2} alignItems="center">
          <CircularProgress />
          <Typography variant="h5" fontWeight={600}>
            Processing your order…
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This usually takes a few seconds. We’ll update automatically.
          </Typography>
          <Divider sx={{ width: "100%", my: 2 }} />
          <Button onClick={handleContinueShopping} variant="text">
            Continue Shopping
          </Button>
        </Stack>
      </Shell>
    );
  }

  if (data.status === "failed") {
    return (
      <Shell>
        <Stack spacing={2} alignItems="center">
          <ErrorOutlineIcon color="error" sx={{ fontSize: 56 }} />
          <Typography variant="h5" fontWeight={700}>
            Payment failed
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {data.reason || "Please try again or use a different payment method."}
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 1 }}>
            <Button onClick={handleCheckout} variant="contained" size="large">
              Try Again
            </Button>
            <Button onClick={handleContinueShopping} variant="outlined" size="large">
              Continue Shopping
            </Button>
          </Stack>
        </Stack>
      </Shell>
    );
  }

  // success
  return (
    <Shell>
      <Stack spacing={2} alignItems="center">
        <CheckCircleOutlineIcon color="success" sx={{ fontSize: 56 }} />
        <Typography variant="h4" fontWeight={800}>
          Order complete!
        </Typography>
        {typeof data.amount === "number" && data.currency ? (
          <Typography variant="body1" color="text.secondary">
            Charged <strong>{(data.amount / 100).toFixed(2)}</strong>{" "}
            <strong>{data.currency.toUpperCase()}</strong>.
          </Typography>
        ) : null}
        <Divider sx={{ width: "100%", my: 2 }} />
        <Button onClick={handleContinueShopping} variant="contained" size="large">
          Continue Shopping
        </Button>
      </Stack>
    </Shell>
  );
}