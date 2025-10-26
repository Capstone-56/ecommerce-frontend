import React, { useEffect, useState } from "react";
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
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { OrderService } from "@/services/order-service";
import type { OrderModel } from "@/domain/models/OrderModel";
import { userState } from "@/domain/state";
import { COUNTRY_CURRENCY_MAP } from "@/domain/enum/currency";

const orderService = new OrderService();

/**
 * @description Page for users to view their purchasing history
 */
const OrderHistory: React.FC = () => {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [orders, setOrders] = useState<OrderModel[]>([]);
  const [loading, setLoading] = useState(true);
  const username = userState((s) => s.userName);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!username) return;
      try {
        const orders = await orderService.getLatestOrders({
          userNames: username,
        });
        setOrders(orders || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <Box sx={{ maxWidth: { md: "700px" }, p: { xs: 1, md: 4 }, width: "100%" }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Order History
      </Typography>
      <Stack spacing={3} sx={{ width: "100%" }}>
        {loading ? (
          <Typography>Loading orders...</Typography>
        ) : orders.length === 0 ? (
          <Typography>No orders found.</Typography>
        ) : (
          orders.map((order) => {
            const isExpanded = expandedOrder === order.id;
            const formattedPrice = `${order.totalPrice}${
              order.address.country
                ? " " + COUNTRY_CURRENCY_MAP[order.address.country]
                : ""
            }`;
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
                      Date: {new Date(order.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Status:{" "}
                      <Chip label={order.status} size="small" color="primary" />
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography
                      variant="h6"
                      color="primary"
                      sx={{ fontWeight: "bold" }}
                    >
                      {formattedPrice}
                    </Typography>
                    <IconButton size="small">
                      {isExpanded ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </Box>
                </Box>

                {/* Expanded view */}
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <Divider sx={{ my: 2 }} />
                  <Grid container spacing={2}>
                    {order.items.map((item, idx) => (
                      <Grid size={{ xs: 12, sm: 6 }} key={item.id || idx}>
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
                            src={item.productItem.product?.images?.[0] || ""}
                            alt={item.productItem.product?.name || "Product"}
                            variant="rounded"
                            sx={{ width: 80, height: 80, mb: 1 }}
                          />
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: "bold" }}
                          >
                            {item.productItem.product?.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            Qty: {item.quantity}
                          </Typography>
                          {item.productItem.sku && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: "block" }}
                            >
                              {item.productItem.sku}
                            </Typography>
                          )}
                          <Typography
                            variant="subtitle2"
                            color="text.primary"
                            sx={{ mt: 1, fontWeight: 500 }}
                          >
                            {item.price}
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
                      Shipping Address: {order.address?.addressLine},{" "}
                      {order.address?.city}, {order.address?.state}{" "}
                      {order.address?.postcode}, {order.address?.country}
                    </Typography>
                    <Typography
                      variant="h6"
                      color="primary"
                      sx={{ fontWeight: "bold" }}
                    >
                      Total: {formattedPrice}
                    </Typography>
                  </Box>
                </Collapse>
              </Paper>
            );
          })
        )}
      </Stack>
    </Box>
  );
};

export default OrderHistory;
