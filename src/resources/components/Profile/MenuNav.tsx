import React from "react";
import { NavLink } from "react-router-dom";
import { Box, Button } from "@mui/material";

const menuItems = [
  { label: "Home", to: "/profile" },
  { label: "Orders", to: "/profile/orders" },
  { label: "Tracking", to: "/profile/tracking" },
  { label: "Profile", to: "/profile/details" },
];

const MenuNav: React.FC = () => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
      {menuItems.map((item) => (
        <Button
          key={item.to}
          component={NavLink}
          to={item.to}
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
            boxShadow: 1,
            fontWeight: "normal",
            "&:hover": { bgcolor: "#f5f5f5" },
          }}
        >
          {item.label}
        </Button>
      ))}
    </Box>
  );
};

export default MenuNav;
