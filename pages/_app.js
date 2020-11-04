
//IMPORTS

import './app.css'
import './alerts.css'
import Header from '../src/components/commons/header/header';

//DEPENDENCIAS

import { wrapper } from "../redux/store";
import Head from "next/head";
import Alert from "react-s-alert";
import { useEffect, useState } from 'react';
import "react-s-alert/dist/s-alert-css-effects/stackslide.css";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import SideBar from '../src/components/commons/sidebar';
import { Row, Col } from 'react-bootstrap';
import { validateFirstLogin, validateLoggedInUser } from '../src/utils/Auth';
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import esLocale from "date-fns/locale/es";
import NProgress from "nprogress";
import Router from "next/router";
import "./progress_bar.css";

//APLICACIÓN

// Animacion de cambio de pagina
Router.events.on("routeChangeStart", () => NProgress.inc());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const App = ({ Component, pageProps, router }) => {
  const AUTH_USER = validateLoggedInUser();

  useEffect(() => {
    if (
      AUTH_USER !== undefined &&
      AUTH_USER.user?.isLoggedIn &&
      (router.route.match(/(login)/) || router.route.match(/(register)/) || router.route === '/')
    ) {
      router.push("/dashboard");
    }
    if (
      AUTH_USER !== undefined &&
      router.route.match(/(dashboard)/) &&
      !AUTH_USER.user.isLoggedIn
    ) {
      router.push("/");
    }
    if (AUTH_USER === undefined) {
      router.push("/");
    }
  }, []);


  return (
    <>
      <Head>
        <title>OnTrack</title>
        <link rel="icon" href="/OnTrack_mini.svg" /> {/* TODO favicon */}
        <link
          href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,700,800"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
          integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"></link>
        <script src="https://code.jquery.com/jquery-1.12.4.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.3/jspdf.min.js"></script>
        <script src="https://html2canvas.hertzen.com/dist/html2canvas.js"></script>
      </Head>
      <Alert timeout={3000} stack={true} />
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
        {router.route.match(/(dashboard)/i) ? (

          <Row lg={12} md={12} sm={12} xs={12} style={{ margin: 0 }}>
            <SideBar />
            <Col
              id="dashboard_container"
              className="center"
              lg={10}
              md={10}
              sm={12}
              xs={12}
            >
              <Header />
              <Row lg={12} md={12} sm={12} xs={12}>
                <Col
                  id="component_container"
                  className="center"
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                >
                  <Component {...pageProps} key={router.route} />
                </Col>
              </Row>
            </Col>
          </Row>
        ) :

          <Component {...pageProps} />

        }
      </MuiPickersUtilsProvider>
    </>

  )
}

export default wrapper.withRedux(App);