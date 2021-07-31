import { useAsync, useIsMounted } from "@henriqueinonhe/react-hooks";
import React, { useState } from "react";
import { useParams } from "react-router";
import { PageLayout } from "../components/PageLayout";
import { AppointmentsService, RawAppointment } from "../services/AppointmentsService";
import { Patient, PatientsService } from "../services/PatientsService";

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

  return (
    <PageLayout>
      
    </PageLayout>
  );
}

export default PatientDetails;