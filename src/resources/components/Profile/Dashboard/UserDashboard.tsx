import { Box, Typography, Button, Paper } from "@mui/material";
import React from "react";
import RankCard from "./Rank";
import HistorySummary from "./HistorySummary";
import OrderTracker from "./OrderTracking";

const UserDashboard: React.FC = () => {
  // API call to fetch user details

  // For the time being until api is integrated
  const history = [
    {
      name: "Product 1",
      category: "category A",
      price: "34.99",
    },
    {
      name: "Product 2 - Blue",
      category: "category A",
      price: "20.00",
    },
    {
      name: "Product 3 - Camo",
      category: "category C",
      price: "89.95",
    },
  ];

  {
    /* TODO: replace with name, rank, view history and orders from API */
  }
  return (
    <Box>
      <Typography variant="h2" sx={{ mb: 1 }}>
        Hey John Smith,
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 4, color: "gray" }}>
        Welcome back!
      </Typography>
      <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        <RankCard rank={"Gold"} />
        <HistorySummary history={history} />
        <OrderTracker />
      </Box>
    </Box>
  );
};

export default UserDashboard;
