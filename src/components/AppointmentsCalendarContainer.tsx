import { useIsMounted, useAsync } from "@henriqueinonhe/react-hooks";
import React, { useState } from "react";
import { Appointment, AppointmentsService } from "../services/AppointmentsService";
import Dayjs from "../helpers/dayjs";
import { AppointmentsCalendar } from "./AppointmentsCalendar";
import { SpinnerWrapper } from "./SpinnerWrapper";

export const AppointmentsCalendarContainer = React.memo(() => {
  const [dataIsLoading, setDataIsLoading] = useState(true);
  const [appointments, setAppointments] = useState<Array<Appointment<"patient">>>([]);
  const isMounted = useIsMounted();
  
  useAsync(isMounted, async () => {

    return await AppointmentsService.fetchAppointments({
      _embed: "patient"
    });

  }, (fetchedAppointments) => {
    const filteredAppointments = fetchedAppointments
      .filter(appointment => 0 < Dayjs(appointment.startTime).day() && Dayjs(appointment.startTime).day() < 6);

    setAppointments(filteredAppointments);
  }, [], setDataIsLoading);

  return (
    <SpinnerWrapper isLoading={dataIsLoading}>
      <AppointmentsCalendar 
        minWeekday="monday"
        maxWeekday="friday"
        minTime="09:00"
        maxTime="18:00"
        currentDate={Dayjs()}
        appointments={appointments}
      />
    </SpinnerWrapper>
  );
});

AppointmentsCalendarContainer.displayName = "AppointmentsCalendarContainer";