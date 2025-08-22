import { Outlet, useLocation } from "react-router-dom";
import { Avatar, Box, Typography } from "@mui/material";
import { useEffect } from "react";
import MenuNav from "@/resources/components/Profile/MenuNav";

const profileUrl = "https://randomuser.me/api/portraits/men/32.jpg"; // Example profile

const Profile: React.FC = () => {
  useEffect(() => {
    document.title = "Profile Page";
  }, []);

  return (
    <Box sx={{ display: "flex", width: "100%", padding: "3rem" }}>
      <Box>
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
          <Typography variant="subtitle1" sx={{ mb: 3, color: "gray" }}>
            Welcome back!
          </Typography>
        </Box>
        <MenuNav />
      </Box>
      <Box sx={{ px: { xs: 2, md: 8 }, pb: 8 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Profile;
