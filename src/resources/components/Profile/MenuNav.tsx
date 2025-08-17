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
          end={item.to === "/profile"} // naive approach - for reusability maybe map base on routes object
          sx={{
            mx: 1,
            px: 4,
            py: 1.5,
            borderRadius: 2,
            textTransform: "none",
            "&.active": {
              bgcolor: "black",
              color: "white",
              fontWeight: "bold",
              boxShadow: 2,
            },
            color: "black",
            bgcolor: "white",
            gap: 1,
            boxShadow: 1,
            fontWeight: "normal",
            "&:hover": { bgcolor: "#f5f5f5" },
          }}
        >
          {item.icon}
          {item.label}
        </Button>
      ))}
    </Box>
  );
};

export default MenuNav;
