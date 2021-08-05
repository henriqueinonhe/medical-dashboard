import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { AllowedTime, formatAllowedTime, Weekday } from "../helpers/calendarHelper";
import { AppointmentsService, AppointmentStatus, AppointmentType } from "../services/AppointmentsService";

interface ContainerProps {
  weekday : Weekday;
  startTime : AllowedTime;
  endTime : AllowedTime;
}

const Container = styled(({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  weekday,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  startTime,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  endTime,
  ...props
}) => <Link {...props}/>)<ContainerProps>`
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
  cursor: pointer;
  text-decoration: none;

  // transition: 350ms;
  // transition-timing-function: ease-out;

  // &:hover {
  //   transform: translateY(-12px);
  // }
`;

const Content = styled.div`
  overflow: hidden;
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

const TooltipContainer = styled.div`
  display: flex;
  align-items: center;
  height: 100%;

  z-index: 9999;
  position: absolute;
  left: calc(100% + 18px);
  top: 0;
  opacity: 0;
  visibility: hidden;

  ${Container}:hover & {
    opacity: 1;
    visibility: visible;
  }
`;

const Tooltip = styled.div`
  width: 200px;
  padding: 20px;
  background-color: rgba(43, 43, 43, 0.95);
  color: white;
  border-radius: 3px;

  ${Container}:hover & {
    opacity: 1;
    visibility: visible;
  }

  &::before {
    content: "";
    position: absolute;
    top: calc(50% - 10px);
    left: 0;
    margin-left: -20px;
    border-width: 10px;
    border-style: solid;
    border-color: transparent rgba(43, 43, 43, 0.95) transparent transparent;
  }
`;

export interface AppointmentCardProps {
  appointmentId : number;
  weekday : Weekday;
  startTime : AllowedTime;
  endTime : AllowedTime;
  patientId : number;
  patientName : string;
  description : string;
  type : AppointmentType;
  status : AppointmentStatus;
}

export const AppointmentCard = React.memo((props : AppointmentCardProps) => {
  const {
    appointmentId,
    weekday,
    startTime,
    endTime,
    patientId,
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
      to={`/patientDetails/${patientId}/appointments/${appointmentId}`}
    >
      <Content>
        <PatientNameField>{patientName}</PatientNameField>
        <TypeAndStatusRow>
          <TypeField>{displayableType}</TypeField> | 
          <StatusField>{displayableStatus}</StatusField>
        </TypeAndStatusRow>
      </Content>

      <TooltipContainer>
        <Tooltip>{description}</Tooltip>
      </TooltipContainer>
    </Container>
  );
});

AppointmentCard.displayName = "AppointmentCard";