import { Card, CardContent, Grid, List, ListItemText, Typography } from "@mui/material";

/**
 * Shows latest orders that were purchased by users.
 */
export default function OrderHistory() {
  return (
    <Grid size={12} textAlign={"center"}>
      <Typography fontSize={24}>Order History</Typography>
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
