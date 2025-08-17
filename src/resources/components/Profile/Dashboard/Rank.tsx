import { Typography, Button, Paper } from "@mui/material";
import type React from "react";

const RankCard: React.FC<{ rank: string }> = ({ rank }) => (
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
    <Typography
      variant="subtitle1"
      color="text.primary"
      sx={{ mb: 2, fontWeight: "bold" }}
    >
      Your member rank is:
    </Typography>
    <Typography
      variant="h1"
      color="primary.main"
      sx={{
        fontWeight: "bold",
        mb: 2,
        fontSize: { xs: "3rem", sm: "4rem" },
        lineHeight: 1,
      }}
    >
      {rank}
    </Typography>
    <Button variant="contained" color="primary" fullWidth sx={{ mt: "auto" }}>
      See offers
    </Button>
  </Paper>
);

export default RankCard;
