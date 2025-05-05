import { useEffect } from "react";
import { Typography } from "@mui/material";

export default function Cart() {
    useEffect(() => {
        document.title = "eCommerce | Cart";
      });
    
      return (
        <div>
          <Typography variant="h1">Cart</Typography>
        </div>
      );
};
