import React from "react";
import styled from "styled-components";
import { Appointment } from "../services/AppointmentsService";
import { AppointmentsHistoryEntry } from "./AppointmentsHistoryEntry";
import { DoctorDashboardComponentContainer } from "./DoctorDashboardComponentContainer";

const Container = styled(DoctorDashboardComponentContainer)`
  min-width: 0;
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

export interface AppointmentsHistory {
  appointments : Array<Appointment>;
}

export const AppointmentsHistory = React.memo((props : AppointmentsHistory) => {
  const {
    appointments
  } = props;

  return (
    <Container>
      <HistoryLabel>History</HistoryLabel>

      <AppointmentsHistoryEntryList>
        {
          appointments.map(appointment =>
            <AppointmentsHistoryEntry 
              key={appointment.id}
              appointment={appointment}
            />)
        }
      </AppointmentsHistoryEntryList>

    </Container>
  );
});

AppointmentsHistory.displayName = "AppointmentsHistory";