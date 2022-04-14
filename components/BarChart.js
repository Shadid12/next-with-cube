import { Chart, Axis, Tooltip, Geom } from "bizcharts";


export default function BarChart({ data, pivotConfig }) {

  const stacked = !(pivotConfig.x || []).includes("measures");
  
  return (
    <Chart
      scale={{
        x: {
          tickCount: 8
        }
      }}
      autoFit
      height={400}
      data={data}
      forceFit
    >
      <Axis name="x" />
      <Axis name="measure" />
      <Tooltip />
      <Geom
        type="interval"
        position="x*measure"
        color="color"
        adjust={stacked ? "stack" : "dodge"}
      />
    </Chart>
  );
};