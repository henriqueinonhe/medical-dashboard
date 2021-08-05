import { useAsync, useIsMounted } from "@henriqueinonhe/react-hooks";
import Dayjs from "../helpers/dayjs";
import React, { useState } from "react";
import { useParams } from "react-router";
import { PageLayout } from "../components/PageLayout";
import { PatientInfo } from "../components/PatientInfo";
import { AppointmentsService, RawAppointment } from "../services/AppointmentsService";
import { Patient, PatientsService } from "../services/PatientsService";
import { PatientAppointmentsInfo } from "../components/PatientAppointmentsInfo";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { SpinnerWrapper } from "../components/SpinnerWrapper";

const LeftArrowIcon = styled(FontAwesomeIcon).attrs(() => ({
  icon: faArrowLeft
})) `
  margin-top: 20px;
  margin-left: 22px;
  font-size: 60px;
  cursor: pointer;
`;

export function PatientDetailsPage() : JSX.Element {
  const { patientId : patientIdSlug, appointmentId : appointmenIdSlug } = 
    useParams<{ patientId : string, appointmentId : string }>();
  const patientId = parseInt(patientIdSlug);
  const appointmentId = appointmenIdSlug ? parseInt(appointmenIdSlug) : null;
  const [patient, setPatient] = useState<Patient>();
  const [appointments, setAppointments] = useState<Array<RawAppointment>>([]);
  const [dataIsLoading, setDataIsLoading] = useState(true);
  const isMounted = useIsMounted();

  useAsync(isMounted, async () => {
    return await Promise.all([
      AppointmentsService.fetchRawAppointments(),
      PatientsService.fetchSinglePatient(patientId)
    ]);
  }, ([fetchedAppointments, fetchedPatient]) => {
    setAppointments(fetchedAppointments.filter(appointment => 
      appointment.patientId === fetchedPatient.id));
    setPatient(fetchedPatient);
  }, [], setDataIsLoading);

  const appointmentsSortedByLatest = appointments.sort((e1, e2) => 
    Dayjs(e1.startTime).isBefore(Dayjs(e2.startTime)) ? -1 : 1);
  const lastAppointment = appointmentsSortedByLatest[0];
  const activeAppointment = appointments.find(appointment => appointment.id === appointmentId);

  return (
    <PageLayout>
      {
        <SpinnerWrapper isLoading={dataIsLoading}>
          <Link to="/dashboard/calendar">
            <LeftArrowIcon />
          </Link>

          <PatientInfo 
            patient={patient!}
            lastAppointment={lastAppointment}
          />

          <PatientAppointmentsInfo 
            appointments={appointments}
            activeAppointment={activeAppointment}
          />
        </SpinnerWrapper>
      }
    </PageLayout>
  );
}

export default PatientDetailsPage;