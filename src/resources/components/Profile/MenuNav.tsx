import React from "react";
import { NavLink } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { Home, ShoppingBag, LocalShipping, Person } from "@mui/icons-material";

const menuItems = [
  { label: "Home", to: "/profile", icon: <Home /> },
  { label: "Orders", to: "/profile/orders", icon: <ShoppingBag /> },
  { label: "Tracking", to: "/profile/tracking", icon: <LocalShipping /> },
  { label: "Profile", to: "/profile/details", icon: <Person /> },
];

const MenuNav: React.FC = () => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
      {menuItems.map((item) => (
        <Button
          key={item.to}
          component={NavLink}
          to={item.to}
          end={item.to === "/profile"}
          sx={(theme) => ({
            mx: theme.spacing(1),
            px: theme.spacing(4),
            py: theme.spacing(1.5),
            borderRadius: theme.shape.borderRadius,
            textTransform: "none",
            gap: 1,
            fontWeight: "normal",
            color: theme.palette.text.primary,
            bgcolor: theme.palette.background.paper,
            boxShadow: theme.shadows[1],
            "&:hover": {
              bgcolor: theme.palette.grey[200],
            },
            "&.active": {
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              fontWeight: "bold",
              boxShadow: theme.shadows[2],
            },
          })}
        >
          {item.icon}
          {item.label}
        </Button>
      ))}
    </Box>
  );
};

export default MenuNav;
