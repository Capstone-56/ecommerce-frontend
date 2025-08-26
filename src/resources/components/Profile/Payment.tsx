import { Box, Typography } from "@mui/material";
import React from "react";

const Payment: React.FC = () => {
  return (
    <Box sx={{ p: { xs: 1, md: 4 } }}>
      <Typography variant="h5">Saved Payment Methods</Typography>
    </Box>
  );
};

export default Payment;
