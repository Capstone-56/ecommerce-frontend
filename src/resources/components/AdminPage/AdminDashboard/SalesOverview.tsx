import { OrderService } from "@/services/order-service";
import { Divider, Grid, Paper, Typography } from "@mui/material";
import { BarChart } from '@mui/x-charts/BarChart';
import { useEffect, useState } from "react";

const orderService = new OrderService;

/**
 * Sales Overview component to show the number of daily sales for the past 
 * few days that have occurred on the website.
 */
export default function SalesOverview() {
  const [chartValue, setChartValues] = useState<number[]>([]);
  const [xAxisData, setXAxisData] = useState<string[]>([]);

  /**
   * A useEffect required to get required information on mount.
   */
  useEffect(() => {
    fetchRequiredInformation();
  }, []);

  /**
   * Sets the values required for the X axis and chart values.
   */
  async function fetchRequiredInformation() {
    const response = await orderService.getPastWeekSaleFigures();

    setXAxisData(response.map((day) => day.date.split("2025-")[1]));
    setChartValues(response.map((day) => day.total_sales));
  }

  return (
    <Grid size={12}>
      <Paper
        sx={{
          height: "100%",
          p: 1,
          borderRadius: 3
        }}
        elevation={1}
      >
        <Typography textAlign={"center"} fontSize={24} pb={1}>Sales Overview</Typography>
        <Divider
          sx={{ backgroundColor: "#8EB5C0", maxWidth: "80%", mx: "auto" }}
        />
        <BarChart
          margin={{ right: 50 }}
          height={250}
          series={
            [{
              data: chartValue
            }]}
          xAxis={
            [
              {
                data: xAxisData,
                scaleType: 'band',
                height: 45,
              },
            ]}
        />
      </Paper >
    </Grid >
  )
}
