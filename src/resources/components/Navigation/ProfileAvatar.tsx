import { UserContext } from "@/contexts/UserContext";
import { Constants } from "@/domain/constants";
import { Role } from "@/domain/enum/role";
import { authenticationState, cartState, userState } from "@/domain/state";
import { AuthService } from "@/services/auth-service";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { StatusCodes } from "http-status-codes";
import { ReactNode, useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Link as RouterLink,
} from "react-router-dom";

const authService = new AuthService();

const ProfileAvatar = (): ReactNode => {
  const { user: userMayNull, } = useContext(UserContext);
  const navigate = useNavigate();
  const user = useMemo((): Me => {
    if (userMayNull) {
      return userMayNull;
    } else {
      throw new Error("user must be defined");
    }
  }, [userMayNull]);
  const pfp = useMemo((): string | null => {
    return user.hasPfp ? `https://bdnx-pfp.s3.ap-southeast-2.amazonaws.com/${user.id}.webp?${Date.now()}` : null;
  }, [user]);
  const userInformation = userState((state) => state.userInformation);
  const clearCart = cartState((state) => state.clearCart);
  const [profileAnchorEl, setProfileAnchorEl] = useState<HTMLElement | null>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const status = await authService.logout();

      if (status === StatusCodes.OK) {
        authenticationState.setState({ authenticated: false });
        userState.setState({ role: Role.CUSTOMER });
        userState.setState({ userName: null });
        userState.setState({ id: null });
        userState.setState({ userInformation: null });
        clearCart(); // Clear cart data on logout
        navigate(Constants.HOME_ROUTE, {
          replace: true
        });
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <>
      <IconButton
        onClick={handleProfileMenuOpen}
        sx={{
          p: 0,
          px: 0.5
        }}
      >
        <img src={pfp ?? "/avatar.png"} className="rounded-full border border-gray-200 size-8" />
      </IconButton>
      <Menu
        anchorEl={profileAnchorEl}
        open={Boolean(profileAnchorEl)}
        onClose={handleProfileMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {(userInformation?.role === Role.ADMIN ||
          userInformation?.role === Role.MANAGER) && (
            <MenuItem
              component={RouterLink}
              to={Constants.ADMIN_DASHBOARD_ROUTE}
              onClick={handleProfileMenuClose}
            >
              Admin Dashboard
            </MenuItem>
          )}

        <MenuItem
          component={RouterLink}
          to={Constants.PROFILE_ROUTE}
          onClick={handleProfileMenuClose}
        >
          Profile
        </MenuItem>

        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default ProfileAvatar;
