import React from "react";
import { NavLink } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import {
  Home,
  AccountBox,
  ShoppingBag,
  LocalShipping,
  Person,
  CreditCard,
} from "@mui/icons-material";

const menuItems = [
  { label: "Profile", to: "/profile", icon: <AccountBox sx={{ mr: 1 }} /> },
  {
    label: "Account information",
    to: "/profile/account",
    icon: <Person sx={{ mr: 1 }} />,
  },
  {
    label: "Order history",
    to: "/profile/orders",
    icon: <ShoppingBag sx={{ mr: 1 }} />,
  },
  {
    label: "Payment methods",
    to: "/profile/payment",
    icon: <CreditCard sx={{ mr: 1 }} />,
  },
];

const MenuNav: React.FC = () => {
  return (
    <Box
      component="nav"
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {menuItems.map((item) => (
        <NavLink key={item.to} to={item.to} end={item.to === "/profile"}>
          {({ isActive }) => (
            <Box
              sx={(theme) => ({
                display: "flex",
                alignItems: "center",
                py: 1,
                px: 1,
                color: isActive
                  ? theme.palette.primary.main
                  : theme.palette.text.primary,
                fontWeight: isActive ? "bold" : "normal",
                bgcolor: isActive
                  ? theme.palette.action.selected
                  : "transparent",
                cursor: "pointer",
              })}
            >
              {item.icon}
              <Typography variant="body1">{item.label}</Typography>
            </Box>
          )}
        </NavLink>
      ))}
    </Box>
  );
};

export default MenuNav;
