import { Grid, Paper, Typography } from "@mui/material";
import { BarChart, BarPlot } from '@mui/x-charts/BarChart';

/**
 * Sales Overview component to show the number of daily sales for the past 
 * few days that have occurred on the website.
 */
export default function SalesOverview() {
  return (
    <Grid size={12}>
      <Typography textAlign={"center"} fontSize={24}>Sales Overview</Typography>
      <Paper
        sx={{
          height: "100%",
        }}
        elevation={1}
      >
        <BarChart
          margin={{ right: 50 }}
          height={250}
          series={
            [{
              data: [1, 2, 5, 3, 1] // No need to specify it is a bar series
            }]}
          xAxis={
            [
              {
                data: ['02/06', '03/06', '04/06', '05/06', '06/06'],
                scaleType: 'band',
                height: 45,
              },
            ]}
        />
      </Paper >
    </Grid >
  )
}
