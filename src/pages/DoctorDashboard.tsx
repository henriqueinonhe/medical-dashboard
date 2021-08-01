import React, { useState } from "react";
import { AppointmentsCalendar } from "../components/AppointmentsCalendar";
import { AppointmentsHistory } from "../components/AppointmentsHistory";
import { PageLayout } from "../components/PageLayout";
import Dayjs from "../helpers/dayjs";
import { Appointment, AppointmentsService } from "../services/AppointmentsService";
import { Patient, PatientsService } from "../services/PatientsService";
import { useAsync, useIsMounted } from "@henriqueinonhe/react-hooks";
import { PatientsList } from "../components/PatientsList";

export function DoctorDashboard() : JSX.Element {
  const [patients, setPatients] = useState<Array<Patient>>([]);
  const [appointments, setAppointments] = useState<Array<Appointment>>([]);
  const [dataIsLoading, setDataIsLoading] = useState(true);
  const isMounted = useIsMounted();
  
  useAsync(isMounted, async () => {
    return await Promise.all([
      PatientsService.fetchPatients(),
      AppointmentsService.fetchAppointments()
    ]);
  }, ([fetchedPatients, fetchedAppointments]) => {
    //NOTE Maybe this could be moved to the calendar itself
    const filteredAppointments = fetchedAppointments
      .filter(appointment => 0 < Dayjs(appointment.startTime).day() && Dayjs(appointment.startTime).day() < 6);
    setPatients(fetchedPatients);
    setAppointments(filteredAppointments);
  }, [], setDataIsLoading);

  return (
    <PageLayout>
      {
        dataIsLoading ?
          <>Loading...</> :
          <>
            <AppointmentsCalendar 
              minWeekday="monday"
              maxWeekday="friday"
              minTime="09:00"
              maxTime="18:00"
              currentDate={Dayjs()}
              appointments={appointments}
            />

            <AppointmentsHistory 
              appointments={appointments}
            />

            <PatientsList 
              patients={patients}
            />
          </>
      }
      
    </PageLayout>
  );
}

export default DoctorDashboard;