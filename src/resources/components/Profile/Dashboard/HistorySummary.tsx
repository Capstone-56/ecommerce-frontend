// TODO: could possibly refactor order history from Admin view for re-use
import type React from "react";
import { Paper, Typography, Box } from "@mui/material";

interface History {
  name: string;
  category: string;
  price: string;
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
    <Box sx={{ flex: 1 }}>
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
          }}
        >
          {/* product image */}
          <Box
            sx={{
              width: "40%",
              height: "100%",
              background: "grey.400",
            }}
          ></Box>
          {/* details */}
          <Box
            sx={{
              flex: 1,
              p: 1.5,
              textAlign: "left",
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
              color="primary.main"
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
