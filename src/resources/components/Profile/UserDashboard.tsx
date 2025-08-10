import { Box, Typography, Button, Paper, Divider } from "@mui/material";

// Main dashboard for "Home" tab
export default function UserDashboard() {
  // API call to fetch user details

  return (
    <Box>
      <Typography variant="h3" sx={{ mb: 1 }}>
        {/* TODO: replace with actual name from API */}
        Hey User,
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 4, color: "gray" }}>
        Welcome back!
      </Typography>
      <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {/* Member rank */}
        <Paper
          sx={{
            p: 3,
            minWidth: 250,
            flex: 1,
            textAlign: "center",
            border: "2px solid black",
            borderRadius: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
          }}
        >
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Your member rank is:
          </Typography>
          <Typography variant="h2" sx={{ fontWeight: "bold", mb: 2 }}>
            Silver
          </Typography>
          <Button
            variant="contained"
            color="inherit"
            sx={{ bgcolor: "black", color: "white" }}
          >
            See offers
          </Button>
        </Paper>
        {/* Viewing History */}
        <Paper sx={{ p: 3, minWidth: 250, flex: 1 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Your viewing history:
          </Typography>
          {[1, 2, 3].map((i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1,
                bgcolor: "#f5f5f5",
                borderRadius: 1,
                p: 1,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: "#ccc",
                  borderRadius: 1,
                  mr: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span role="img" aria-label="camera">
                  📷
                </span>
              </Box>
              <Box>
                <Typography>Product{i}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Category{i}
                </Typography>
                <Typography fontWeight="bold">$99.99</Typography>
              </Box>
            </Box>
          ))}
        </Paper>
        {/* Track Order */}
        <Paper sx={{ p: 3, minWidth: 250, flex: 1 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Track your order:
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Monday 17th April - 3:38pm
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Status: <b>Out for delivery</b>
          </Typography>
          <Button
            variant="contained"
            color="inherit"
            sx={{ bgcolor: "black", color: "white" }}
          >
            View tracking details
          </Button>
        </Paper>
      </Box>
    </Box>
  );
}
