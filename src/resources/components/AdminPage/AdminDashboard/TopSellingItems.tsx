import { OrderProductModel } from "@/domain/models/OrderModel";
import { OrderService } from "@/services/order-service";
import { Box, Card, CardContent, CardMedia, Divider, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const orderService = new OrderService;

/**
 * Component to display top selling items listed on BDNX.
 */
export default function TopSellingItems() {
  const [topSellingItems, setTopSellingItems] = useState<OrderProductModel[]>();

  /**
   * A useEffect required to get required information on mount.
   */
  useEffect(() => {
    fetchRequiredInformation();
  }, []);

  /**
   * Sets the top sold items for admins to see their most popular products.
   */
  async function fetchRequiredInformation() {
    setTopSellingItems(await orderService.getMostPurchasedProducts({ limit: 2 }))
  }
  return (
    <Grid size={12} textAlign={"center"}>
      <Card sx={{ p: 1, height: "310px", borderRadius: 3 }}>
        <Typography fontSize={24} pb={1}>Top Selling Items</Typography>
        <Divider
          sx={{ backgroundColor: "#8EB5C0", maxWidth: "80%", mx: "auto" }}
        />
        <CardContent>
          <Grid container spacing={2}>
            {topSellingItems && topSellingItems.map((item, index) => (
              <Grid size={12} key={index}>
                <Card
                  variant="outlined"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1.5,
                    borderRadius: 2,
                  }}
                >
                  <CardMedia
                    component="img"
                    image={item.images?.[0]}
                    alt={item.name}
                    loading="lazy"
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 2,
                      objectFit: "cover",
                      mr: 2,
                    }}
                  />
                  <Box display="flex" flexDirection="column" alignItems="flex-start">
                    <Typography variant="subtitle1" fontWeight="500">
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Sold: {item.total_quantity_purchased}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Grid >
  )
}
