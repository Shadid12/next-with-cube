import cubejs from '@cubejs-client/core'
import styles from '../styles/Home.module.css'
import { stackedChartData } from '../util';
import LineChart from '../components/LineChart';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import BarChart from '../components/BarChart';
import TableRenderer from '../components/Table';
import Flatpickr from "react-flatpickr";
import { useRouter } from 'next/router';

export default function SSRCube({ data, barChartData, error }) {
  const [_, setLoading] = useState(true);
  const router = useRouter();
  const { startDate, endDate } = router.query;

  useEffect(() => {
    if (data) {
      process.nextTick(() => {
        setLoading(false);
      });
    }
  } , [data]);

  return (
    <div className={styles.container}>
      <Link href={`/`}>
        <a className={styles.link}>Client Rendered Example</a>
      </Link>
      <h1>SSR Charts Example</h1>
      
      <h5>🗓️ Select a date range</h5>

      <Flatpickr
        options={{ 
          allowInput: true, 
          mode: "range", 
          minDate: new Date('2016-12-12'),
          maxDate: new Date('2020-12-12') 
        }}
        value={[startDate, endDate]}
        onChange={(selectedDates) => {
          if (selectedDates.length === 2) {
            router.push(`/ssr-example?startDate=${selectedDates[0]}&endDate=${selectedDates[1]}`);
          }
        }}
      />

      <h3>📈 Order count timeseries</h3>
      <LineChart data={data} />

      <h3>📊 Order count by Suppliers</h3>
      <BarChart 
        data={barChartData} 
        pivotConfig={{
          x: ["Suppliers.company"],
          y: ["measures"],
          fillMissingDates: true,
          joinDateRange: false
        }}
      />

      <h3>📋 Order Table</h3>
      <TableRenderer data={barChartData} />

    </div>
  )
}

export async function getServerSideProps({ query }) {
  const cubejsApi = cubejs(
    process.env.NEXT_PUBLIC_CUBEJS_TOKEN,
    { apiUrl: process.env.NEXT_PUBLIC_CUBEJS_API_URL }
  );

  const { startDate, endDate } = query;

  try {
    const resultSet = await cubejsApi
      .load({
        measures: ["Orders.count"],
        timeDimensions: [
          {
            dimension: "Orders.createdAt",
            granularity: `day`,
            dateRange: query ? [startDate, endDate] : ['2017-08-02', '2018-01-31']
          }
        ]
      });

    const barChartResult = await cubejsApi
      .load({
        measures: ["Orders.count"],
        timeDimensions: [
          {
            dimension: "Orders.createdAt",
            dateRange: query ? [startDate, endDate] : ['2017-08-02', '2018-01-31']
          }
        ],
        order: {
          "Orders.count": "desc"
        },
        dimensions: ["Suppliers.company"],
        "filters": []
      })
    
    return {
      props: {
        data: stackedChartData(resultSet),
        barChartData: stackedChartData(barChartResult)
      }
    }
  } catch (error) {
    return {
      props: {
        error
      }
    }
  }
}