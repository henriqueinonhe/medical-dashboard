import React from "react";
import styled from "styled-components";
import { AllowedTime, formatAllowedTime, Weekday } from "../helpers/calendarHelper";
import { AppointmentsService, AppointmentStatus, AppointmentType } from "../services/AppointmentsService";

interface ContainerProps {
  weekday : Weekday;
  startTime : AllowedTime;
  endTime : AllowedTime;
}

const Container = styled.div<ContainerProps>`
  grid-column-start: ${props => props.weekday};
  grid-row-start: ${props => formatAllowedTime(props.startTime)};
  grid-row-end: ${props => formatAllowedTime(props.endTime)};

  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #4a7dff;
  border-radius: 3px;
  padding: 10px;

  //TEMP
  overflow-y: hidden;
`;

const PatientNameField = styled.span`
  font-weight: bold;
  color: white;
  text-align: center;
`;

const TypeAndStatusRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  color: white;
  font-size: 14px;
`;

const TypeField = styled.span`
  color: white;
`;

const StatusField = styled.span`
  color: white;
`;

const DescriptionField = styled.span`
  color: white;
  margin-top: 4px;
  font-size: 14px;
`;

export interface AppointmentCardProps {
  weekday : Weekday;
  startTime : AllowedTime;
  endTime : AllowedTime;
  patientName : string;
  description : string;
  type : AppointmentType;
  status : AppointmentStatus;
}

export const AppointmentCard = React.memo((props : AppointmentCardProps) => {
  const {
    weekday,
    startTime,
    endTime,
    patientName,
    description,
    type,
    status
  } = props;

  const displayableType = AppointmentsService.displayableAppointmentType[type];
  const displayableStatus = AppointmentsService.displayableAppointmentStatus[status];

  return (
    <Container
      weekday={weekday}
      startTime={startTime}
      endTime={endTime}
    >
      <PatientNameField>{patientName}</PatientNameField>
      <TypeAndStatusRow>
        <TypeField>{displayableType}</TypeField> | 
        <StatusField>{displayableStatus}</StatusField>
      </TypeAndStatusRow>
      <DescriptionField>{description}</DescriptionField>
    </Container>
  );
});

AppointmentCard.displayName = "AppointmentCard";