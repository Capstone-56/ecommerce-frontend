import React, { useEffect } from "react";
import { Typography } from "@mui/material";
import Navbar from "../Navigation/Navigation";

const Categories: React.FC = () => {
  useEffect(() => {
    document.title = "eCommerce | Categories";
  });

  return (
    <div>
      <Navbar />
      <Typography variant="h1">Categories</Typography>
    </div>
  );
};

export default Categories;
