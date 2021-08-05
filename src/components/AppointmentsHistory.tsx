import React, { useState } from "react";
import styled from "styled-components";
import { Appointment, AppointmentsService } from "../services/AppointmentsService";
import { AppointmentsHistoryEntry } from "./AppointmentsHistoryEntry";
import { DoctorDashboardComponentContainer } from "./DoctorDashboardComponentContainer";
import { useAsync, useIsMounted } from "@henriqueinonhe/react-hooks";
import { SpinnerWrapper } from "./SpinnerWrapper";

const Container = styled(DoctorDashboardComponentContainer)`
  min-width: 320px;
`;

const HistoryLabel = styled.span`
  font-weight: bold;
`;

const AppointmentsHistoryEntryList = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 12px;
  border-radius: 3px;
  border: 1px solid #a8a8a8; //NOTE Maybe extract to theme
  padding: 12px;
`;

export const AppointmentsHistory = React.memo(() => {
  const [appointments, setAppointments] = useState<Array<Appointment<"patient">>>([]);
  const [dataIsLoading, setDataIsLoading] = useState(true);
  const isMounted = useIsMounted();

  useAsync(isMounted, async () => {

    return await AppointmentsService.fetchAppointments({
      _embed: "patient",
      _sort: "startTime",
      _order: "desc"
    });

  }, (fetchedAppointments) => {
    
    setAppointments(fetchedAppointments);

  }, [], setDataIsLoading);

  return (
    <Container>
      <HistoryLabel>History</HistoryLabel>

      <SpinnerWrapper isLoading={dataIsLoading}>
        <AppointmentsHistoryEntryList>
          {
            appointments.map(appointment =>
              <AppointmentsHistoryEntry 
                key={appointment.id}
                appointment={appointment}
              />)
          }
        </AppointmentsHistoryEntryList>
      </SpinnerWrapper>
    </Container>
  );
});

AppointmentsHistory.displayName = "AppointmentsHistory";