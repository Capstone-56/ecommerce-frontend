// TODO: could possibly refactor order history from Admin view for re-use
import type React from "react";
import { Paper, Typography, Box } from "@mui/material";

interface History {
  name: string;
  category: string;
  price: string;
  imageUrl: string;
}

const HistorySummary: React.FC<{ history: History[] }> = ({ history }) => (
  <Paper
    elevation={0}
    sx={{
      p: 4,
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Typography
      variant="subtitle1"
      color="text.primary"
      sx={{ mb: 2, fontWeight: "bold" }}
    >
      Your viewing history:
    </Typography>
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {history.map((item, i) => (
        <Box
          key={i}
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 1.5,
            bgcolor: "grey.100",
            borderRadius: 2,
            overflow: "hidden",
            border: 1,
            borderColor: "grey.300",
            maxWidth: 400,
            width: "100%",
          }}
        >
          {/* product image */}
          <Box
            sx={{
              width: { xs: "35%", sm: "35%" },
              minWidth: 64,
              maxWidth: 120,
              height: 80,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "grey.400",
              overflow: "hidden",
            }}
          >
            <img
              src={item.imageUrl}
              alt={item.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>
          {/* details */}
          <Box
            sx={{
              flex: 1,
              p: 1.5,
            }}
          >
            <Typography
              variant="body2"
              color="text.primary"
              sx={{ fontWeight: "medium" }}
            >
              {item.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {item.category}
            </Typography>
            <Typography
              variant="body2"
              color="text.primary"
              sx={{ fontWeight: "bold" }}
            >
              ${item.price}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  </Paper>
);

export default HistorySummary;
