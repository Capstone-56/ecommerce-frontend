import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  CircularProgress,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff, ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "@/api";
import { StatusCodes } from "http-status-codes";
import { Role } from "@/domain/enum/role";
import { UserSignUpModel } from "@/domain/models/UserModel";
import { toast } from "react-toastify";

// CreateAdminAccount component allows existing admin users to create new admin accounts.
export default function CreateAdminAccount() {
  const navigate = useNavigate();
  
  // Form state for admin account creation
  const [form, setForm] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // UI state for password visibility and loading
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // Validate password confirmation
    if (form.password !== form.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);
    try {
      // Create admin user object with Role.ADMIN
      const adminUser: UserSignUpModel = {
        username: form.username,
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        password: form.password,
        role: Role.ADMIN,
      };

      // Use existing signup endpoint but with admin role
      const response = await api.post("/auth/signup", adminUser);
      if (response.status === StatusCodes.OK) {
        toast.success("Admin account created successfully");
        // Redirect back to settings menu after successful creation
        navigate("/admin/settings");
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.detail || "Admin account creation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header + back navigation */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton
          onClick={() => navigate("/admin/settings")}
          sx={{ mr: 2 }}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Create Admin Account
        </Typography>
      </Box>

      {/* Main form container */}
      <Paper sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Add a new administrator to the system
        </Typography>
        {[
          { label: "Username", name: "username", type: "text" },
          { label: "First Name", name: "firstName", type: "text" },
          { label: "Last Name", name: "lastName", type: "text" },
          { label: "Phone", name: "phone", type: "tel" },
          { label: "Email", name: "email", type: "email" },
        ].map((field) => (
          <TextField
            key={field.name}
            fullWidth
            margin="normal"
            label={field.label}
            name={field.name}
            type={field.type}
            value={form[field.name as keyof typeof form]}
            onChange={handleChange}
            required
          />
        ))}

        {/* Password field */}
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={form.password}
          onChange={handleChange}
          required
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        {/* Confirm password field */}
        <TextField
          fullWidth
          margin="normal"
          label="Confirm Password"
          name="confirmPassword"
          type={showConfirm ? "text" : "password"}
          value={form.confirmPassword}
          onChange={handleChange}
          required
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        {/* Action buttons */}
        <Box sx={{ display: "flex", gap: 2, mt: 3}}>
          <Button
            variant="outlined"
            onClick={() => navigate("/admin/settings")}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              backgroundColor: "black",
              color: "white",
              "&:hover": { backgroundColor: "#333" },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Create Admin Account"
            )}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}