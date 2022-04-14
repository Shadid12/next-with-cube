import cubejs from '@cubejs-client/core'
import styles from '../styles/Home.module.css'
import { stackedChartData } from '../util';
import LineChart from '../components/LineChart';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SSRCube({ data, error }) {
  const [_, setLoading] = useState(true);

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
      <p>You can change the 
        <code> startDate </code>and <code> endDate </code> 
        in the <b>url</b> bar to see the charts change. 
      </p>
      <LineChart data={data} />
    </div>
  )
}

export async function getServerSideProps({ query }) {
  const cubejsApi = cubejs(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NDk5NDMwNjN9.dlHB-K3VLwc4gcEuC7SDYCrWE7_pgunm55WMGeRrWMc",
    {
      apiUrl:
        "https://comparative-guineafowl.gcp-us-central1.cubecloudapp.dev/cubejs-api/v1"
    }
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
            dateRange: query ? [startDate, endDate] : ['2017-08-02', '2018-10-31']
          }
        ]
      }) 
    
    return {
      props: {
        data: stackedChartData(resultSet)
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