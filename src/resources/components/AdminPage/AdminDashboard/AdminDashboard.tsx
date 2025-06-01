import { UserModel } from "@/domain/models/UserModel";
import { useOutletContext } from "react-router-dom";
import WeeklyOverview from "./WeeklyOverview";
import { Grid } from "@mui/material";
import SalesOverview from "./SalesOverview";
import TopSellingItems from "./TopSellingItems";
import OrderHistory from "./OrderHistory";
import SalesForecast from "./SalesForecast";

/**
 * The main dashboard to be shown to admins.
 */
export default function AdminDashboard() {
  const userContext: UserModel = useOutletContext();

  return (
    <>
      <h1 className="dashboard-heading">Welcome back, {userContext?.firstName}</h1>
      <h2 className="dashboard-subheading">Here is your overview for the past week</h2>
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
        <Grid size={12}>
          <SalesForecast />
        </Grid>
      </Grid>
    </>
  );
};
