// TODO: could possibly refactor order history from Admin view for re-use
import type React from "react";
import { Paper, Typography, Box, Grid } from "@mui/material";
import ProductCard from "../../ProductCard/ProductCard";
import { ProductModel } from "@/domain/models/ProductModel";
import { useEffect, useState } from "react";

const ViewingHistory: React.FC<{ history: ProductModel[] }> = ({ history }) => {
  const [products, setProducts] = useState<ProductModel[]>([]);

  useEffect(() => {
    if (history.length > 3) setProducts(history.slice(0, 3));
    else setProducts(history);
  }, [history]);

  return (
    <Box
      sx={{
        p: 4,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="subtitle1" color="text.primary" sx={{ mb: 2 }}>
        Your recently viewed items:
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        {products && (
          <Grid container>
            {products.map((item, i) => (
              <Grid size={{ sm: 12, lg: 4 }} sx={{ px: 1, my: 1 }}>
                <ProductCard product={item} width="80" height="150" />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default ViewingHistory;
