import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff, Check, Close } from "@mui/icons-material";

import { AuthService } from "@/services/auth-service";

import { Constants } from "@/domain/constants";
import { UserSignUpModel } from "@/domain/models/UserModel";

const authService = new AuthService();

const SignUp: React.FC = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usernameTaken, setUsernameTaken] = useState(false);
  const navigate = useNavigate();

  const passwordRules = {
    minLength: form.password.length >= 8,
    hasLowercase: /[a-z]/.test(form.password),
    hasUppercase: /[A-Z]/.test(form.password),
    hasNumber: /[0-9]/.test(form.password),
    hasSpecialChar: (new RegExp(`[${Constants.PasswordRules.SPECIAL_CHARS}]`)).test(form.password),
  };

  const allRulesMet = Object.values(passwordRules).every((rule) => rule === true);
  const passwordsMatch = form.password.trim() === form.confirmPassword.trim();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (form.password !== form.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);
    try {
      const user: UserSignUpModel = {
        username: form.username,
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        dateOfBirth: null,
        gender: null,
        password: form.password,
      };

      const success = await authService.signup(user);
      if (success) {
        toast.success(
          "Please verify your account by checking your email for a verification code"
        );
        navigate("/mfa/signup");
      } else {
        toast.error("Signup failed");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-start justify-center py-20 w-full"
    >
      <Box
        sx={{
          maxWidth: 400,
          px: 3,
          py: 4,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          sx={{ color: "black" }}
        >
          Create Account
        </Typography>

        {[
          { label: "Username", name: "username", type: "text" },
          { label: "First Name", name: "firstName", type: "text" },
          { label: "Last Name", name: "lastName", type: "text" },
          {
            label: "Phone Number",
            name: "phone",
            type: "tel",
            placeholder: "+61 4XX XXX XXX",
          },
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
            error={field.name === "username" && usernameTaken}
            helperText={
              field.name === "username" && usernameTaken
                ? "Username already exists"
                : field.name === "phone"
                  ? "Include country code (e.g., +61 for Australia)"
                  : ""
            }
            placeholder={field.name === "phone" ? field.placeholder : undefined}
          />
        ))}

        {/* Password */}
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={form.password}
          onChange={handleChange}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Confirm Password */}
        <TextField
          fullWidth
          margin="normal"
          label="Confirm Password"
          name="confirmPassword"
          type={showConfirm ? "text" : "password"}
          value={form.confirmPassword}
          onChange={handleChange}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Password Requirements */}
        <Box sx={{ mt: 2, mb: 2, textAlign: "left" }}>
          <Typography
            variant="body2"
            fontWeight="bold"
            sx={{ color: "black", mb: 1 }}
          >
            Password Requirements:
          </Typography>

          {[
            { label: "At least 8 characters", met: passwordRules.minLength },
            { label: "Contains lowercase letter", met: passwordRules.hasLowercase },
            { label: "Contains uppercase letter", met: passwordRules.hasUppercase },
            { label: "Contains number", met: passwordRules.hasNumber },
            { label: `Contains special character (e.g., ${Constants.PasswordRules.SPECIAL_CHARS})`, met: passwordRules.hasSpecialChar },
          ].map((rule, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 0.5,
              }}
            >
              <Box
                component="span"
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: "red",
                  display: "inline-block",
                }}
              />
              <Typography
                variant="body2"
                sx={{ color: "black", flexGrow: 1 }}
              >
                {rule.label}
              </Typography>
              {rule.met ? (
                <Check sx={{ color: "green", fontSize: 18 }} />
              ) : (
                <Close sx={{ color: "red", fontSize: 18 }} />
              )}
            </Box>
          ))}
        </Box>

        {/* Submit */}
        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            backgroundColor: "black",
            color: "white",
            "&:hover": { backgroundColor: "#333" },
          }}
          onClick={handleSubmit}
          disabled={loading || usernameTaken || !allRulesMet || !passwordsMatch}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Create Account"
          )}
        </Button>

        <Typography variant="body2" mt={2} sx={{ color: "black" }}>
          Already a member?{" "}
          <Link href="/login" underline="hover">
            Log In
          </Link>
        </Typography>
      </Box>
    </div>
  );
};

export default SignUp;
