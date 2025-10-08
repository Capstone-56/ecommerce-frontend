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
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api";

import { authenticationState, userState } from "@/domain/state";
import { Constants } from "@/domain/constants";
import { Role } from "@/domain/enum/role";

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
      const response = await api.post("/auth/login", form);
      if (response.status === 200) {
        authenticationState.setState({ authenticated: true });
        userState.setState({ role: response.data.role });
        userState.setState({ userName: form.username });
        userState.setState({ id: response.data.id });
      }


      if (
        userState.getState().role == Role.ADMIN || 
        userState.getState().role == Role.MANAGER
      ) {
        navigate(Constants.ADMIN_DASHBOARD_ROUTE);
      } else {
        navigate("/");
      }      
    } catch (err: any) {
      console.error("Login error:", err?.response?.data || err);
      setError("Login failed. Check your credentials.");
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
      </Box>
    </Box>
  );
};

export default Login;
