import { Chart, Axis, Tooltip, Geom } from "bizcharts"

export default function Dashboard({data}) {

  if(!data) { 
    return <div>Loading...</div>
  }

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
      <Tooltip
        crosshairs={{
          type: "y"
        }}
      />
      <Geom type="line" position="x*measure" size={2} color="color" />
    </Chart>
  )
}
