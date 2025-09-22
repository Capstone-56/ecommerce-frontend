import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Divider from "@mui/material/Divider";
import { Link } from "react-router-dom";
import { Constants } from "@/domain/constants";
import { useState } from "react";
import { Box, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { UserModel } from "@/domain/models/UserModel";
import CategoryIcon from '@mui/icons-material/Category';
import LocalShippingIcon from '@mui/icons-material/LocalShipping'

const mainListItems = [
  {
    text: "Home",
    icon: <HomeRoundedIcon />,
    to: Constants.ADMIN_DASHBOARD_ROUTE,
  },
  {
    text: "Analytics",
    icon: <AnalyticsRoundedIcon />,
    to: Constants.ADMIN_DASHBOARD_ROUTE + "/analytics",
  },
  {
    text: "Product Management",
    icon: <ContentPasteSearchIcon />,
    to: Constants.ADMIN_DASHBOARD_ROUTE + "/product/management",
  },
  {
    text: "Category Management",
    icon: <CategoryIcon />,
    to: Constants.ADMIN_DASHBOARD_ROUTE + "/category",
  },
  {
    text: "Order History",
    icon: <LocalShippingIcon />,
    to: Constants.ADMIN_DASHBOARD_ROUTE + "/orders",
  },
  {
    text: "Back to Website",
    icon: <ArrowBackIcon />,
    to: Constants.HOME_ROUTE,
  },
];

const secondaryListItems = [
  {
    text: "Settings",
    icon: <SettingsRoundedIcon />,
    to: Constants.ADMIN_DASHBOARD_ROUTE + "/settings",
    index: 6,
  },
];

type MenuContentProps = {
  userInformation: UserModel | null;
};

/**
 * Menu navigation side bar for admin traversal.
 */
export default function MenuContent(props: MenuContentProps) {
  const [selected, setSelected] = useState(0);

  return (
    <>
      <h1 style={{ textAlign: "center" }}>BDNX</h1>
      <Divider
        sx={{ backgroundColor: "#8EB5C0", maxWidth: "80%", mx: "auto" }}
      />
      <Stack
        sx={{
          flexGrow: 1,
          p: 1,
          justifyContent: "space-between",
          backgroundColor: "#212E4A",
          minHeight: "80%",
        }}
      >
        <List dense>
          {mainListItems.map((item, index) => (
            <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                component={Link}
                to={item.to}
                selected={index === selected}
                onClick={() => setSelected(index)}
              >
                <ListItemIcon sx={{ color: "#8EB5C0" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <List dense>
          {secondaryListItems.map((item, index) => (
            <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                component={Link}
                to={item.to}
                selected={item.index === selected}
                onClick={() => setSelected(item.index)}
              >
                <ListItemIcon sx={{ color: "#8EB5C0" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Stack>
      <Divider
        sx={{ backgroundColor: "#8EB5C0", maxWidth: "80%", mx: "auto" }}
      />
      <Box
        display="flex"
        alignItems="center"
        justifyContent={"center"}
        marginTop={2}
        textAlign="left"
      >
        <AccountCircleIcon fontSize="medium" sx={{ marginRight: 2 }} />
        <Box>
          <Typography variant="body2">
            {props.userInformation?.firstName} {props.userInformation?.lastName}
          </Typography>
          <Typography variant="body2">
            {props.userInformation?.email}
          </Typography>
        </Box>
      </Box>
    </>
  );
}
