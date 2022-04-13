import { useEffect, useState } from 'react';
import cubejs from "@cubejs-client/core";
import Flatpickr from "react-flatpickr";
import LineChart from '../components/LineChart'
import { stackedChartData } from '../util';
import Link from 'next/link';
import styles from '../styles/Home.module.css';


const cubejsApi = cubejs(
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NDk5NDMwNjN9.dlHB-K3VLwc4gcEuC7SDYCrWE7_pgunm55WMGeRrWMc",
  {
    apiUrl:
      "https://comparative-guineafowl.gcp-us-central1.cubecloudapp.dev/cubejs-api/v1"
  }
);

export default function Home() {

  const [data, setData] = useState(null);
  const [error, setError] = useState (null);
  const [dateRange, setDateRange] = useState({
    startDate: '2017-08-02',
    endDate: '2018-10-31'
  });

  useEffect(() => {
    loadData();
  }, [dateRange]);
  
  const loadData = () => {
    cubejsApi
      .load({
        measures: ["Orders.count"],
        timeDimensions: [
          {
            dimension: "Orders.createdAt",
            granularity: `day`,
            dateRange: [dateRange.startDate, dateRange.endDate]
          }
        ]
      })
      .then((resultSet) => {
        setData(stackedChartData(resultSet));
      })
      .catch((error) => {
        setError(error);
      })
  }

  if(error) {
    return <div>Error: {error.message}</div>
  }

  if(!data) {
    return <div>Loading...</div>
  }

  return (
    <div className={styles.container}>
      <h1>Client Rendered Charts Example</h1>
      <h5>Select a date range</h5>
      <Flatpickr
        options={{ 
          allowInput: true, 
          mode: "range", 
          minDate: new Date('2016-12-12'),
          maxDate: new Date('2020-12-12') 
        }}
        value={[dateRange.startDate, dateRange.endDate]}
        onChange={(selectedDates) => {
          if (selectedDates.length === 2) {
            setDateRange({
              startDate: selectedDates[0],
              endDate: selectedDates[1]
            })
          }
        }}
      />
      <LineChart data={data}/>
      <div className={styles.p}>
        <Link href="/ssr-example">
          <a className={styles.card}>View SSR Example</a>
        </Link>
      </div>
    </div>
  )
}
