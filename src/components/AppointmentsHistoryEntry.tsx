import Dayjs from "../helpers/dayjs";
import React from "react";
import styled from "styled-components";
import { Appointment, AppointmentsService, AppointmentStatus } from "../services/AppointmentsService";

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 0;
  margin: 0 4px;
  border-bottom: 1px solid #a8a8a8;

  &:last-of-type {
    border-bottom: none;
  }
`;

const DateTimeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const DateField = styled.span``;

const TimeField = styled.span``;

const statusChipColorMatrix : {
  [Key in AppointmentStatus] : string;
} = {
  absent: "#f53b3b",
  cancelled: "#808080",
  completed: "#30e339",
  pending: "#d9b732"
};

interface StatusChipProps {
  status : AppointmentStatus;
}

const StatusChip = styled.div<StatusChipProps>`
  background-color: ${props => statusChipColorMatrix[props.status]};
  color: white;
  border-radius: 100px;
  padding: 6px;
  font-size: 14px;
  margin-left: 20px;
`;

const PatientNameField = styled.span`
  margin-left: 20px;
`;

const TypeField = styled.span`
  margin-left: 20px;
`;

export interface AppointmentsHistoryEntryProps {
  appointment : Appointment;
}

export const AppointmentsHistoryEntry = React.memo((props : AppointmentsHistoryEntryProps) => {
  const {
    appointment
  } = props;

  const {
    startTime,
    endTime,
    status,
    patient,
    type
  } = appointment;

  const actualStartTime = Dayjs(startTime);
  //FIXME This should be done by the service
  const actualEndTime = endTime ? Dayjs(endTime) : Dayjs(startTime).add(30, "minutes");
  const displayableDate = actualStartTime.format("MM/DD/YYYY");
  const displayableStartTime = actualStartTime.format("HH:mm");
  const displayableEndTime = actualEndTime.format("HH:mm");
  const displayableStatus = AppointmentsService.displayableAppointmentStatus[status];
  const displayableType = AppointmentsService.displayableAppointmentType[type];

  return (
    <Container>
      <DateTimeContainer>
        <DateField>{displayableDate}</DateField>
        &nbsp;
        <TimeField>{displayableStartTime} - {displayableEndTime}</TimeField>
      </DateTimeContainer>

      <StatusChip status={status}>
        {displayableStatus}
      </StatusChip>

      <PatientNameField>{patient.name}</PatientNameField>

      <TypeField>{displayableType}</TypeField>
    </Container>
  );
});

AppointmentsHistoryEntry.displayName = "AppointmentsHistoryEntry";