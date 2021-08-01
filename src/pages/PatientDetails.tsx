import { useAsync, useIsMounted } from "@henriqueinonhe/react-hooks";
import Dayjs from "../helpers/dayjs";
import React, { useState } from "react";
import { useParams } from "react-router";
import { PageLayout } from "../components/PageLayout";
import { PatientInfo } from "../components/PatientInfo";
import { AppointmentsService, RawAppointment } from "../services/AppointmentsService";
import { Patient, PatientsService } from "../services/PatientsService";
import { PatientAppointmentsInfo } from "../components/PatientAppointmentsInfo";

export function PatientDetails() : JSX.Element {
  const { id } = useParams<{ id : string }>();
  const patientId = parseInt(id);
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

  return (
    <PageLayout>
      {
        dataIsLoading ?
          <>Loading ... </> :
          <>
            <PatientInfo 
              patient={patient!}
              lastAppointment={lastAppointment}
            />

            <PatientAppointmentsInfo 
              appointments={appointments}
            />
          </>
      }
    </PageLayout>
  );
}

export default PatientDetails;