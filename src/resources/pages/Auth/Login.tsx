import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Link,
    TextField,
    Typography,
  } from '@mui/material';
  import { Visibility, VisibilityOff } from '@mui/icons-material';
  import React, { useState } from 'react';
  
  
  const Login: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
  
    return (
      <>
        {}
  
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
          {/*Black-colored heading */}
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: 'black' }}>
            Login
          </Typography>
  
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            type="email"
            placeholder="Your email"
          />
  
          <Box position="relative">
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
            />
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                right: 16,
                transform: 'translateY(-50%)',
                cursor: 'pointer',
              }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
            </Box>
          </Box>
  
          <Box textAlign="left" mt={1}>
            <Link href="#" variant="body2">
              Forgot password?
            </Link>
          </Box>
  
          {/*Black-colored "Remember me" */}
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label={
              <Typography sx={{ color: 'black' }}>
                Remember me
              </Typography>
            }
            sx={{ mt: 2 }}
          />
  
          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: 'black',
              color: 'white',
              '&:hover': {
                backgroundColor: '#333',
              },
            }}
          >
            LOG IN
          </Button>
  
          <Box mt={2}>
            <Link href="#" variant="body2">
              Create a new account
            </Link>
          </Box>
        </Box>
  
        {/* <Footer /> */}
      </>
    );
  };
  
  export default Login;
  