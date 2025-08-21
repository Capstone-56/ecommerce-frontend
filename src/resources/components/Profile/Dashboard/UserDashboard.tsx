import { Box, Typography, Button, Paper, Grid, Avatar } from "@mui/material";
import React from "react";
import RankCard from "./Rank";
import HistorySummary from "./HistorySummary";
import OrderTracker from "./OrderTracking";

// stub images
const bannerUrl =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"; // Example banner
const profileUrl = "https://randomuser.me/api/portraits/men/32.jpg"; // Example profile

const UserDashboard: React.FC = () => {
  // API call to fetch user details

  // For the time being until api is integrated
  const history = [
    {
      name: "Product 1",
      category: "category A",
      price: "34.99",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlp-Ltk9qnyjnLsGhF5p4Tx5n8T83yCg9Zfg&s",
    },
    {
      name: "Product 2 - Blue",
      category: "category A",
      price: "20.00",
      imageUrl:
        "https://img1.theiconic.com.au/p8aZM8LYAsVn_AyTBNF7Y7ufUYs=/634x811/filters:quality(95):fill(ffffff)/http%3A%2F%2Fstatic.theiconic.com.au%2Fp%2Fmac-5883-4958422-1.jpg",
    },
    {
      name: "Product 3 - Camo",
      category: "category C",
      price: "89.95",
      imageUrl: "",
    },
  ];

  {
    /* TODO: replace with name, rank, view history and orders from API */
  }
  return (
    <Box>
      {/* Banner section can be added here if needed */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 2,
          mb: 2,
        }}
      >
        <Avatar
          src={profileUrl}
          alt="Profile"
          sx={{
            width: { xs: 96, sm: 128 },
            height: { xs: 96, sm: 128 },
            border: "4px solid white",
            boxShadow: 3,
            bgcolor: "grey.100",
            mb: 2,
          }}
        />
        <Typography variant="h2" sx={{ mb: 1, textAlign: "center" }}>
          Hey John,
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ mb: 4, color: "gray", textAlign: "center" }}
        >
          Welcome back!
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <RankCard rank={"Gold"} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <HistorySummary history={history} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <OrderTracker />
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserDashboard;
