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

  // Field-specific errors from API or validation
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: "" });
    }
  };

  // Check if all fields are filled and valid
  const isFormValid = Object.values(form).every(value => value.trim());

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    
    if (form.email && !emailRegex.test(form.email)) {
      errors.email = "Enter a valid email address";
    }
    if (form.phone && (!phoneRegex.test(form.phone) || form.phone.replace(/\D/g, '').length < 10)) {
      errors.phone = "Enter a valid phone number (at least 10 digits)";
    }
    if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    // Run client-side validation first
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Use existing signup endpoint but with admin role
      const response = await api.post("/auth/signup", {
        ...form,
        role: Role.ADMIN,
      } as UserSignUpModel);
      if (response.status === StatusCodes.OK) {
        toast.success("Admin account created successfully");
        // Redirect back to settings menu after successful creation
        navigate("/admin/settings");
      }
    } catch (err: any) {
      // check for field-specific validation errors
      if (err?.response?.data) {
        const errorData = err.response.data;
        
        // Check if response has field-specific errors
        const fieldErrorsFromAPI: { [key: string]: string } = {};
        let hasFieldErrors = false;
        
        // Parse field-specific errors from API response
        Object.entries(errorData).forEach(([fieldName, errors]) => {
          if (Array.isArray(errors) && errors.length > 0) {
            // Display more user-friendly errors
            fieldErrorsFromAPI[fieldName] = errors[0].replace(/user model with this/gi, 'User with this');
            hasFieldErrors = true;
          }
        });
        
        if (hasFieldErrors) {
          setFieldErrors(fieldErrorsFromAPI);
        } else if (errorData.detail) {
          // Fall back to detail message if no field-specific errors
          toast.error(errorData.detail);
        } else {
          toast.error("Admin account creation failed");
        }
      } else {
        toast.error("Admin account creation failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header + back navigation */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={() => navigate("/admin/settings")} sx={{ mr: 2 }}>
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
            error={!!fieldErrors[field.name]}
            helperText={fieldErrors[field.name] || ""}
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
          error={!!fieldErrors.password}
          helperText={fieldErrors.password || ""}
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
          error={!!fieldErrors.confirmPassword}
          helperText={fieldErrors.confirmPassword || ""}
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
        <Box sx={{ display: "flex", gap: 2, mt: 3, justifyContent: "center" }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || !isFormValid}
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