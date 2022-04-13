import cubejs from "@cubejs-client/core";
import { useEffect, useState } from 'react';
import { Chart, Axis, Tooltip, Geom } from "bizcharts";

const cubejsApi = cubejs(
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NDk5NDMwNjN9.dlHB-K3VLwc4gcEuC7SDYCrWE7_pgunm55WMGeRrWMc",
  {
    apiUrl:
      "https://comparative-guineafowl.gcp-us-central1.cubecloudapp.dev/cubejs-api/v1"
  }
);

export default function Dashboard() {

  const startDate = '2017-08-02';
  const endDate = '2018-10-31';

  const [data, setData] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    cubejsApi
      .load({
        measures: ["Orders.count"],
        timeDimensions: [
          {
            dimension: "Orders.createdAt",
            granularity: `day`,
            dateRange: [startDate, endDate]
          }
        ]
      })
      .then((resultSet) => {
        console.log('-->', resultSet);
        setData(resultSet);
      });
  }

  if(!data) { 
    return <div>Loading...</div>
  }

  return (
    <LineChartRenderer resultSet={data}/>
  )
}


const LineChartRenderer = ({ resultSet }) => {
  const data = stackedChartData(resultSet);
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
  );
};

const stackedChartData = (resultSet) => {
  const data = resultSet
    .pivot()
    .map(({ xValues, yValuesArray }) =>
      yValuesArray.map(([yValues, m]) => ({
        x: resultSet.axisValuesString(xValues, ", "),
        color: resultSet.axisValuesString(yValues, ", "),
        measure: m && Number.parseFloat(m)
      }))
    )
    .reduce((a, b) => a.concat(b), []);
  return data;
};