import Dayjs from "../helpers/dayjs";
import React from "react";
import styled from "styled-components";
import { Appointment, AppointmentsService } from "../services/AppointmentsService";
import { AppointmentStatusChip } from "./AppointmentStatusChip";
import { Link } from "react-router-dom";

const Container = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  margin: 0 4px;
  border-bottom: 1px solid #a8a8a8;
  text-decoration: none;
  cursor: pointer;

  &:last-of-type {
    border-bottom: none;
  }
`;

const Column = styled.div`
  display: flex;
  align-items: center;
  width: 50%;
  max-width: 350px;
`;

const LeftColumn = styled(Column)`
  justify-content: space-between;
`;

const RightColumn = styled(Column)`
  justify-content: flex-end;

  @media (min-width: 768px) {
    justify-content: space-between;
  }
`;

const DateTimeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const DateField = styled.span``;

const TimeField = styled.span``;

const StatusChip = styled(AppointmentStatusChip)`
  display: none;
  margin-left: 20px;

  @media (min-width: 768px) {
    display: initial;
  }
`;

const PatientNameField = styled.span`
  margin-left: 20px;
`;

const TypeField = styled.span`
  display: none;
  margin-left: 20px;

  @media (min-width: 768px) {
    display: initial;
  }
`;

export interface AppointmentsHistoryEntryProps {
  appointment : Appointment;
}

export const AppointmentsHistoryEntry = React.memo((props : AppointmentsHistoryEntryProps) => {
  const {
    appointment
  } = props;

  const {
    id,
    startTime,
    endTime,
    status,
    patient,
    type
  } = appointment;

  const actualStartTime = Dayjs(startTime);
  const actualEndTime = endTime ? Dayjs(endTime) : Dayjs(startTime).add(30, "minutes");
  const displayableDate = actualStartTime.format("MM/DD/YYYY");
  const displayableStartTime = actualStartTime.format("HH:mm");
  const displayableEndTime = actualEndTime.format("HH:mm");
  const displayableType = AppointmentsService.displayableAppointmentType[type];

  return (
    <Container to={`/patientDetails/${patient.id}/appointments/${id}`}>
      <LeftColumn>
        <DateTimeContainer>
          <DateField>{displayableDate}</DateField>
          &nbsp;
          <TimeField>{displayableStartTime} - {displayableEndTime}</TimeField>
        </DateTimeContainer>

        <StatusChip status={status} />
      </LeftColumn>

      <RightColumn>
        <PatientNameField>{patient.name}</PatientNameField>

        <TypeField>{displayableType}</TypeField>
      </RightColumn>

    </Container>
  );
});

AppointmentsHistoryEntry.displayName = "AppointmentsHistoryEntry";