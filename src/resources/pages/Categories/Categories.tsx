import { useEffect } from "react";
import { Typography } from "@mui/material";

const Categories: React.FC = () => {
  useEffect(() => {
    document.title = "eCommerce | Categories";
  });

  return (
    <div>
      <Typography variant="h1">Categories</Typography>
    </div>
  );
};

export default Categories;
