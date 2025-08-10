import { Card, CardContent, Grid, List, ListItemText, Paper, Typography } from "@mui/material";
import { ChartContainer, ChartsXAxis, LinePlot } from "@mui/x-charts";

/**
 * Forecasted sales for future months.
 */
export default function SalesForecast() {
  return (
    <Grid size={12} textAlign={"center"}>
      <Typography textAlign={"center"} fontSize={24}>Sales Forecast</Typography>
      <Paper
        sx={{ height: 275 }}
        elevation={1}
      >
        <ChartContainer
          margin={{ right: 80 }}
          series={[
            {
              type: "line",
              data: [1, 2, 3, 2, 1],
            },
            {
              type: "line",
              data: [4, 3, 1, 3, 4],
            },
          ]}
          xAxis={[
            {
              data: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
              scaleType: 'band',
              id: 'x-axis-id',
              height: 45,
            },
          ]}
          height={275}
        >
          <LinePlot />
          <ChartsXAxis axisId="x-axis-id" />
        </ChartContainer>
      </Paper>
    </Grid >
  )
}
