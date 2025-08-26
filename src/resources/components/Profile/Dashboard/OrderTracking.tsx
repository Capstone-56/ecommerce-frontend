import type React from "react";
import { Paper, Box, Typography, Button } from "@mui/material";

const OrderTracker: React.FC = () => (
  <Paper
    elevation={0}
    sx={{
      p: 4,
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      height: 280,
    }}
  >
    <Typography variant="subtitle1" color="text.primary" sx={{ mb: 2 }}>
      Track your order:
    </Typography>
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Monday 17th April - 3:38pm
      </Typography>
      <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
        Status:{" "}
        <Box
          component="span"
          sx={{ fontWeight: "bold", color: "secondary.main" }}
        >
          Out for delivery
        </Box>
      </Typography>
    </Box>
    <Button variant="contained" color="primary" fullWidth>
      View tracking details
    </Button>
  </Paper>
);

export default OrderTracker;
