import Router from 'next/router'
import { useState, useEffect } from 'react'
import { Spin } from 'antd'
import '../styles/globals.css'
import 'flatpickr/dist/themes/material_green.css'
import 'antd/dist/antd.css'

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const start = () => {
      console.log("start");
      setLoading(true);
    };
    const end = () => {
      console.log("findished");
      setLoading(false);
    };
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);
    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);

  if(loading) { 
    return <Spin size="large" />
  }

  return <Component {...pageProps} />
}

export default MyApp
