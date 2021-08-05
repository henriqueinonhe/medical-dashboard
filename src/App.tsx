import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDetails from "./pages/PatientDetails";

const GlobalStyles = createGlobalStyle`
  /* http://meyerweb.com/eric/tools/css/reset/ 
   v2.0 | 20110126
   License: none (public domain)
*/

  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed, 
  figure, figcaption, footer, header, hgroup, 
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    vertical-align: baseline;
  }
  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure, 
  footer, header, hgroup, menu, nav, section {
    display: block;
  }
  body {
    line-height: 1;
  }
  ol, ul {
    list-style: none;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  html, body, #root {
    height: 100%
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Arial";
    color: #333;
  }
`;


export function App() : JSX.Element {
  return (
    <>
      <GlobalStyles />
      <BrowserRouter>
        <Switch>
          <Route path="/dashboard">
            {/* TODO Lazy Load */}
            <DoctorDashboard /> 
          </Route>

          <Route 
            path={[
              "/patientDetails/:patientId/appointments/:appointmentId",
              "/patientDetails/:patientId"
            ]}
          >
            {/* TODO Lazy Load */}
            <PatientDetails />
          </Route>
          <Redirect to="/dashboard/calendar"/>
        </Switch>
      </BrowserRouter>
    </>
  );
}
