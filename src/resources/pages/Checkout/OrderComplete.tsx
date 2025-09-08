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
  Card,
  CardContent,
  Grid,
  Avatar,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import api from "@/api";
import { OrderStatusModel } from "@/domain/models/OrderModel";
import { cartState } from "@/domain/state";

export default function OrderComplete() {
  const params = new URLSearchParams(window.location.search);
  const pi = params.get("pi") || params.get("payment_intent") || "";
  const [data, setData] = useState<OrderStatusModel>({ status: "pending" });
  const clearCart = cartState((state) => state.clearCart);
  const [cartCleared, setCartCleared] = useState(false);

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
            
            // Clear cart when payment is successful and we haven't cleared it yet
            if (j.status === "paid" && !cartCleared) {
              clearCart();
              // To clear the cart when authed user checks out
              window.dispatchEvent(new CustomEvent(Constants.EVENT_CART_UPDATED));
              setCartCleared(true);
            }
            
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
          elevation={4}
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
  {/* Order Summary */}
  const OrderSummary: React.FC<{ data: OrderStatusModel }> = ({ data }) => {
    if (!data.order || !data.address || !data.shippingVendor) return null;

    const { order, address, shippingVendor } = data;
    const customerName = order.user 
      ? `${order.user.firstName} ${order.user.lastName}`
      : order.guestUser 
      ? `${order.guestUser.firstName} ${order.guestUser.lastName}`
      : "Customer";

    return (
      <Box sx={{ mt: 3, textAlign: "left" }}>
        <Divider sx={{ mb: 3 }} />
        
        {/* Order Items */}
        <Typography variant="h6" gutterBottom>
          Order Items
        </Typography>
        <Stack spacing={2} sx={{ mb: 3 }}>
          {order.items.map((item) => (
            <Card key={item.id} variant="outlined">
              <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid size={{xs:"auto"}}>
                    {item.productItem.imageUrls && Array.isArray(item.productItem.imageUrls) && item.productItem.imageUrls.length > 0 ? (
                      <Avatar
                        src={item.productItem.imageUrls[0]}
                        sx={{ width: 60, height: 60 }}
                        variant="rounded"
                      />
                    ) : (
                      <Avatar sx={{ width: 60, height: 60 }} variant="rounded">
                        {item.productItem.product.name[0]}
                      </Avatar>
                    )}
                  </Grid>
                  <Grid size={{xs:"auto"}}>
                    <Typography variant="body1" fontWeight="medium">
                      {item.productItem.product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quantity: {item.quantity}
                    </Typography>
                  </Grid>
                  <Grid size={{xs:"auto"}}>
                    <Typography variant="body1" fontWeight="medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Stack>

        {/* Shipping Info */}
        <Typography variant="h6" gutterBottom>
          Shipping Details
        </Typography>
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
            <Stack spacing={1}>
              <Box display="flex" alignItems="center" gap={1}>
                <LocalShippingIcon color="primary" fontSize="small" />
                <Typography variant="body1" fontWeight="medium">
                  {shippingVendor.name}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {customerName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {address.addressLine}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {address.city}, {address.state} {address.postcode}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {address.country}
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        {/* Order Total */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Total
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            ${order.totalPrice.toFixed(2)} {data.currency?.toUpperCase()}
          </Typography>
        </Box>
      </Box>
    );
  };

  // no payment intent found
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
  // while order is pending
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
        </Stack>
      </Shell>
    );
  }
  // if the payment failed
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
        {data.order ? (
          <Typography variant="body1" color="text.secondary">
            Order <strong>#{data.order.id.slice(-8)}</strong> has been confirmed.
          </Typography>
        ) : null}
        <OrderSummary data={data} />
        <Divider sx={{ width: "100%", my: 2 }} />
        <Button onClick={handleContinueShopping} variant="contained" size="large">
          Continue Shopping
        </Button>
      </Stack>
    </Shell>
  );
}