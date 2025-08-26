import { Typography, Button, Paper, LinearProgress, Box } from "@mui/material";
import type React from "react";

interface RankCardProps {
  rank: string;
  points?: number;
  nextRankPoints?: number;
}

const rankColors: Record<string, { color: string; border: string }> = {
  Gold: { color: "#FFD700", border: "#FFD700" },
  Silver: { color: "#C0C0C0", border: "#C0C0C0" },
  Bronze: { color: "#CD7F32", border: "#CD7F32" },
  Default: { color: "#1976d2", border: "#1976d2" },
};

const RankCard: React.FC<RankCardProps> = ({
  rank,
  points = 3500, // hardcoding to test
  nextRankPoints = 5000,
}) => {
  const { color, border } = rankColors[rank] || rankColors.Default;
  const progress = Math.min((points / nextRankPoints) * 100, 100);

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
      <Typography variant="subtitle1" color="text.primary" sx={{ mb: 2 }}>
        Member Rank
      </Typography>
      <Typography
        variant="h3"
        sx={{
          fontWeight: "bold",
          mb: 1,
          color,
          textShadow: `0 1px 8px ${border}44`,
        }}
      >
        {rank}
      </Typography>
      <Box sx={{ width: "80%", mb: 1.5 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 12,
            borderRadius: 4,
            bgcolor: "grey.300",
            "& .MuiLinearProgress-bar": { backgroundColor: color },
          }}
        />
        <Box>
          <Typography variant="caption" color="text.secondary">
            {points} / {nextRankPoints} pts
          </Typography>
        </Box>
      </Box>
      <Button
        variant="contained"
        color="primary"
        size="small"
        sx={{ mt: "auto" }}
      >
        See your offers
      </Button>
    </Paper>
  );
};

export default RankCard;
