import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Grid,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

// TODO: consider using UserModel type
const mockUser = {
  firstName: "John",
  lastName: "Doe",
  street: "123 Main St",
  suburb: "Sydney",
  state: "NSW",
  post: "2000",
  email: "john.doe@example.com",
  password: "pass",
  phone: "+61 400 123 456",
};

const UserDetails: React.FC = () => {
  const [user] = useState(mockUser);
  const [showPassword] = useState(false);
  return (
    <Box sx={{ maxWidth: 600, p: { xs: 1, md: 4 } }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Account Details
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="First Name"
            value={user.firstName}
            fullWidth
            slotProps={{ input: { readOnly: true } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Last Name"
            value={user.lastName}
            fullWidth
            slotProps={{ input: { readOnly: true } }}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            label="Email"
            value={user.email}
            fullWidth
            slotProps={{ input: { readOnly: true } }}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={user.password}
            fullWidth
            slotProps={{
              input: {
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton disabled>
                      <VisibilityOffIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            label="Phone Number"
            value={user.phone}
            fullWidth
            slotProps={{ input: { readOnly: true } }}
          />
        </Grid>
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Location
        </Typography>
        <Grid size={12}>
          <TextField
            label="Street"
            value={user.street}
            fullWidth
            slotProps={{ input: { readOnly: true } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Suburb"
            value={user.suburb}
            fullWidth
            slotProps={{ input: { readOnly: true } }}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <TextField
            label="State"
            value={user.state}
            fullWidth
            slotProps={{ input: { readOnly: true } }}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <TextField
            label="Postcode"
            value={user.post}
            fullWidth
            slotProps={{ input: { readOnly: true } }}
          />
        </Grid>
      </Grid>
      <Box sx={{ mt: 3, textAlign: "right" }}>
        <Button variant="contained" color="primary" disabled>
          Edit Details
        </Button>
      </Box>
    </Box>
  );
};

export default UserDetails;
