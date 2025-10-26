import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { authenticationState, userState } from "@/domain/state";
import { Constants } from "@/domain/constants";
import { Role } from "@/domain/enum/role";

import { AuthService } from "@/services/auth-service";

const authService = new AuthService();

const Login: React.FC = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authService.login(form.username, form.password);

      if (response.mfaEnabled) {
        navigate("/mfa/login");
      } else {
        authenticationState.setState({ authenticated: true });
        userState.setState({
          role: response.role,
          userName: response.username,
          id: response.id,
        });

        if (response.role === Role.ADMIN || response.role === Role.MANAGER) {
          navigate(Constants.ADMIN_DASHBOARD_ROUTE);
        } else {
          navigate("/");
        }

        toast.success("Login successful!");
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Login failed. Check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 10,
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
        Login
      </Typography>

      <TextField
        fullWidth
        required
        margin="normal"
        label="Username"
        name="username"
        value={form.username}
        onChange={handleChange}
      />

      <TextField
        fullWidth
        required
        margin="normal"
        label="Password"
        name="password"
        type={showPassword ? "text" : "password"}
        value={form.password}
        onChange={handleChange}
        InputProps={{
          endAdornment: (
            <Box
              sx={{ cursor: "pointer" }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <VisibilityOff fontSize="small" />
              ) : (
                <Visibility fontSize="small" />
              )}
            </Box>
          ),
        }}
      />

      <FormControlLabel
        control={<Checkbox defaultChecked />}
        label={<Typography sx={{ color: "black" }}>Remember me</Typography>}
        sx={{ mt: 2 }}
      />

      {error && (
        <Typography color="error" mt={1}>
          {error}
        </Typography>
      )}

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading}
        sx={{
          mt: 2,
          backgroundColor: "black",
          color: "white",
          "&:hover": { backgroundColor: "#333" },
        }}
      >
        {loading ? (
          <CircularProgress size={24} sx={{ color: "white" }} />
        ) : (
          "LOG IN"
        )}
      </Button>

      <Box mt={2}>
        <Link href="/signup" variant="body2">
          Create a new account
        </Link>
        <Link ml={3} href="/forgot" variant="body2">
          Forgot password
        </Link>
      </Box>
    </Box>
  );
};

export default Login;
