import { TotalOrderModel } from "@/domain/models/OrderModel";
import { OrderService } from "@/services/order-service";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const orderService = new OrderService;

/**
 * The weekly Overview component to show statistics to admins
 * for the past week. This includes total sales, active users, sign-ups
 * and Memberships.
 */
export default function WeeklyOverview() {
  const [totalSales, setTotalSales] = useState<TotalOrderModel>();

  /**
   * A useEffect required to get required information on mount.
   */
  useEffect(() => {
    fetchRequiredInformation();
  }, []);

  /**
   * Sets the total sales of the previous week to display to
   * the admin.
   */
  async function fetchRequiredInformation() {
    setTotalSales(await orderService.getTotalSales());
  }

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6, md: 2 }}>
        <Card variant="outlined" sx={{ borderRadius: "10px", height: "80%" }}>
          <CardContent sx={{ paddingTop: 1 }}>
            <Typography sx={{ color: "text.secondary" }}>Total Sales</Typography>
            <Typography fontSize={18}>${totalSales?.totalSales}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 2 }}>
        <Card variant="outlined" sx={{ borderRadius: "10px", height: "80%" }}>
          <CardContent sx={{ paddingTop: 1 }}>
            <Typography sx={{ color: "text.secondary" }}>Active Users</Typography>
            <Typography fontSize={18}>4,800</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 2 }}>
        <Card variant="outlined" sx={{ borderRadius: "10px", height: "80%" }}>
          <CardContent sx={{ paddingTop: 1 }}>
            <Typography sx={{ color: "text.secondary" }}>Sign-Ups</Typography>
            <Typography fontSize={18}>80</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 2 }}>
        <Card variant="outlined" sx={{ borderRadius: "10px", height: "80%" }}>
          <CardContent sx={{ paddingTop: 1 }}>
            <Typography sx={{ color: "text.secondary" }}>Memberships</Typography>
            <Typography fontSize={18}>0</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
