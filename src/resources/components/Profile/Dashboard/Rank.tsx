import { Typography, Button, Paper } from "@mui/material";
import type React from "react";

const rankColors: Record<string, { color: string; border: string }> = {
  Gold: { color: "#FFD700", border: "#FFD700" },
  Silver: { color: "#C0C0C0", border: "#C0C0C0" },
  Bronze: { color: "#CD7F32", border: "#CD7F32" },
  Default: { color: "#1976d2", border: "#1976d2" },
};

const RankCard: React.FC<{ rank: string }> = ({ rank }) => {
  const { color, border } = rankColors[rank] || rankColors.Default;

  return (
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
        sx={{
          fontWeight: "bold",
          mb: 2,
          fontSize: { xs: "3rem", sm: "4rem" },
          lineHeight: 1,
          color,
          textShadow: `0 1px 8px ${border}44`,
        }}
      >
        {rank}
      </Typography>
      <Button variant="contained" color="primary" fullWidth sx={{ mt: "auto" }}>
        See offers
      </Button>
    </Paper>
  );
};

export default RankCard;
