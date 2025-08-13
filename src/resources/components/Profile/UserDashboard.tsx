import { Box, Typography, Button, Paper, Divider } from "@mui/material";

// Main dashboard for "Home" tab
export default function UserDashboard() {
  // API call to fetch user details

  {
    /* TODO: replace with name, rank, view history and orders from API */
  }
  return (
    <Box>
      <Typography variant="h2" sx={{ mb: 1 }}>
        Hey User,
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 4, color: "gray" }}>
        Welcome back!
      </Typography>
      <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {/* rank */}
        <Paper
          sx={{
            p: 4,
            minWidth: 250,
            flex: 1,
            textAlign: "center",
            border: "2px solid black",
            borderRadius: 4,
            boxShadow: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ mb: 2, fontWeight: "bold", fontSize: 24 }}
          >
            Your member rank is:
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontWeight: "bold", mb: 2, fontSize: 72 }}
          >
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
        {/* history summary */}
        <Paper
          sx={{
            p: 4,
            minWidth: 250,
            flex: 1,
            border: "2px solid black",
            borderRadius: 4,
            boxShadow: 4,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ mb: 2, fontWeight: "bold", fontSize: 24 }}
          >
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
                borderRadius: 4,
                width: "100%",
                overflow: "hidden",
                border: "2px solid grey",
              }}
            >
              {/* product image - supplied from API */}
              <Box
                sx={{
                  width: "40%",
                  height: "100%",
                  bgcolor: "#aaa",
                  mr: 2,
                  display: "flex",
                  flexGrow: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              ></Box>
              {/* details */}
              <Box
                sx={{
                  display: "flex",
                  width: "60%",
                  p: 1,
                  flexDirection: "column",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                <Typography>Product {i}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Category{i}
                </Typography>
                <Typography fontWeight="bold">$25.00</Typography>
              </Box>
            </Box>
          ))}
        </Paper>
        {/* Track Order */}
        <Paper
          sx={{
            p: 4,
            minWidth: 250,
            flex: 1,
            border: "2px solid black",
            borderRadius: 4,
            boxShadow: 4,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ mb: 2, fontWeight: "bold", fontSize: 24 }}
          >
            Track your order:
          </Typography>
          <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Monday 17th April - 3:38pm
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Status: <b>Out for delivery</b>
            </Typography>
          </Box>

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
