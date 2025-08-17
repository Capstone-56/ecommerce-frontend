import { Outlet, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import { useEffect } from "react";
import MenuNav from "@/resources/components/Profile/MenuNav";

const Profile: React.FC = () => {
  useEffect(() => {
    document.title = "Profile Page";
  }, []);

  return (
    <Box sx={{ width: "100%", padding: "3rem" }}>
      <MenuNav />
      <Box sx={{ px: { xs: 2, md: 8 }, pb: 8 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Profile;
