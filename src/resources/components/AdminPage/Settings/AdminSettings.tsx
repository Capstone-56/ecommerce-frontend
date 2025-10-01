import React from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { PersonAdd } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

/** 
 * AdminSettings provides a centralised menu for all admin-related settings
 * Links to other settings pages can be added here when needed 
 */
export default function AdminSettings() {
  const navigate = useNavigate();

  /** 
   * Configuration for all available admin settings options
   * Add new settings here as they are implemented
   */
  const settingsOptions = [
    {
      title: "Create Admin Account",
      description: "Add new administrator users to the system",
      icon: <PersonAdd />,
      action: () => navigate("/admin/settings/create-admin"),
    },
    /** 
     * Future settings can be added here:
     * ---
     * ---
     */
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        Admin Settings
      </Typography>

      {/* Settings options list */}
      <Paper sx={{ maxWidth: 800 }}>
        <List>
          {settingsOptions.map((option, index) => (
            <React.Fragment key={option.title}>
              <ListItem disablePadding>
                <ListItemButton onClick={option.action} sx={{ py: 2 }}>
                  <ListItemIcon>{option.icon}</ListItemIcon>
                  <ListItemText
                    primary={option.title}
                    secondary={option.description}
                    slotProps={{
                      primary: { style: { fontWeight: "medium" } },
                    }}
                  />
                </ListItemButton>
              </ListItem>
              {/* Add divider between options (except after last one) */}
              {index < settingsOptions.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
}