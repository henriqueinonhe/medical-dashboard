import React from "react";
import styled from "styled-components";
import { AppointmentsService, RawAppointment } from "../services/AppointmentsService";
import { AppointmentStatusChip } from "./AppointmentStatusChip";
import Dayjs from "../helpers/dayjs";

interface ContainerProps {
  isActive : boolean;
}

const Container = styled.div<ContainerProps>`
  display: flex;
  padding: 10px;
  align-items: center;
  justify-content: space-between;
  background-color: ${props => props.isActive ? "#d7e9fc" : "transparent"};
  cursor: pointer;
  border-radius: 5px;
`;

const DateTimeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`;

const DateField = styled.span`

`;

const TimeField = styled.span`
`;

const TypeField = styled.span`
  margin-left: 20px;
`;

const StatusChip = styled(AppointmentStatusChip)`
  margin-left: 20px;
`;

export interface PatientAppointmentsListEntryProps {
  appointment : RawAppointment;
  isActive : boolean;
  onClick : () => void;
}

export const PatientAppointmentsListEntry = React.memo((props : PatientAppointmentsListEntryProps) => {
  const {
    appointment,
    isActive,
    onClick
  } = props;

  const {
    startTime,
    endTime,
    type,
    status
  } = appointment;

  const actualStartTime = Dayjs(startTime);
  const actualEndTime = endTime ? Dayjs(endTime) : Dayjs(startTime).add(30, "minutes");
  const displayableDate = actualStartTime.format("MM/DD/YYYY");
  const displayableStartTime = actualStartTime.format("HH:mm");
  const displayableEndTime = actualEndTime.format("HH:mm");
  const displayableType = AppointmentsService.displayableAppointmentType[type];

  return (
    <Container isActive={isActive} onClick={onClick}>
      <DateTimeContainer>
        <DateField>{displayableDate}</DateField>
        &nbsp;
        <TimeField>{displayableStartTime} - {displayableEndTime}</TimeField>
      </DateTimeContainer>

      <TypeField>{displayableType}</TypeField>

      <StatusChip status={status} />
    </Container>
  );
});

PatientAppointmentsListEntry.displayName = "PatientAppointmentsListEntry";