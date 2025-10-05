import React, { useState } from "react";
import { Box, Typography, TextField, Grid, Button } from "@mui/material";

// stub
const initialAddress = {
  street: "123 Main St",
  suburb: "Sydney",
  state: "NSW",
  post: "2000",
};

/**
 *
 * @description Page for managing saved addresses for the user. Can add multiple addresses.
 */
const ShippingAddress: React.FC = () => {
  const [address, setAddress] = useState(initialAddress);
  const [editing, setEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleEdit = () => setEditing(true);
  const handleSave = () => {
    // TODO: Save address via API
    setEditing(false);
  };

  return (
    <Box sx={{ maxWidth: "700px", p: { xs: 1, md: 4 } }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Shipping Address
      </Typography>
      <Grid container spacing={2}>
        <Grid size={12}>
          <TextField
            label="Street"
            name="street"
            value={address.street}
            fullWidth
            onChange={handleChange}
            slotProps={{
              input: {
                readOnly: !editing,
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Suburb"
            name="suburb"
            value={address.suburb}
            fullWidth
            onChange={handleChange}
            slotProps={{
              input: {
                readOnly: !editing,
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <TextField
            label="State"
            name="state"
            value={address.state}
            fullWidth
            onChange={handleChange}
            slotProps={{
              input: {
                readOnly: !editing,
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <TextField
            label="Postcode"
            name="post"
            value={address.post}
            fullWidth
            onChange={handleChange}
            slotProps={{
              input: {
                readOnly: !editing,
              },
            }}
          />
        </Grid>
      </Grid>
      <Box sx={{ mt: 3, textAlign: "right" }}>
        {!editing ? (
          <Button variant="contained" color="primary" onClick={handleEdit}>
            Edit Address
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save Address
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ShippingAddress;
