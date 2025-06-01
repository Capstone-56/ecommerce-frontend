import { Card, CardContent, Grid, Typography } from "@mui/material";

/**
 * The weekly Overview component to show statistics to admins
 * for the past week. This includes total sales, active users, sign-ups
 * and Memberships.
 */
export default function WeeklyOverview() {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6, md: 2 }}>
        <Card variant="outlined" sx={{ borderRadius: "10px", height: "80%" }}>
          <CardContent sx={{ paddingTop: 1 }}>
            <Typography sx={{ color: "text.secondary" }}>Total Sales</Typography>
            <Typography fontSize={18}>$41,879</Typography>
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
