import { Grid, Paper, Typography, Box } from "@mui/material";
import { LocalShipping, Person, ShoppingBag } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const menuOptions = [
  {
    label: "Account Details",
    icon: <Person sx={{ fontSize: 48, color: "primary.main" }} />,
    to: "/profile/account",
  },
  {
    label: "Order History",
    icon: <ShoppingBag sx={{ fontSize: 48, color: "primary.main" }} />,
    to: "/profile/orders",
  },
  {
    label: "Shipping Address",
    to: "/profile/address",
    icon: <LocalShipping sx={{ fontSize: 48, color: "primary.main" }} />,
  },
];

/**
 *  @description Landing page for users when they first enter user profile page
 */
const ProfileLanding: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: { xs: 2, md: 6 }, width: "100%" }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
        My Account
      </Typography>
      <Grid container spacing={4} justifyContent="center" alignItems="stretch">
        {menuOptions.map((option) => (
          <Grid size={{ xs: 12, md: 5 }} key={option.to}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                justifyContent: "center",
                cursor: "pointer",
                borderRadius: 3,
                transition: "box-shadow 0.2s, transform 0.2s", // cool elevation illusion thing
                "&:hover": {
                  boxShadow: 6,
                  transform: "translateY(-4px)",
                },
              }}
              onClick={() => navigate(option.to)}
            >
              {option.icon}
              <Typography variant="h6" sx={{ mt: 2 }}>
                {option.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProfileLanding;
