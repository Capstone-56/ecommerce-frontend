
import {
    Box,
    Button,
    IconButton,
    InputAdornment,
    Link,
    TextField,
    Typography,
  } from '@mui/material';
  import { Visibility, VisibilityOff } from '@mui/icons-material';
  import React, { useState } from 'react';
  
  const SignUp: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
  
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
        {/*Heading */}
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: 'black' }}>
          Create Account
        </Typography>
  
        {/* First Name */}
        <TextField
          fullWidth
          margin="normal"
          label="First Name"
          type="text"
        />
  
        {/* Last Name */}
        <TextField
          fullWidth
          margin="normal"
          label="Last Name"
          type="text"
        />
  
        {/* Email */}
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          type="email"
        />
  
        {/* Password */}
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          type={showPassword ? 'text' : 'password'}
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
          type={showConfirm ? 'text' : 'password'}
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
          sx={{
            mt: 3,
            backgroundColor: 'black',
            color: 'white',
            '&:hover': {
              backgroundColor: '#333',
            },
          }}
        >
          Create Account
        </Button>
  
        <Typography variant="body2" mt={2} sx={{ color: 'black' }}>
  Already a member?{' '}
  <Link href="/login" underline="hover">
    Log In
  </Link>
</Typography>

      </Box>
    );
  };
  
  export default SignUp;
  