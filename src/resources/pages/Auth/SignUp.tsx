import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
  CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import api from "@/api";
import debounce from 'lodash/debounce';
import { AuthenticationState } from "@/domain/state";

const SignUp: React.FC = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usernameTaken, setUsernameTaken] = useState(false);

  // Debounced API call to check if username is taken
  /* const checkUsername = debounce(async (username: string) => {
    try {
      const res = await api.get(`api/user/${username}`);
      if (res.status === 200) setUsernameTaken(true);
    } catch (err) {
      setUsernameTaken(false); // not found = available
    }
  }, 500); */

 /*  useEffect(() => {
    if (form.username) checkUsername(form.username);
  }, [checkUsername, form.username]); */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (form.password !== form.confirmPassword) return alert("Passwords don't match");
    setLoading(true);
    try {
      const response = await api.post("/auth/signup", {
        username: form.username,
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        password: form.password,
        role: 'customer',
      });
      if (response.status === 200) {
        AuthenticationState.setState({ authenticated: true });
      }

      alert('Signup successful! Now log in.');
    } catch (err: any) {
      alert(err?.response?.data?.detail || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: 'auto',
        mt: 10,
        px: 3,
        py: 4,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: 'background.paper',
        textAlign: 'center',
      }}
    >
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: 'black' }}>
        Create Account
      </Typography>

      {[
        { label: 'Username', name: 'username', type: 'text' },
        { label: 'First Name', name: 'firstName', type: 'text' },
        { label: 'Last Name', name: 'lastName', type: 'text' },
        { label: 'Phone', name: 'phone', type: 'tel' },
        { label: 'Email', name: 'email', type: 'email' },
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
          error={field.name === 'username' && usernameTaken}
          helperText={field.name === 'username' && usernameTaken ? 'Username already exists' : ''}
        />
      ))}

      {/* Password */}
      <TextField
        fullWidth
        margin="normal"
        label="Password"
        name="password"
        type={showPassword ? 'text' : 'password'}
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
        type={showConfirm ? 'text' : 'password'}
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

      {/* Submit */}
      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 3, backgroundColor: 'black', color: 'white', '&:hover': { backgroundColor: '#333' } }}
        onClick={handleSubmit}
        disabled={loading || usernameTaken}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
      </Button>

      <Typography variant="body2" mt={2} sx={{ color: 'black' }}>
        Already a member? <Link href="/login" underline="hover">Log In</Link>
      </Typography>
    </Box>
  );
};

export default SignUp;
