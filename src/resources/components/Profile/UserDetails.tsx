import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, Grid, Button } from "@mui/material";
import { UserService } from "@/services/user-service";
import { UserModel } from "@/domain/models/UserModel";
import { Constants } from "@/domain/constants";
import { userState } from "@/domain/state";
import { toast } from "react-toastify";
import { StatusCodes } from "http-status-codes";

/**
 *
 * @description Page to allow users to update their details.
 */
const UserDetails: React.FC = () => {
  const [user, setUser] = useState<UserModel | null>(null);
  const [initialUser, setInitialUser] = useState<UserModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const userService = new UserService();
  const username = userState((s) => s.userName);

  useEffect(() => {
    if (!username) return;
    const fetchUser = async () => {
      try {
        const userData = await userService.getUser(username);
        setUser(userData);
        setInitialUser(userData);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const isChanged =
    user &&
    initialUser &&
    (user.firstName !== initialUser.firstName ||
      user.lastName !== initialUser.lastName ||
      user.email !== initialUser.email ||
      user.phone !== initialUser.phone);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!user) return;
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!user) return; // probably toast an error here
    setSaving(true);
    setError(null);
    setSuccess(false);

    let userId = userState.getState().id;

    if (!userId) {
      try {
        const userStorage = localStorage.getItem(
          Constants.LOCAL_STORAGE_USER_STORAGE
        );
        if (userStorage) {
          const parsed = JSON.parse(userStorage);
          userId = parsed?.userId || null;
        }
      } catch {}
    }

    if (!userId) {
      toast.error("Cannot update details: user Id was not found");
      setSaving(false);
      return;
    }

    const status = await userService.updateUser(user, user.id);

    if (status === StatusCodes.OK) {
      setSaving(false);
      setInitialUser(user);
      toast.success("Details saved successfully");
    }
  };

  if (loading || !user) {
    return (
      <Box sx={{ maxWidth: "700px", p: { xs: 1, md: 4 } }}>
        <Typography variant="h6">Loading user details...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: "700px", p: { xs: 1, md: 4 } }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Account Details
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 6 }}>
          <TextField
            label="First Name"
            name="firstName"
            value={user.firstName}
            fullWidth
            onChange={handleChange}
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField
            label="Last Name"
            name="lastName"
            value={user.lastName}
            fullWidth
            onChange={handleChange}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            label="Email"
            name="email"
            value={user.email}
            fullWidth
            onChange={handleChange}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            label="Phone Number"
            name="phone"
            value={user.phone}
            fullWidth
            onChange={handleChange}
          />
        </Grid>
      </Grid>
      <Box sx={{ mt: 3, textAlign: "right" }}>
        <Button
          variant="contained"
          color="primary"
          disabled={!isChanged}
          onClick={handleSave}
        >
          Save Details
        </Button>
      </Box>
    </Box>
  );
};

export default UserDetails;
