import React, { useState } from "react";
import { AppointmentsCalendar } from "../components/AppointmentsCalendar";
import { AppointmentsHistory } from "../components/AppointmentsHistory";
import { PageLayout } from "../components/PageLayout";
import Dayjs from "../helpers/dayjs";
import { Appointment, AppointmentsService } from "../services/AppointmentsService";
import { Patient, PatientsService } from "../services/PatientsService";
import { useAsync, useIsMounted } from "@henriqueinonhe/react-hooks";
import { PatientsList } from "../components/PatientsList";
import { Route, Switch, useLocation } from "react-router";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { SpinnerWrapper } from "../components/SpinnerWrapper";

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
  const [patients, setPatients] = useState<Array<Patient>>([]);
  const [appointments, setAppointments] = useState<Array<Appointment<"patient">>>([]);
  const [dataIsLoading, setDataIsLoading] = useState(true);
  const isMounted = useIsMounted();
  const location = useLocation();
  
  useAsync(isMounted, async () => {
    
    return await AppointmentsService.fetchAppointments({
      _embed: "patient"
    });

  }, (fetchedAppointments) => {
    const filteredAppointments = fetchedAppointments
      .filter(appointment => 0 < Dayjs(appointment.startTime).day() && Dayjs(appointment.startTime).day() < 6);

    //TEMP
    const fetchedPatients : Array<Patient> = [];
    for(const appointment of fetchedAppointments) {
      if(!fetchedPatients.some(patient => patient.id === appointment.patientId)) {
        fetchedPatients.push(appointment.patient!);
      }
    }

    setPatients(fetchedPatients);
    setAppointments(filteredAppointments);
  }, [], setDataIsLoading);

  return (
    <PageLayout>
      {
        <SpinnerWrapper isLoading={dataIsLoading}>
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
              <AppointmentsCalendar 
                minWeekday="monday"
                maxWeekday="friday"
                minTime="09:00"
                maxTime="18:00"
                currentDate={Dayjs()}
                appointments={appointments}
              />
            </Route>

            <Route path="/dashboard/history">
              <AppointmentsHistory 
                appointments={appointments}
              />
            </Route>

            <Route path="/dashboard/patients">
              <PatientsList 
                patients={patients}
              />
            </Route>
          </Switch>
        </SpinnerWrapper>
      }
      
    </PageLayout>
  );
}

export default DoctorDashboardPage;