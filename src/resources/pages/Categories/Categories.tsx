import { useEffect } from "react";
import { Typography } from "@mui/material";

import { Constants } from "@/domain/constants";

const Categories: React.FC = () => {
  useEffect(() => {
    document.title = `${Constants.BASE_BROWSER_TAB_TITLE} | Categories`;
  });

  return (
    <div>
      <Typography variant="h1">Categories</Typography>
    </div>
  );
};

export default Categories;
