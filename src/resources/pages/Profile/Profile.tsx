import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Box, Tabs, Tab, Paper } from "@mui/material";
import { useEffect } from "react";

const tabs = [
  { label: "Home", to: "/profile" },
  { label: "Orders", to: "/profile/orders" },
  { label: "Tracking", to: "/profile/tracking" },
  { label: "Profile", to: "/profile/details" }, // Example extra tab
];

export default function Profile() {
  const location = useLocation();

  // Find the current tab index
  const currentTab = tabs.findIndex(
    (tab) =>
      location.pathname === tab.to ||
      (tab.to === "/profile" && location.pathname === "/profile")
  );

  useEffect(() => {
    document.title = "Profile Page";
  }, []);

  return (
    <Box sx={{ width: "100%", padding: "3rem" }}>
      {/* Tabs */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <Tabs value={currentTab === -1 ? 0 : currentTab}>
          {tabs.map((tab, idx) => (
            <Tab
              key={tab.to}
              label={tab.label}
              component={NavLink}
              to={tab.to}
              sx={{
                mx: 1,
                px: 4,
                py: 1.5,
                borderRadius: 2,
                bgcolor: currentTab === idx ? "black" : "white",
                color: currentTab === idx ? "white" : "black",
                boxShadow: currentTab === idx ? 2 : 1,
                fontWeight: currentTab === idx ? "bold" : "normal",
                "&:hover": { bgcolor: "#f5f5f5" },
              }}
            />
          ))}
        </Tabs>
      </Box>

      <Box sx={{ px: { xs: 2, md: 8 }, pb: 8 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
