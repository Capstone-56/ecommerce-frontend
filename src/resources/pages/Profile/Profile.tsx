import { Outlet, useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Typography,
  Drawer,
  Button,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import MenuNav from "@/resources/components/Profile/Navigation";
import {
  Person,
  ShoppingBag,
  ChevronRight,
  LocalShipping,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

const menuItems = [
  {
    label: "Account details",
    to: "/profile/account",
    icon: <Person sx={{ mr: 1 }} />,
  },
  {
    label: "Order history",
    to: "/profile/orders",
    icon: <ShoppingBag sx={{ mr: 1 }} />,
  },
  {
    label: "Shipping Addresses",
    to: "/profile/shipping",
    icon: <LocalShipping sx={{ mr: 1 }} />,
  },
];

const profileUrl = "https://randomuser.me/api/portraits/men/32.jpg"; // Example profile

const Profile: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    document.title = "Profile Page";
  }, []);

  // Only for small screens
  const handleMenuClick = (menuItem: string) => {
    setDrawerOpen(true);
    navigate(menuItem);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <Box sx={{ display: "flex", width: "100%", p: { xs: 0, md: 3 } }}>
      {/* > md - alternatively could do sx={{display: { xs: "none", lg: "flex" }}} */}
      {!isSmall && (
        <>
          <Box
            minWidth={"400px"}
            sx={{
              p: 4,
              display: "flex",
              flexDirection: "column",
              bgcolor: "grey.100",
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                textAlign: "left",
              }}
            >
              <Avatar
                src={profileUrl}
                alt="Profile"
                sx={{
                  width: { xs: 64, sm: 96 },
                  height: { xs: 64, sm: 96 },
                  border: "4px solid white",
                  boxShadow: 3,
                  bgcolor: "grey.100",
                  mb: 2,
                }}
              />
              <Typography variant="h2">Hey John,</Typography>
              <Typography variant="subtitle1" sx={{ mb: 3, color: "grey.500" }}>
                Welcome back!
              </Typography>
            </Box>
            <MenuNav />
          </Box>
          <Box
            sx={{
              px: { xs: 0, md: 2 },
              width: "100%",
              mt: { xs: 2, md: 0 },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Outlet />
          </Box>
        </>
      )}

      {/* < md */}
      {isSmall && (
        <>
          <Box
            sx={{
              width: "100vw",
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              p: 0,
              m: 0,
              minHeight: "80vh",
              bgcolor: "background.paper",
            }}
          >
            <Avatar
              src={profileUrl}
              alt="Profile"
              sx={{
                width: 64,
                height: 64,
                border: "4px solid white",
                boxShadow: 3,
                bgcolor: "grey.100",
                mx: "auto",
                mt: 4,
                mb: 2,
              }}
            />
            <Typography variant="h5" align="center" sx={{ mb: 3 }}>
              Hey John, welcome back!
            </Typography>
            {menuItems.map((item) => (
              <Button
                key={item.to}
                onClick={() => handleMenuClick(item.to)}
                sx={{
                  width: "100vw",
                  borderRadius: 0,
                  py: 3,
                  fontSize: "1.2rem",
                  justifyContent: "space-between",
                  px: 4,
                  borderBottom: `1px solid ${theme.palette.grey[200]}`,
                  color: "text.primary",
                  textAlign: "left",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {item.icon}
                  <span>{item.label}</span>
                </Box>
                <ChevronRight />
              </Button>
            ))}
          </Box>
          <Drawer anchor="bottom" open={drawerOpen} onClose={handleDrawerClose}>
            <Box sx={{ position: "absolute", top: 8, left: 8 }}>
              <IconButton onClick={handleDrawerClose}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Box
              sx={{
                mt: 6,
                px: 2,
                width: "100vw",
                height: "100vh",
                overflow: "auto",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Outlet />
            </Box>
          </Drawer>
        </>
      )}
    </Box>
  );
};

export default Profile;
