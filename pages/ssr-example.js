import Head from 'next/head'
import cubejs from '@cubejs-client/core'
import styles from '../styles/Home.module.css'

export default function SSRCube({ data, error }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>SSR Example</title>
        <meta name="description" content="SSR Example With Cube" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>{JSON.stringify(data)}</div>
    </div>
  )
}

export async function getServerSideProps(context) {
  let error = null;

  const cubejsApi = cubejs(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NDk5NDMwNjN9.dlHB-K3VLwc4gcEuC7SDYCrWE7_pgunm55WMGeRrWMc",
    {
      apiUrl:
        "https://comparative-guineafowl.gcp-us-central1.cubecloudapp.dev/cubejs-api/v1"
    }
  );

  const startDate = '2017-08-02';
  const endDate = '2018-10-31';

  try {
    const resultSet = await cubejsApi
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