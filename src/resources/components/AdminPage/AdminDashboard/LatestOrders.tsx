import { OrderModel } from "@/domain/models/OrderModel";
import { OrderService } from "@/services/order-service";
import { Card, CardContent, Divider, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { determineBackgroundColor, displayOrderDate } from "../util/Utils";

const orderService = new OrderService;

/**
 * Shows latest orders that were purchased by users.
 */
export default function LatestOrders() {
  const [orderHistory, setOrderHistory] = useState<OrderModel[]>();

  /**
   * A useEffect required to get required information on mount.
   */
  useEffect(() => {
    fetchRequiredInformation();
  }, []);

  /**
   * Sets the the latest orders.
   */
  async function fetchRequiredInformation() {
    const response = await orderService.getLatestOrders({
      page: 1,
      pageSize: 2
    });

    setOrderHistory(response);
  };

  return (
    <Grid size={12} textAlign={"center"}>
      <Card sx={{ p: 1, height: "310px", borderRadius: 3 }}>
        <Typography fontSize={24} pb={1}>Latest Orders</Typography>
        <Divider
          sx={{ backgroundColor: "#8EB5C0", maxWidth: "80%", mx: "auto" }}
        />
        <CardContent>
          <Grid container spacing={2}>
            {orderHistory && orderHistory.map((order, index) => (
              <Grid size={12} key={index}>
                <Card
                  variant="outlined"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1.5,
                    borderRadius: 2,
                  }}
                >
                  <Grid container width={"100%"}>
                    <Grid size={10} display={"flex"} justifyContent={"left"}>
                      <Typography>Order: {order.id}</Typography>
                    </Grid>
                    <Grid size={2} display={"flex"} justifyContent={"right"}>
                      <Typography>{order.totalPrice}</Typography>
                    </Grid>
                    <Grid size={10} display={"flex"} justifyContent={"left"}>
                      <Typography variant={"subtitle2"} color={"textSecondary"} fontWeight="500">
                        {
                          displayOrderDate(order.createdAt)
                        }
                      </Typography>
                    </Grid>
                    <Grid size={2} display={"flex"} justifyContent={"right"}>
                      <Typography variant={"subtitle2"} fontWeight="500" bgcolor={determineBackgroundColor(order.status)} color={"white"} p={0.5} borderRadius={10}>
                        {
                          order.status[0].toUpperCase() + order.status.slice(1)
                        }
                      </Typography>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent >
      </Card >
    </Grid >
  )
}
