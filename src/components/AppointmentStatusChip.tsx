import React from "react";
import styled from "styled-components";
import { AppointmentsService, AppointmentStatus } from "../services/AppointmentsService";

const statusChipColorMatrix : {
  [Key in AppointmentStatus] : string;
} = {
  absent: "#f53b3b",
  cancelled: "#808080",
  completed: "#30e339",
  pending: "#d9b732"
};

export const Container = styled.div<AppointmentStatusChipProps>`
  background-color: ${props => statusChipColorMatrix[props.status]};
  color: white;
  border-radius: 100px;
  padding: 6px;
  font-size: 14px;
`;

export interface AppointmentStatusChipProps {
  status : AppointmentStatus;
  className ?: string;
}

export const AppointmentStatusChip = React.memo((props : AppointmentStatusChipProps) => {
  const {
    status
  } = props;

  const displayableStatus = AppointmentsService.displayableAppointmentStatus[status];

  return (
    <Container {...props}>
      {displayableStatus}
    </Container>
  );
});

AppointmentStatusChip.displayName = "AppointmentStatusChip";