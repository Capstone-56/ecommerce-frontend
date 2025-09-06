import { Divider, Grid, Paper, Typography } from "@mui/material";
import { ChartContainer, ChartsXAxis, LinePlot } from "@mui/x-charts";

/**
 * Forecasted sales for future months.
 */
export default function SalesForecast() {
  return (
    <Grid size={12} textAlign={"center"}>
      <Paper
        sx={{ height: "100%", borderRadius: 3, p: 1 }}
        elevation={1}
      >
        <Typography textAlign={"center"} fontSize={24} pb={1}>Sales Forecast</Typography>
        <Divider
          sx={{ backgroundColor: "#8EB5C0", maxWidth: "80%", mx: "auto" }}
        />
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
