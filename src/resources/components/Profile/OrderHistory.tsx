import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Chip,
  Divider,
  Stack,
  Collapse,
  IconButton,
} from "@mui/material";
import {
  AttachMoney,
  CreditCard,
  Payment,
  Store,
  LocalShipping,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";

// TODO: consider moving these to the model data types file
// TODO: component-erise item cards and order cards
// Example data types
type PaymentMethod = "Card" | "Cash";
type OrderType = "Online (Credit Card)" | "In-Store";

interface OrderItem {
  name: string;
  details: string;
  image: string;
  price: number;
  info?: Record<string, string>;
}

interface Order {
  id: string;
  orderType: OrderType;
  paymentMethod: PaymentMethod;
  date: string;
  items: OrderItem[];
  cardLast4?: string;
  cardType?: string;
  storeLocation?: string;
  tax: number;
  shipping: number;
  total: number;
}

const orders: Order[] = [
  {
    id: "ORD-001",
    orderType: "Online (Credit Card)",
    paymentMethod: "Card",
    date: "2025-08-20",
    cardLast4: "1234",
    cardType: "Visa",
    tax: 12.5,
    shipping: 10.0,
    total: 272.49,
    items: [
      {
        name: "Wireless Headphones",
        details: "Noise Cancelling, Model X200",
        image:
          "https://www.jbhifi.com.au/cdn/shop/files/812874-Product-0-I-638827703403543800.jpg",
        price: 199.99,
        info: { Color: "Black", Size: "Standard" },
      },
      {
        name: "Bluetooth Speaker",
        details: "Portable, 20W Output",
        image:
          "https://www.jbhifi.com.au/cdn/shop/products/640437-Product-0-I-638229016204101882_bbbe489f-088c-43ea-99ba-8b7bc3809b7b.jpg",
        price: 49.99,
        info: { Color: "Blue" },
      },
    ],
  },
  {
    id: "ORD-002",
    orderType: "In-Store",
    paymentMethod: "Cash",
    date: "2025-07-15",
    storeLocation: "BDNX, 123 Sample St, Sydney NSW",
    tax: 0.0,
    shipping: 0.0,
    total: 299.99,
    items: [
      {
        name: "Smart Watch",
        details: "Fitness tracking, Model S5",
        image:
          "https://www.jbhifi.com.au/cdn/shop/products/665845-Product-0-I-638307611405584735.jpg",
        price: 299.99,
        info: { Color: "Gold", Band: "Leather" },
      },
    ],
  },
];

// Probably need to bring this up
const formatCurrency = (amount: number) =>
  amount.toLocaleString("en-AU", { style: "currency", currency: "AUD" });

/**
 *
 * @description Page for users to view their purchasing history
 */
const OrderHistory: React.FC = () => {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const handleExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <Box sx={{ maxWidth: { md: "700px" }, p: { xs: 1, md: 4 }, width: "100%" }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Order History
      </Typography>
      <Stack spacing={3} sx={{ width: "100%" }}>
        {orders.map((order) => {
          const isExpanded = expandedOrder === order.id;
          return (
            <Paper key={order.id} sx={{ p: 3, width: "100%" }}>
              {/* Summary Card */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                }}
                onClick={() => handleExpand(order.id)}
              >
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Order ID: {order.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Date: {order.date}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{ fontWeight: "bold" }}
                  >
                    {formatCurrency(order.total)}
                  </Typography>
                  <IconButton size="small">
                    {isExpanded ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Box>
              </Box>

              {/* Expanded view */}
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <Divider sx={{ my: 2 }} />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    mb: 2,
                    gap: 2,
                  }}
                >
                  <Stack direction="row" spacing={1}>
                    <Chip
                      icon={
                        order.paymentMethod === "Card" ? (
                          <CreditCard />
                        ) : (
                          <AttachMoney />
                        )
                      }
                      label={order.paymentMethod}
                      color={
                        order.paymentMethod === "Card" ? "success" : "warning"
                      }
                      variant="filled"
                    />
                    <Chip
                      icon={
                        order.orderType === "Online (Credit Card)" ? (
                          <Payment />
                        ) : (
                          <Store />
                        )
                      }
                      label={order.orderType}
                      color={
                        order.orderType === "Online (Credit Card)"
                          ? "primary"
                          : "secondary"
                      }
                      variant="outlined"
                    />
                  </Stack>
                  <Box>
                    {order.paymentMethod === "Card" && order.cardLast4 && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CreditCard fontSize="small" />
                        {order.cardType && <span>{order.cardType}</span>}
                        <span>**** **** **** {order.cardLast4}</span>
                      </Typography>
                    )}
                    {order.orderType === "In-Store" && order.storeLocation && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Store fontSize="small" />
                        <span>{order.storeLocation}</span>
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Grid container spacing={2}>
                  {order.items.map((item, idx) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                      <Paper
                        variant="outlined"
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          p: 2,
                          height: "100%",
                        }}
                      >
                        <Avatar
                          src={item.image}
                          alt={item.name}
                          variant="rounded"
                          sx={{ width: 80, height: 80, mb: 1 }}
                        />
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold" }}
                        >
                          {item.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          {item.details}
                        </Typography>
                        {item.info && (
                          <Box sx={{ width: "100%" }}>
                            {Object.entries(item.info).map(([key, value]) => (
                              <Typography
                                key={key}
                                variant="caption"
                                color="text.secondary"
                                sx={{ display: "block" }}
                              >
                                {key}: {value}
                              </Typography>
                            ))}
                          </Box>
                        )}
                        <Typography
                          variant="subtitle2"
                          color="text.primary"
                          sx={{ mt: 1, fontWeight: 500 }}
                        >
                          {formatCurrency(item.price)}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
                <Divider sx={{ my: 2 }} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    flexDirection: "column",
                    alignItems: "flex-end",
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <LocalShipping fontSize="small" />
                    Shipping: {formatCurrency(order.shipping)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tax: {formatCurrency(order.tax)}
                  </Typography>
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{ fontWeight: "bold" }}
                  >
                    Total: {formatCurrency(order.total)}
                  </Typography>
                </Box>
              </Collapse>
            </Paper>
          );
        })}
      </Stack>
    </Box>
  );
};

export default OrderHistory;
