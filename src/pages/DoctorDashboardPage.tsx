import React from "react";
import { AppointmentsHistory } from "../components/AppointmentsHistory";
import { PageLayout } from "../components/PageLayout";
import { PatientsList } from "../components/PatientsList";
import { Route, Switch, useLocation } from "react-router";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { AppointmentsCalendarContainer } from "../components/AppointmentsCalendarContainer";

const NavLinkList = styled.div`
  display: flex;
  background-color: white;
  min-width: 700px;
  max-width: 1000px;
  width: 70vw;
  margin: auto;
  padding: 24px;
  background-color: white;
  border-radius: 3px;
  margin-bottom: 20px;
`;

interface NavLinkProps {
  active : boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const NavLink = styled(({active, ...props}) => <Link {...props} />)<NavLinkProps>`
  margin-left: 20px;
  padding: 12px;
  border-radius: 4px;
  text-decoration: none;
  font-family: 18px;

  background-color: ${props => props.active ? "#4a7dff" : "transparent"};
  color: ${props => props.active ? "white" : "initial"};
`;

export function DoctorDashboardPage() : JSX.Element {
  const location = useLocation();

  return (
    <PageLayout>
      <NavLinkList>
        <NavLink
          to="/dashboard/calendar"
          active={location.pathname === "/dashboard/calendar"}
        >
          Calendar
        </NavLink>

        <NavLink
          to="/dashboard/history"
          active={location.pathname === "/dashboard/history"}
        >
          History
        </NavLink>

        <NavLink
          to="/dashboard/patients"
          active={location.pathname === "/dashboard/patients"}
        >
          Patients
        </NavLink>
      </NavLinkList>

      <Switch>
        <Route path="/dashboard/calendar">
          <AppointmentsCalendarContainer />
        </Route>

        <Route path="/dashboard/history">
          <AppointmentsHistory />
        </Route>

        <Route path="/dashboard/patients">
          <PatientsList />
        </Route>
      </Switch>
    </PageLayout>
  );
}

export default DoctorDashboardPage;