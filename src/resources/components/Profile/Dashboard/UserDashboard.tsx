import { Box, Typography, Button, Paper, Grid, Avatar } from "@mui/material";
import React from "react";
import RankCard from "./Rank";
import ViewingHistory from "./ViewingHistory";
import OrderTracker from "./OrderTracking";
import { ProductModel } from "@/domain/models/ProductModel";

const UserDashboard: React.FC = () => {
  // API call to fetch user details

  // For the time being until an api is integrated
  const history: ProductModel[] = [
    {
      id: "123",
      name: "Wireless Headphones",
      description: "High-quality wireless headphones with noise cancellation.",
      images: [
        "https://www.jbhifi.com.au/cdn/shop/files/812874-Product-0-I-638827703403543800.jpg",
      ],
      featured: true,
      avgRating: 4.5,
      price: 199.99,
      variations: {
        color: ["Black", "White"],
        size: ["Standard"],
      },
    },
    {
      id: "124",
      name: "Smart Watch",
      description: "Fitness tracking smart watch with heart rate monitor.",
      images: [
        "https://www.jbhifi.com.au/cdn/shop/products/665845-Product-0-I-638307611405584735.jpg",
      ],
      featured: false,
      avgRating: 4.2,
      price: 249.99,
      variations: {
        color: ["Silver", "Gold", "Rose Gold"],
        band: ["Leather", "Silicone"],
      },
    },
    {
      id: "125",
      name: "Bluetooth Speaker",
      description: "Portable Bluetooth speaker with deep bass.",
      images: [
        "https://www.jbhifi.com.au/cdn/shop/products/640437-Product-0-I-638229016204101882_bbbe489f-088c-43ea-99ba-8b7bc3809b7b.jpg",
      ],
      featured: false,
      avgRating: 4.7,
      price: 599.99,
      variations: {
        color: ["Blue", "Red", "Black"],
      },
    },
  ];

  {
    /* TODO: replace with name, rank, view history and orders from API */
  }
  return (
    <Box sx={{ mx: 2, px: 1 }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <RankCard rank={"Gold"} />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <OrderTracker />
        </Grid>
        <Grid size={12}>
          <ViewingHistory history={history} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserDashboard;
