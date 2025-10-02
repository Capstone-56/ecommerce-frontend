import { UserModel } from "@/domain/models/UserModel";
import { useOutletContext } from "react-router-dom";
import WeeklyOverview from "./WeeklyOverview";
import { Grid, Typography } from "@mui/material";
import SalesOverview from "./SalesOverview";
import TopSellingItems from "./TopSellingItems";
import OrderHistory from "./OrderHistory";

/**
 * The main dashboard to be shown to admins.
 */
export default function AdminDashboard() {
  const userContext: UserModel = useOutletContext();

  return (
    <>
      <Typography variant="h4">Welcome back, {userContext?.firstName}</Typography>
      <Typography variant="h5" marginTop={2} marginBottom={2}>Here is your overview for the past week</Typography>
      <WeeklyOverview />
      <Grid container spacing={3} sx={{ marginTop: "5px" }}>
        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
          <SalesOverview />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <TopSellingItems />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <OrderHistory />
        </Grid>
      </Grid>
    </>
  );
};
