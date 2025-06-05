import { Card, CardContent, Grid, List, ListItemText, Typography } from "@mui/material";

/**
 * Component to display top selling items listed on BDNX.
 */
export default function TopSellingItems() {
  return (
    <Grid size={12} textAlign={"center"}>
      <Typography fontSize={24}>Top Selling Items</Typography>
      <Card sx={{ height: "250px" }}>
        <CardContent>
          <List>
            <ListItemText>1. Men's Classic T-shirt</ListItemText>
            <ListItemText>2. Women's V-Neck</ListItemText>
            <ListItemText>3. Men's Foam Runners</ListItemText>
          </List>
        </CardContent>
      </Card>
    </Grid >
  )
}
